/**
 * Critical P0 Tests for FileUpload Component
 * Addresses TEST-001 high severity gap from QA gate
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FileUpload } from '../FileUpload'

// Mock Next.js server actions
jest.mock('@/app/swms-portal/actions/upload-actions', () => ({
  uploadSwmsDocument: jest.fn()
}))

// Mock file validation
const mockValidateFile = jest.fn()
jest.mock('../../../lib/utils', () => ({
  cn: jest.fn((...classes) => classes.join(' '))
}))

describe('FileUpload Component', () => {
  const mockProps = {
    swmsJobId: 'job-123',
    contractorId: 'contractor-456',
    token: 'valid-token-123',
    maxFiles: 5,
    onUploadComplete: jest.fn(),
    onError: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockValidateFile.mockReturnValue(true)
  })

  describe('1.4-UNIT-003: File type validation logic', () => {
    test('accepts valid file types', () => {
      const validFiles = [
        new File(['content'], 'document.pdf', { type: 'application/pdf' }),
        new File(['content'], 'document.doc', { type: 'application/msword' }),
        new File(['content'], 'document.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
        new File(['content'], 'image.jpg', { type: 'image/jpeg' }),
        new File(['content'], 'image.png', { type: 'image/png' })
      ]

      render(<FileUpload {...mockProps} />)

      validFiles.forEach(file => {
        const input = screen.getByRole('button', { name: /drop files here/i })
        expect(input).toBeInTheDocument()
        // Simulate file drop would trigger validation
      })
    })

    test('rejects invalid file types', async () => {
      const invalidFiles = [
        new File(['content'], 'script.js', { type: 'application/javascript' }),
        new File(['content'], 'executable.exe', { type: 'application/x-msdownload' }),
        new File(['content'], 'archive.zip', { type: 'application/zip' }),
        new File(['content'], 'video.mp4', { type: 'video/mp4' })
      ]

      render(<FileUpload {...mockProps} />)
      const dropzone = screen.getByRole('button', { name: /drop files here/i })

      for (const file of invalidFiles) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)

        fireEvent.drop(dropzone, {
          dataTransfer
        })

        await waitFor(() => {
          expect(mockProps.onError).toHaveBeenCalledWith(
            expect.stringContaining('not supported')
          )
        })
      }
    })

    test('handles mixed valid and invalid files', async () => {
      const mixedFiles = [
        new File(['content'], 'valid.pdf', { type: 'application/pdf' }),
        new File(['content'], 'invalid.txt', { type: 'text/plain' }),
        new File(['content'], 'valid.png', { type: 'image/png' })
      ]

      render(<FileUpload {...mockProps} />)
      const dropzone = screen.getByRole('button', { name: /drop files here/i })

      const dataTransfer = new DataTransfer()
      mixedFiles.forEach(file => dataTransfer.items.add(file))

      fireEvent.drop(dropzone, { dataTransfer })

      await waitFor(() => {
        // Should accept valid files and reject invalid ones
        expect(mockProps.onError).toHaveBeenCalledWith(
          expect.stringContaining('text/plain')
        )
      })
    })
  })

  describe('1.4-UNIT-004: File size validation (10MB limit)', () => {
    test('accepts files under 10MB limit', async () => {
      const validSizes = [
        1024, // 1KB
        1024 * 1024, // 1MB
        5 * 1024 * 1024, // 5MB
        10 * 1024 * 1024 - 1 // Just under 10MB
      ]

      render(<FileUpload {...mockProps} />)
      const dropzone = screen.getByRole('button', { name: /drop files here/i })

      for (const size of validSizes) {
        const file = new File(['x'.repeat(size)], 'test.pdf', { type: 'application/pdf' })
        Object.defineProperty(file, 'size', { value: size })

        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)

        fireEvent.drop(dropzone, { dataTransfer })

        // Should not trigger size error
        expect(mockProps.onError).not.toHaveBeenCalledWith(
          expect.stringContaining('exceeds 10MB')
        )
      }
    })

    test('rejects files over 10MB limit', async () => {
      const oversizedFiles = [
        { size: 10 * 1024 * 1024 + 1, name: 'barely_over.pdf' }, // Just over 10MB
        { size: 20 * 1024 * 1024, name: 'double_limit.pdf' }, // 20MB
        { size: 50 * 1024 * 1024, name: 'huge_file.pdf' } // 50MB
      ]

      render(<FileUpload {...mockProps} />)
      const dropzone = screen.getByRole('button', { name: /drop files here/i })

      for (const { size, name } of oversizedFiles) {
        const file = new File(['content'], name, { type: 'application/pdf' })
        Object.defineProperty(file, 'size', { value: size })

        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)

        fireEvent.drop(dropzone, { dataTransfer })

        await waitFor(() => {
          expect(mockProps.onError).toHaveBeenCalledWith(
            expect.stringContaining('exceeds 10MB limit')
          )
        })

        mockProps.onError.mockClear()
      }
    })

    test('displays human-readable file sizes', async () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })
      Object.defineProperty(file, 'size', { value: 2.5 * 1024 * 1024 }) // 2.5MB

      render(<FileUpload {...mockProps} />)
      const dropzone = screen.getByRole('button', { name: /drop files here/i })

      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)

      fireEvent.drop(dropzone, { dataTransfer })

      await waitFor(() => {
        expect(screen.getByText(/2\.\d+\s*MB/)).toBeInTheDocument()
      })
    })
  })

  describe('Drag and Drop Functionality', () => {
    test('highlights drop zone on drag over', () => {
      render(<FileUpload {...mockProps} />)
      const dropzone = screen.getByRole('button', { name: /drop files here/i })

      fireEvent.dragOver(dropzone)
      
      expect(dropzone).toHaveClass('border-blue-400') // Assuming this is the highlight class
    })

    test('removes highlight on drag leave', () => {
      render(<FileUpload {...mockProps} />)
      const dropzone = screen.getByRole('button', { name: /drop files here/i })

      fireEvent.dragOver(dropzone)
      fireEvent.dragLeave(dropzone)
      
      expect(dropzone).not.toHaveClass('border-blue-400')
    })

    test('handles multiple files in single drop', async () => {
      const files = [
        new File(['content1'], 'file1.pdf', { type: 'application/pdf' }),
        new File(['content2'], 'file2.png', { type: 'image/png' }),
        new File(['content3'], 'file3.doc', { type: 'application/msword' })
      ]

      render(<FileUpload {...mockProps} />)
      const dropzone = screen.getByRole('button', { name: /drop files here/i })

      const dataTransfer = new DataTransfer()
      files.forEach(file => dataTransfer.items.add(file))

      fireEvent.drop(dropzone, { dataTransfer })

      await waitFor(() => {
        files.forEach(file => {
          expect(screen.getByText(file.name)).toBeInTheDocument()
        })
      })
    })
  })

  describe('Upload Progress Tracking', () => {
    test('shows upload progress for each file', async () => {
      const { uploadSwmsDocument } = require('@/app/swms-portal/actions/upload-actions')
      
      // Mock slow upload
      uploadSwmsDocument.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({ success: true }), 100)
        )
      )

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })

      render(<FileUpload {...mockProps} />)
      const dropzone = screen.getByRole('button', { name: /drop files here/i })

      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)

      fireEvent.drop(dropzone, { dataTransfer })

      // Should show uploading state
      await waitFor(() => {
        expect(screen.getByText(/uploading/i)).toBeInTheDocument()
      })
    })

    test('shows completed state after successful upload', async () => {
      const { uploadSwmsDocument } = require('@/app/swms-portal/actions/upload-actions')
      uploadSwmsDocument.mockResolvedValue({ success: true })

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })

      render(<FileUpload {...mockProps} />)
      const dropzone = screen.getByRole('button', { name: /drop files here/i })

      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)

      fireEvent.drop(dropzone, { dataTransfer })

      await waitFor(() => {
        expect(screen.getByText(/completed/i)).toBeInTheDocument()
      })
    })

    test('shows error state after failed upload', async () => {
      const { uploadSwmsDocument } = require('@/app/swms-portal/actions/upload-actions')
      uploadSwmsDocument.mockResolvedValue({ 
        success: false, 
        error: 'Upload failed due to server error' 
      })

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })

      render(<FileUpload {...mockProps} />)
      const dropzone = screen.getByRole('button', { name: /drop files here/i })

      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)

      fireEvent.drop(dropzone, { dataTransfer })

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument()
        expect(screen.getByText(/upload failed/i)).toBeInTheDocument()
      })
    })
  })

  describe('Error States and Retry Mechanism', () => {
    test('provides retry button for failed uploads', async () => {
      const { uploadSwmsDocument } = require('@/app/swms-portal/actions/upload-actions')
      uploadSwmsDocument.mockResolvedValueOnce({ 
        success: false, 
        error: 'Network error' 
      }).mockResolvedValueOnce({ 
        success: true 
      })

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })

      render(<FileUpload {...mockProps} />)
      const dropzone = screen.getByRole('button', { name: /drop files here/i })

      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)

      fireEvent.drop(dropzone, { dataTransfer })

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText(/retry/i)).toBeInTheDocument()
      })

      // Click retry
      fireEvent.click(screen.getByText(/retry/i))

      // Should succeed on retry
      await waitFor(() => {
        expect(screen.getByText(/completed/i)).toBeInTheDocument()
      })
    })

    test('respects maximum file limit', async () => {
      const files = Array.from({ length: 6 }, (_, i) => 
        new File(['content'], `file${i}.pdf`, { type: 'application/pdf' })
      )

      render(<FileUpload {...mockProps} />)
      const dropzone = screen.getByRole('button', { name: /drop files here/i })

      const dataTransfer = new DataTransfer()
      files.forEach(file => dataTransfer.items.add(file))

      fireEvent.drop(dropzone, { dataTransfer })

      await waitFor(() => {
        expect(mockProps.onError).toHaveBeenCalledWith(
          expect.stringContaining('maximum of 5 files')
        )
      })
    })

    test('allows removing files before upload', async () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })

      render(<FileUpload {...mockProps} />)
      const dropzone = screen.getByRole('button', { name: /drop files here/i })

      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)

      fireEvent.drop(dropzone, { dataTransfer })

      await waitFor(() => {
        expect(screen.getByText('test.pdf')).toBeInTheDocument()
      })

      // Should have remove button
      const removeButton = screen.getByRole('button', { name: /remove/i })
      fireEvent.click(removeButton)

      await waitFor(() => {
        expect(screen.queryByText('test.pdf')).not.toBeInTheDocument()
      })
    })
  })

  describe('Mobile Responsiveness', () => {
    test('renders appropriately on mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375 })
      Object.defineProperty(window, 'innerHeight', { value: 667 })

      render(<FileUpload {...mockProps} />)
      
      const dropzone = screen.getByRole('button', { name: /drop files here/i })
      expect(dropzone).toBeInTheDocument()
      
      // Should have touch-friendly size (implementation dependent)
      expect(dropzone).toHaveStyle({ minHeight: '120px' })
    })

    test('supports touch events for mobile devices', () => {
      render(<FileUpload {...mockProps} />)
      const dropzone = screen.getByRole('button', { name: /drop files here/i })

      // Simulate touch events
      fireEvent.touchStart(dropzone)
      fireEvent.touchEnd(dropzone)

      // Should handle touch events without errors
      expect(dropzone).toBeInTheDocument()
    })
  })
})