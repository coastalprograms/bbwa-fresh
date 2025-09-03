import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'
import SettingsPage from './page'

// Mock fetch globally
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>

// Mock components that might cause issues in tests
jest.mock('@/components/admin/AppSidebar', () => {
  return {
    AppSidebar: ({ children, title }: { children: React.ReactNode, title?: string }) => (
      <div data-testid="app-sidebar" data-title={title}>
        {children}
      </div>
    )
  }
})

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  CheckCircle: () => <div data-testid="check-circle" />,
  XCircle: () => <div data-testid="x-circle" />,
  Loader2: () => <div data-testid="loader" />,
  Save: () => <div data-testid="save-icon" />
}))

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

beforeEach(() => {
  mockFetch.mockClear()
})

describe('SettingsPage', () => {
  it('should render loading state initially', () => {
    mockFetch.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 1000))
    )
    
    render(<SettingsPage />)
    
    expect(screen.getByTestId('loader')).toBeInTheDocument()
    expect(screen.getByText('Loading settings...')).toBeInTheDocument()
  })

  it('should load and display settings', async () => {
    const mockSettings = [
      { key: 'terms_and_conditions', value: 'Test terms content' },
      { key: 'privacy_policy', value: 'Test privacy content' }
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSettings
    } as Response)

    render(<SettingsPage />)

    await waitFor(() => {
      expect(screen.getByText('Application Settings')).toBeInTheDocument()
    })

    // Switch to Legal tab
    fireEvent.click(screen.getByText('Legal Documents'))

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test terms content')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test privacy content')).toBeInTheDocument()
    })
  })

  it('should handle save terms and conditions', async () => {
    // Mock initial load
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { key: 'terms_and_conditions', value: 'Initial terms' }
      ]
    } as Response)

    // Mock save response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    } as Response)

    render(<SettingsPage />)

    await waitFor(() => {
      expect(screen.getByText('Application Settings')).toBeInTheDocument()
    })

    // Switch to Legal tab
    fireEvent.click(screen.getByText('Legal Documents'))

    // Update terms content
    const termsTextarea = screen.getByLabelText('Terms & Conditions Content')
    fireEvent.change(termsTextarea, { target: { value: 'Updated terms content' } })

    // Save terms
    const saveButton = screen.getByText('Save Terms & Conditions')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'terms_and_conditions',
          value: 'Updated terms content'
        })
      })
    })
  })

  it('should handle save privacy policy', async () => {
    // Mock initial load
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { key: 'privacy_policy', value: 'Initial privacy' }
      ]
    } as Response)

    // Mock save response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    } as Response)

    render(<SettingsPage />)

    await waitFor(() => {
      expect(screen.getByText('Application Settings')).toBeInTheDocument()
    })

    // Switch to Legal tab
    fireEvent.click(screen.getByText('Legal Documents'))

    // Update privacy content
    const privacyTextarea = screen.getByLabelText('Privacy Policy Content')
    fireEvent.change(privacyTextarea, { target: { value: 'Updated privacy content' } })

    // Save privacy policy
    const saveButton = screen.getByText('Save Privacy Policy')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'privacy_policy',
          value: 'Updated privacy content'
        })
      })
    })
  })

  it('should display success message on successful save', async () => {
    // Mock initial load
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { key: 'terms_and_conditions', value: 'Test terms' }
      ]
    } as Response)

    // Mock successful save
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    } as Response)

    render(<SettingsPage />)

    await waitFor(() => {
      fireEvent.click(screen.getByText('Legal Documents'))
    })

    const saveButton = screen.getByText('Save Terms & Conditions')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText('Settings saved successfully.')).toBeInTheDocument()
      expect(screen.getByTestId('check-circle')).toBeInTheDocument()
    })
  })

  it('should display error message on failed save', async () => {
    // Mock initial load
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { key: 'terms_and_conditions', value: 'Test terms' }
      ]
    } as Response)

    // Mock failed save
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    } as Response)

    render(<SettingsPage />)

    await waitFor(() => {
      fireEvent.click(screen.getByText('Legal Documents'))
    })

    const saveButton = screen.getByText('Save Terms & Conditions')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText('Failed to save settings. Please try again.')).toBeInTheDocument()
      expect(screen.getByTestId('x-circle')).toBeInTheDocument()
    })
  })

  it('should show loading state during save', async () => {
    // Mock initial load
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { key: 'terms_and_conditions', value: 'Test terms' }
      ]
    } as Response)

    // Mock slow save response
    mockFetch.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ success: true })
      } as Response), 1000))
    )

    render(<SettingsPage />)

    await waitFor(() => {
      fireEvent.click(screen.getByText('Legal Documents'))
    })

    const saveButton = screen.getByText('Save Terms & Conditions')
    fireEvent.click(saveButton)

    expect(screen.getByText('Saving...')).toBeInTheDocument()
  })

  it('should handle load errors gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    } as Response)

    render(<SettingsPage />)

    await waitFor(() => {
      expect(screen.getByText('Failed to load settings. Please try again.')).toBeInTheDocument()
      expect(screen.getByTestId('x-circle')).toBeInTheDocument()
    })
  })
})