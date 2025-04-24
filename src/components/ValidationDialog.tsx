'use client';

interface ValidationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  validationResult: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
}

export default function ValidationDialog({
  isOpen,
  onClose,
  validationResult,
}: ValidationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-white">
            CSV Validation Results
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {validationResult.isValid && validationResult.warnings.length === 0 ? (
          <p className="text-green-400 mb-4">CSV file is valid</p>
        ) : (
          <div className="space-y-4">
            {!validationResult.isValid && (
              <div>
                <h4 className="text-red-400 font-medium mb-2">Errors:</h4>
                <ul className="list-disc list-inside text-red-300 space-y-1">
                  {validationResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {validationResult.warnings.length > 0 && (
              <div>
                <h4 className="text-yellow-400 font-medium mb-2">Warnings:</h4>
                <ul className="list-disc list-inside text-yellow-300 space-y-1">
                  {validationResult.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 