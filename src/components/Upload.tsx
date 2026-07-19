import React, { useCallback, useState } from 'react';
import { Upload as UploadIcon } from 'lucide-react';

interface UploadProps {
  onUpload: (file: File) => Promise<any>;
  onUploadStart: () => void;
  onError: (error: string) => void;
  isLoading: boolean;
}

export function Upload({
  onUpload,
  onUploadStart,
  onError,
  isLoading,
}: UploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file) {
        onError('No file selected');
        return;
      }

      const validTypes = [
        'text/plain',
        'application/pdf',
        'text/markdown',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      if (
        !validTypes.includes(file.type) &&
        !file.name.toLowerCase().endsWith('.txt')
      ) {
        onError('Please upload a TXT, PDF, Markdown or DOCX file.');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        onError('Maximum file size is 10 MB.');
        return;
      }

      onUploadStart();
      setSelectedFile(file);

      try {
        await onUpload(file);
      } catch (err) {
        if (err instanceof Error) {
          onError(err.message);
        } else {
          onError('Upload failed');
        }
      }
    },
    [onUpload, onUploadStart, onError]
  );

  const handleDrag = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.type === 'dragenter' || e.type === 'dragover') {
        setDragActive(true);
      } else {
        setDragActive(false);
      }
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files[0]);
      }
    },
    [handleUpload]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleUpload(e.target.files[0]);
      }
    },
    [handleUpload]
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`card-lg cursor-pointer transition-all duration-300 ${
          dragActive
            ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/20'
            : ''
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex flex-col items-center justify-center py-12">
          {isLoading ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/20 mb-4 animate-pulse">
                <UploadIcon className="w-8 h-8 text-primary-400 animate-pulse" />
              </div>

              <p className="text-lg font-medium text-slate-200">
                Uploading...
              </p>

              <p className="text-sm text-slate-400 mt-2">
                {selectedFile?.name}
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/20 mb-4">
                <UploadIcon className="w-8 h-8 text-primary-400" />
              </div>

              <p className="text-xl font-semibold text-slate-100 mb-2">
                Drop your transcript here
              </p>

              <p className="text-sm text-slate-400 mb-4">or</p>

              <label className="btn-primary cursor-pointer">
                Browse Files

                <input
                  type="file"
                  className="hidden"
                  disabled={isLoading}
                  accept=".txt,.pdf,.md,.docx"
                  onChange={handleFileInput}
                />
              </label>

              <p className="text-xs text-slate-500 mt-4">
                Supported: TXT, PDF, Markdown, DOCX (max 10 MB)
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}