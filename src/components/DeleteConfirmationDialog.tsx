'use client';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  filename: string;
}

export default function DeleteConfirmationDialog({
  isOpen,
  onConfirm,
  onCancel,
  filename,
}: DeleteConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          Delete File
        </h3>
        <p className="text-gray-300 mb-4">
          Are you sure you want to delete <span className="font-medium">{filename}</span>?
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 