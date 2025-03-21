
import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewer({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    if (pageNumber > 1) {
      changePage(-1);
    }
  }

  function nextPage() {
    if (pageNumber < numPages) {
      changePage(1);
    }
  }

  // Don't try to render if pdfUrl is undefined or empty
  if (!pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-100 p-4 rounded-lg shadow">
        <p className="text-gray-500">No PDF file selected</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full bg-gray-100 p-4 rounded-lg shadow">
        {isLoading && <p className="text-center">Loading PDF...</p>}
        {error && <p className="text-center text-red-500">Error loading PDF: {error}</p>}
        
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => {
            console.error('Error loading PDF:', error);
            setError('Failed to load PDF');
            setIsLoading(false);
          }}
          className="flex justify-center"
        >
          <Page 
            pageNumber={pageNumber} 
            renderTextLayer={false}
            renderAnnotationLayer={false}
            scale={1}
          />
        </Document>
      </div>

      {numPages && (
        <div className="flex items-center justify-between w-full mt-4">
          <button 
            onClick={previousPage} 
            disabled={pageNumber <= 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <p className="text-center">
            Page {pageNumber} of {numPages}
          </p>
          
          <button 
            onClick={nextPage} 
            disabled={pageNumber >= numPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
