
import React, { useState, useCallback } from 'react';
import { Document } from './types';
import { processFiles } from './services/fileProcessor';
import { getSynthesizedAnswer } from './services/geminiService';
import FileUpload from './components/FileUpload';
import QueryInput from './components/QueryInput';
import AnswerDisplay from './components/AnswerDisplay';
import { BrainCircuitIcon } from './components/IconComponents';

export default function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [query, setQuery] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setIsLoading(true);
    setStatusMessage(`Processing ${files.length} file(s)...`);
    setError(null);
    setDocuments([]);
    try {
      const processedDocs = await processFiles(files);
      setDocuments(processedDocs);
      setStatusMessage(`${processedDocs.length} document(s) loaded successfully.`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during file processing.');
      setStatusMessage('File processing failed.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmitQuery = useCallback(async () => {
    if (!query.trim() || documents.length === 0) {
      setError('Please upload documents and enter a query.');
      return;
    }
    setIsLoading(true);
    setStatusMessage('Synthesizing answer...');
    setError(null);
    setAnswer('');
    try {
      const result = await getSynthesizedAnswer(query, documents);
      setAnswer(result);
      setStatusMessage('Answer generated.');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while getting the answer.');
      setAnswer('');
    } finally {
      setIsLoading(false);
    }
  }, [query, documents]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-4">
            <BrainCircuitIcon className="h-12 w-12 text-sky-400" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
              Knowledge-Base Search
            </h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Upload your documents, ask a question, and get a synthesized answer powered by AI.
          </p>
        </header>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="w-full space-y-8">
            <FileUpload onFilesSelected={handleFilesSelected} isLoading={isLoading} />
            <QueryInput
              query={query}
              setQuery={setQuery}
              onSubmit={handleSubmitQuery}
              isLoading={isLoading}
              hasDocuments={documents.length > 0}
            />
          </div>
          <div className="w-full">
            <AnswerDisplay
              answer={answer}
              isLoading={isLoading}
              statusMessage={statusMessage}
              error={error}
            />
          </div>
        </div>
        
        <footer className="text-center mt-16 text-slate-500 text-sm">
            <p>Powered by React, Tailwind CSS, and Gemini API</p>
        </footer>
      </main>
    </div>
  );
}
