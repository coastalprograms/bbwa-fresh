import { render, screen } from '@testing-library/react'
import { SwmsStatusIndicator, SwmsCompletionBadge } from '../SwmsStatusIndicator'

describe('SwmsStatusIndicator', () => {
  describe('SwmsJob status indicators', () => {
    it('renders planned status correctly', () => {
      render(<SwmsStatusIndicator status="planned" />)
      
      expect(screen.getByText('Planned')).toBeInTheDocument()
      // Check for presence of status indicator (the Badge component might handle styling)
      const badge = screen.getByText('Planned')
      expect(badge).toBeInTheDocument()
    })

    it('renders active status correctly', () => {
      render(<SwmsStatusIndicator status="active" />)
      
      expect(screen.getByText('Active')).toBeInTheDocument()
      const badge = screen.getByText('Active')
      expect(badge).toBeInTheDocument()
    })

    it('renders completed status correctly', () => {
      render(<SwmsStatusIndicator status="completed" />)
      
      expect(screen.getByText('Completed')).toBeInTheDocument()
      const badge = screen.getByText('Completed')
      expect(badge).toBeInTheDocument()
    })

    it('renders cancelled status correctly', () => {
      render(<SwmsStatusIndicator status="cancelled" />)
      
      expect(screen.getByText('Cancelled')).toBeInTheDocument()
      const badge = screen.getByText('Cancelled')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('SwmsSubmission status indicators', () => {
    it('renders submitted status correctly', () => {
      render(<SwmsStatusIndicator status="submitted" />)
      
      expect(screen.getByText('Submitted')).toBeInTheDocument()
    })

    it('renders under_review status correctly', () => {
      render(<SwmsStatusIndicator status="under_review" />)
      
      expect(screen.getByText('Under Review')).toBeInTheDocument()
    })

    it('renders approved status correctly', () => {
      render(<SwmsStatusIndicator status="approved" />)
      
      expect(screen.getByText('Approved')).toBeInTheDocument()
    })

    it('renders rejected status correctly', () => {
      render(<SwmsStatusIndicator status="rejected" />)
      
      expect(screen.getByText('Rejected')).toBeInTheDocument()
    })

    it('renders requires_changes status correctly', () => {
      render(<SwmsStatusIndicator status="requires_changes" />)
      
      expect(screen.getByText('Needs Changes')).toBeInTheDocument()
    })
  })

  describe('size variations', () => {
    it('renders with small size', () => {
      render(<SwmsStatusIndicator status="active" size="sm" />)
      expect(screen.getByText('Active')).toBeInTheDocument()
    })

    it('renders with medium size (default)', () => {
      render(<SwmsStatusIndicator status="active" size="md" />)
      expect(screen.getByText('Active')).toBeInTheDocument()
    })

    it('renders with large size', () => {
      render(<SwmsStatusIndicator status="active" size="lg" />)
      expect(screen.getByText('Active')).toBeInTheDocument()
    })
  })

  describe('icon display', () => {
    it('shows icon by default', () => {
      render(<SwmsStatusIndicator status="active" />)
      
      // Check for SVG element (icon)
      const badge = screen.getByText('Active').closest('div')
      expect(badge?.querySelector('svg')).toBeInTheDocument()
    })

    it('hides icon when showIcon is false', () => {
      render(<SwmsStatusIndicator status="active" showIcon={false} />)
      
      // Check for SVG element (icon) should not be present
      const badge = screen.getByText('Active').closest('div')
      expect(badge?.querySelector('svg')).not.toBeInTheDocument()
    })
  })

  describe('custom className', () => {
    it('renders with custom className', () => {
      render(<SwmsStatusIndicator status="active" className="custom-class" />)
      expect(screen.getByText('Active')).toBeInTheDocument()
    })
  })

  describe('unknown status handling', () => {
    it('handles unknown status gracefully', () => {
      // @ts-expect-error Testing unknown status
      render(<SwmsStatusIndicator status="unknown_status" />)
      expect(screen.getByText('Unknown')).toBeInTheDocument()
    })
  })
})

describe('SwmsCompletionBadge', () => {
  describe('completion rate display', () => {
    it('renders 100% completion correctly', () => {
      render(<SwmsCompletionBadge completionRate={100} />)
      expect(screen.getByText('100% Complete')).toBeInTheDocument()
    })

    it('renders high completion rate (80-99%) correctly', () => {
      render(<SwmsCompletionBadge completionRate={85} />)
      expect(screen.getByText('85% Complete')).toBeInTheDocument()
    })

    it('renders medium completion rate (50-79%) correctly', () => {
      render(<SwmsCompletionBadge completionRate={65} />)
      expect(screen.getByText('65% Complete')).toBeInTheDocument()
    })

    it('renders low completion rate (1-49%) correctly', () => {
      render(<SwmsCompletionBadge completionRate={25} />)
      expect(screen.getByText('25% Complete')).toBeInTheDocument()
    })

    it('renders zero completion correctly', () => {
      render(<SwmsCompletionBadge completionRate={0} />)
      expect(screen.getByText('Not Started')).toBeInTheDocument()
    })
  })

  describe('completion rate rounding', () => {
    it('rounds decimal completion rates correctly', () => {
      render(<SwmsCompletionBadge completionRate={87.6} />)
      
      expect(screen.getByText('88% Complete')).toBeInTheDocument()
    })

    it('rounds down decimal completion rates correctly', () => {
      render(<SwmsCompletionBadge completionRate={67.3} />)
      
      expect(screen.getByText('67% Complete')).toBeInTheDocument()
    })
  })

  describe('size variations for completion badge', () => {
    it('renders with small size', () => {
      render(<SwmsCompletionBadge completionRate={50} size="sm" />)
      expect(screen.getByText('50% Complete')).toBeInTheDocument()
    })

    it('renders with large size', () => {
      render(<SwmsCompletionBadge completionRate={50} size="lg" />)
      expect(screen.getByText('50% Complete')).toBeInTheDocument()
    })
  })

  describe('icon display for completion badge', () => {
    it('always shows icon for completion badge', () => {
      render(<SwmsCompletionBadge completionRate={75} />)
      
      const badge = screen.getByText('75% Complete').closest('div')
      expect(badge?.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('custom className for completion badge', () => {
    it('renders with custom className', () => {
      render(<SwmsCompletionBadge completionRate={50} className="custom-completion-class" />)
      expect(screen.getByText('50% Complete')).toBeInTheDocument()
    })
  })

  describe('edge cases for completion rates', () => {
    it('handles completion rate over 100%', () => {
      render(<SwmsCompletionBadge completionRate={105} />)
      expect(screen.getByText('100% Complete')).toBeInTheDocument()
    })

    it('handles negative completion rate', () => {
      render(<SwmsCompletionBadge completionRate={-5} />)
      expect(screen.getByText('Not Started')).toBeInTheDocument()
    })
  })
})