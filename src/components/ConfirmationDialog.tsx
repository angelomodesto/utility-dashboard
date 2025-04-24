'use client';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  filename: string;
}

export default function ConfirmationDialog({
  isOpen,
  onConfirm,
  onCancel,
  filename,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          Duplicate File Detected
        </h3>
        <p className="text-gray-300 mb-4">
          A file named <span className="font-medium">{filename}</span> already exists in your history.
          Would you like to replace it?
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
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Replace
          </button>
        </div>
      </div>
    </div>
  );
} 