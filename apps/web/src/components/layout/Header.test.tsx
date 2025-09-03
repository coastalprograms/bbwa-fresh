import { render, screen } from '@testing-library/react'
import { Header } from './Header'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/'
}))

// Mock Next.js image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  }
}))

describe('Header - Theme Toggle Removal', () => {
  beforeEach(() => {
    // Mock scrollTo to avoid errors
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0,
    })
    
    global.addEventListener = jest.fn()
    global.removeEventListener = jest.fn()
  })

  it('does not render theme toggle button', () => {
    render(<Header />)
    
    // Verify theme toggle button is not present
    expect(screen.queryByLabelText('Toggle theme')).not.toBeInTheDocument()
    expect(screen.queryByText('Light')).not.toBeInTheDocument()
    expect(screen.queryByText('Dark')).not.toBeInTheDocument()
    expect(screen.queryByText('System')).not.toBeInTheDocument()
  })

  it('renders navigation items without theme toggle', () => {
    render(<Header />)
    
    // Verify main navigation is still present
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Services')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('renders action button without theme toggle', () => {
    render(<Header />)
    
    // Verify the main action button is present
    expect(screen.getByText('Reach Out')).toBeInTheDocument()
  })
})