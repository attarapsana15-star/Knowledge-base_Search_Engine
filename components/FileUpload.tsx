import React, { useState, useCallback, useRef } from 'react';
import { UploadCloudIcon, FileTextIcon, FilePdfIcon, CheckCircleIcon, XIcon } from './IconComponents';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    // Fix: Explicitly type 'file' as File to resolve TypeScript inference issue.
    const files = Array.from(e.dataTransfer.files).filter(
      (file: File) => file.type === 'text/plain' || file.type === 'application/pdf'
    );
    if (files.length > 0) {
      setSelectedFiles(files);
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      onFilesSelected(files);
    }
  };
  
  const handleRemoveFile = (index: number) => {
      const newFiles = [...selectedFiles];
      newFiles.splice(index, 1);
      setSelectedFiles(newFiles);
      onFilesSelected(newFiles);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border-2 border-dashed border-slate-600 transition-all duration-300 hover:border-sky-500">
      <h2 className="text-xl font-semibold mb-4 text-slate-100 flex items-center gap-2">
        <UploadCloudIcon className="h-6 w-6 text-sky-400" />
        <span>Step 1: Upload Documents</span>
      </h2>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
        className={`relative flex flex-col items-center justify-center p-8 rounded-md bg-slate-900/50 cursor-pointer text-center transition-all duration-300 ${
          isDragging ? 'border-sky-400 ring-2 ring-sky-400' : 'border-transparent'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".txt,.pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />
        <UploadCloudIcon className="h-12 w-12 text-slate-500 mb-3" />
        <p className="text-slate-300">
          <span className="font-semibold text-sky-400">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-slate-500">Supported formats: TXT, PDF</p>
      </div>
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium text-slate-400">Selected files:</h3>
          <ul className="space-y-2">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-slate-700/50 p-2 rounded-md text-sm">
                <div className="flex items-center gap-2 overflow-hidden">
                  {file.type === 'application/pdf' ? (
                    <FilePdfIcon className="h-5 w-5 text-red-400 flex-shrink-0" />
                  ) : (
                    <FileTextIcon className="h-5 w-5 text-sky-400 flex-shrink-0" />
                  )}
                  <span className="truncate" title={file.name}>{file.name}</span>
                </div>
                <button onClick={() => handleRemoveFile(index)} className="p-1 rounded-full hover:bg-slate-600 transition-colors">
                    <XIcon className="h-4 w-4"/>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;