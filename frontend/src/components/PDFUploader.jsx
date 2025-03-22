
import { useState } from 'react';

export default function PdfUploader({ onPdfUploaded }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setUploadError('Please select a file');
      return;
    }
    
    if (!file.name.endsWith('.pdf')) {
      setUploadError('Please select a valid PDF file');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload PDF');
      }

      // Create a session ID for this PDF
      const sessionId = Math.random().toString(36).substring(2, 15);
      
      onPdfUploaded({
        filePath: data.filePath,
        fileName: data.fileName,
        sessionId,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError(error.message || 'Failed to upload PDF');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Upload PDF Document</h2>
      
      <label className="flex flex-col items-center px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300">
        {isUploading ? 'Uploading...' : 'Select PDF File'}
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
      </label>
      
      {uploadError && (
        <p className="mt-2 text-red-500">{uploadError}</p>
      )}
    </div>
  );
}