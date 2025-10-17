
import React from 'react';
import { SearchIcon } from './IconComponents';

interface QueryInputProps {
  query: string;
  setQuery: (query: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  hasDocuments: boolean;
}

const QueryInput: React.FC<QueryInputProps> = ({ query, setQuery, onSubmit, isLoading, hasDocuments }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && hasDocuments) {
        onSubmit();
      }
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
      <h2 className="text-xl font-semibold mb-4 text-slate-100 flex items-center gap-2">
        <SearchIcon className="h-6 w-6 text-sky-400" />
        <span>Step 2: Ask a Question</span>
      </h2>
      <div className="relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={hasDocuments ? "Ask anything about your documents..." : "Please upload documents first"}
          className="w-full h-28 p-3 bg-slate-900 border border-slate-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors disabled:opacity-50"
          disabled={isLoading || !hasDocuments}
        />
        <button
          onClick={onSubmit}
          disabled={isLoading || !hasDocuments || !query.trim()}
          className="absolute bottom-3 right-3 flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-500 transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500"
        >
          <SearchIcon className="h-5 w-5" />
          <span>Ask</span>
        </button>
      </div>
    </div>
  );
};

export default QueryInput;
