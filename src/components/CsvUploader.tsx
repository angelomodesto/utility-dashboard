'use client';

import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { useUsageHistory } from '@/hooks/useUsageHistory';
import ConfirmationDialog from './ConfirmationDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import ValidationDialog from './ValidationDialog';
import { validateCsvData } from '@/utils/csvValidation';

interface ParsedData {
  data: any[];
  errors: any[];
  meta: any;
}

export default function CsvUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [validationResult, setValidationResult] = useState({
    isValid: true,
    errors: [] as string[],
    warnings: [] as string[],
  });
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const { addUsageData, usageHistory, isDuplicate, deleteEntry } = useUsageHistory();

  const handleFileProcess = useCallback((file: File) => {
    if (isDuplicate(file.name)) {
      setPendingFile(file);
      setShowConfirmation(true);
    } else {
      processFile(file);
    }
  }, [isDuplicate]);

  const processFile = useCallback((file: File) => {
    setIsParsing(true);
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setParsedData(results);
        const validation = validateCsvData(results.data);
        setValidationResult(validation);
        setShowValidation(true);
        
        if (validation.isValid) {
          addUsageData(results.data, file.name);
        }
        setIsParsing(false);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        alert('Error parsing CSV file');
        setIsParsing(false);
      }
    });
  }, [addUsageData]);

  const handleConfirmReplace = useCallback(() => {
    if (pendingFile) {
      processFile(pendingFile);
    }
    setShowConfirmation(false);
    setPendingFile(null);
  }, [pendingFile, processFile]);

  const handleCancelReplace = useCallback(() => {
    setShowConfirmation(false);
    setPendingFile(null);
  }, []);

  const handleDeleteClick = useCallback((id: string, filename: string) => {
    setPendingDeleteId(id);
    setShowDeleteConfirmation(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (pendingDeleteId) {
      deleteEntry(pendingDeleteId);
    }
    setShowDeleteConfirmation(false);
    setPendingDeleteId(null);
  }, [pendingDeleteId, deleteEntry]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirmation(false);
    setPendingDeleteId(null);
  }, []);

  const handleValidationClose = useCallback(() => {
    setShowValidation(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
      handleFileProcess(droppedFile);
    } else {
      alert('Please upload a CSV file');
    }
  }, [handleFileProcess]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      handleFileProcess(selectedFile);
    } else {
      alert('Please upload a CSV file');
    }
  }, [handleFileProcess]);

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <ConfirmationDialog
        isOpen={showConfirmation}
        onConfirm={handleConfirmReplace}
        onCancel={handleCancelReplace}
        filename={pendingFile?.name || ''}
      />

      <DeleteConfirmationDialog
        isOpen={showDeleteConfirmation}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        filename={usageHistory.find(entry => entry.id === pendingDeleteId)?.filename || ''}
      />

      <ValidationDialog
        isOpen={showValidation}
        onClose={handleValidationClose}
        validationResult={validationResult}
      />

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-gray-600">
              {isParsing
                ? 'Parsing CSV file...'
                : file
                ? `Selected file: ${file.name}`
                : 'Drag and drop a CSV file here, or click to select'}
            </p>
          </div>
        </label>
      </div>

      {parsedData && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-white">Parsed Data Preview</h3>
          <div className="bg-gray-800 rounded-lg shadow-lg p-4 max-h-96 overflow-auto border border-gray-700">
            <pre className="text-sm text-gray-200">
              {JSON.stringify(parsedData.data.slice(0, 5), null, 2)}
            </pre>
            <p className="text-sm text-gray-400 mt-2">
              Showing first 5 rows of {parsedData.data.length} total rows
            </p>
          </div>
        </div>
      )}

      {usageHistory.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-white">Usage History</h3>
          <div className="bg-gray-800 rounded-lg shadow-lg p-4 max-h-96 overflow-auto border border-gray-700">
            <div className="space-y-2">
              {usageHistory.map((entry) => (
                <div key={entry.id} className="p-2 bg-gray-700 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-200">
                        {entry.filename}
                      </p>
                      <p className="text-sm text-gray-300">
                        Uploaded on: {new Date(entry.timestamp).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-400">
                        Rows: {entry.data.length}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(entry.id, entry.filename)}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Delete file"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 