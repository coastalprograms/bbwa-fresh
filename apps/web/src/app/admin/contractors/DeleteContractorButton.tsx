'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteContractor } from './actions'

interface DeleteContractorButtonProps {
  contractorId: string
  contractorName: string
  disabled?: boolean
}

export default function DeleteContractorButton({ 
  contractorId, 
  contractorName,
  disabled = false 
}: DeleteContractorButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const result = await deleteContractor(contractorId)
      
      if (result.success) {
        setIsOpen(false)
        // Optionally show a success toast here
        router.refresh()
      } else {
        // Optionally show error toast here
        console.error('Failed to delete contractor:', result.error)
        alert(`Failed to delete contractor: ${result.error}`)
      }
    } catch (error) {
      console.error('Error deleting contractor:', error)
      alert('An error occurred while deleting the contractor')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || isDeleting}
          className="px-2"
        >
          {isDeleting ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Trash2 className="h-3 w-3" />
          )}
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Contractor</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{contractorName}&quot;? This will set the contractor as inactive but preserve all historical data and employee relationships.
            <br /><br />
            <strong>This action cannot be undone.</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Contractor'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}