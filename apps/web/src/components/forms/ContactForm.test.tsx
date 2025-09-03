import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from './ContactForm'
import { submitContactForm } from '@/app/actions/contact'

// Mock the server action
jest.mock('@/app/actions/contact')
const mockSubmitContactForm = submitContactForm as jest.MockedFunction<typeof submitContactForm>

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/contact'
}))

describe('ContactForm', () => {
  beforeEach(() => {
    mockSubmitContactForm.mockClear()
  })

  it('renders all form fields', () => {
    render(<ContactForm />)
    
    expect(screen.getByLabelText('First Name *')).toBeInTheDocument()
    expect(screen.getByLabelText('Last Name *')).toBeInTheDocument()
    expect(screen.getByLabelText('Email *')).toBeInTheDocument()
    expect(screen.getByLabelText('Phone')).toBeInTheDocument()
    expect(screen.getByLabelText('Service Interest')).toBeInTheDocument()
    expect(screen.getByLabelText('Message *')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument()
  })

  it('shows required field validation', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' })
    await user.click(submitButton)
    
    // HTML5 validation should prevent submission
    const firstNameInput = screen.getByLabelText('First Name *')
    expect(firstNameInput).toBeInvalid()
  })

  it('validates minimum message length', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    
    const messageTextarea = screen.getByLabelText('Message *')
    await user.type(messageTextarea, 'Short message')
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' })
    await user.click(submitButton)
    
    expect(messageTextarea).toBeInvalid()
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    mockSubmitContactForm.mockResolvedValue({ 
      success: true, 
      message: 'Thank you for your message!' 
    })
    
    render(<ContactForm />)
    
    await user.type(screen.getByLabelText('Name *'), 'John Smith')
    await user.type(screen.getByLabelText('Email *'), 'john@example.com')
    await user.type(screen.getByLabelText('Phone'), '0400 000 000')
    await user.type(screen.getByLabelText('Message *'), 'This is a test message with more than 20 characters')
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockSubmitContactForm).toHaveBeenCalledWith({
        name: 'John Smith',
        email: 'john@example.com',
        phone: '0400 000 000',
        message: 'This is a test message with more than 20 characters',
        service_interest: '',
        honeypot: '',
        source_page: '/contact'
      })
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    mockSubmitContactForm.mockImplementation(() => new Promise(() => {})) // Never resolves
    
    render(<ContactForm />)
    
    await user.type(screen.getByLabelText('Name *'), 'John Smith')
    await user.type(screen.getByLabelText('Email *'), 'john@example.com')
    await user.type(screen.getByLabelText('Message *'), 'This is a test message with more than 20 characters')
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' })
    await user.click(submitButton)
    
    expect(screen.getByText('Sending...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('shows success message after successful submission', async () => {
    const user = userEvent.setup()
    mockSubmitContactForm.mockResolvedValue({ 
      success: true, 
      message: 'Thank you for your message!' 
    })
    
    render(<ContactForm />)
    
    await user.type(screen.getByLabelText('Name *'), 'John Smith')
    await user.type(screen.getByLabelText('Email *'), 'john@example.com')
    await user.type(screen.getByLabelText('Message *'), 'This is a test message with more than 20 characters')
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Thank you for your message!')).toBeInTheDocument()
    })
  })

  it('shows error message on submission failure', async () => {
    const user = userEvent.setup()
    mockSubmitContactForm.mockResolvedValue({ 
      success: false, 
      error: 'Failed to submit form' 
    })
    
    render(<ContactForm />)
    
    await user.type(screen.getByLabelText('Name *'), 'John Smith')
    await user.type(screen.getByLabelText('Email *'), 'john@example.com')
    await user.type(screen.getByLabelText('Message *'), 'This is a test message with more than 20 characters')
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to submit form')).toBeInTheDocument()
    })
  })

  it('resets form after successful submission', async () => {
    const user = userEvent.setup()
    mockSubmitContactForm.mockResolvedValue({ 
      success: true, 
      message: 'Thank you for your message!' 
    })
    
    render(<ContactForm />)
    
    const nameInput = screen.getByLabelText('Name *') as HTMLInputElement
    const emailInput = screen.getByLabelText('Email *') as HTMLInputElement
    const messageInput = screen.getByLabelText('Message *') as HTMLTextAreaElement
    
    await user.type(nameInput, 'John Smith')
    await user.type(emailInput, 'john@example.com')
    await user.type(messageInput, 'This is a test message with more than 20 characters')
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(nameInput.value).toBe('')
      expect(emailInput.value).toBe('')
      expect(messageInput.value).toBe('')
    })
  })

  it('has honeypot field for spam protection', () => {
    render(<ContactForm />)
    
    // Find honeypot field by attributes since it has no accessible name
    const honeypotField = document.querySelector('input[name="website"]')
    expect(honeypotField).toBeInTheDocument()
    expect(honeypotField).toHaveClass('hidden')
    expect(honeypotField).toHaveAttribute('tabIndex', '-1')
  })

  it('includes service interest dropdown', () => {
    render(<ContactForm />)
    
    // Just verify the select component is rendered with placeholder
    expect(screen.getByText('Select a service')).toBeInTheDocument()
    
    // Verify the select trigger is clickable
    const selectTrigger = screen.getByText('Select a service').closest('button')
    expect(selectTrigger).toBeInTheDocument()
    expect(selectTrigger).not.toBeDisabled()
  })
})