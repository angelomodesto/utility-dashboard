interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateCsvData(data: any[]): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  if (!data || data.length === 0) {
    result.isValid = false;
    result.errors.push('No data found in CSV file');
    return result;
  }

  // Get headers from first row
  const headers = Object.keys(data[0]);
  if (headers.length === 0) {
    result.isValid = false;
    result.errors.push('No headers found in CSV file');
    return result;
  }

  // Check each row for critical issues
  data.forEach((row, index) => {
    // Only check if the row has at least one valid header
    const rowHeaders = Object.keys(row);
    if (rowHeaders.length === 0) {
      result.isValid = false;
      result.errors.push(`Row ${index + 1}: No valid data found`);
      return;
    }

    // Check for invalid numeric values in numeric columns
    headers.forEach(header => {
      const value = row[header];
      // Only check numeric values if the column name suggests it's numeric
      if (header.toLowerCase().includes('amount') || 
          header.toLowerCase().includes('price') || 
          header.toLowerCase().includes('quantity') ||
          header.toLowerCase().includes('age')) {
        if (value !== undefined && value !== null && value !== '') {
          const numValue = Number(value);
          if (isNaN(numValue) || !isFinite(numValue)) {
            result.warnings.push(`Row ${index + 1}: Invalid numeric value in column "${header}": ${value}`);
          }
        }
      }
    });
  });

  // Check for duplicate rows (only if all columns match exactly)
  const uniqueRows = new Set(data.map(row => JSON.stringify(row)));
  if (uniqueRows.size < data.length) {
    result.warnings.push(`Found ${data.length - uniqueRows.size} potential duplicate rows`);
  }

  return result;
}

export function formatValidationResult(result: ValidationResult): string {
  if (result.isValid && result.warnings.length === 0) {
    return 'CSV file is valid';
  }

  const messages: string[] = [];

  if (!result.isValid) {
    messages.push('Critical Issues:');
    messages.push(...result.errors.map(error => `- ${error}`));
  }

  if (result.warnings.length > 0) {
    if (messages.length > 0) messages.push('');
    messages.push('Potential Issues:');
    messages.push(...result.warnings.map(warning => `- ${warning}`));
  }

  return messages.join('\n');
} 