
import React from 'react';
import { SparklesIcon } from './IconComponents';
import Spinner from './Spinner';

interface AnswerDisplayProps {
  answer: string;
  isLoading: boolean;
  statusMessage: string;
  error: string | null;
}

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ answer, isLoading, statusMessage, error }) => {
  const formatAnswer = (text: string) => {
    // Basic markdown-like formatting for lists and bolding
    return text
      .split('\n')
      .map((line, index) => {
        if (line.trim().startsWith('* ')) {
          return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
        }
        if (line.trim().startsWith('- ')) {
            return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
        }
        if (line.match(/\*\*(.*?)\*\*/)) {
          return <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
        }
        return <p key={index} className="mb-2">{line}</p>;
      });
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 h-full min-h-[340px] flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-slate-100 flex items-center gap-2">
        <SparklesIcon className="h-6 w-6 text-sky-400" />
        <span>Synthesized Answer</span>
      </h2>
      <div className="flex-grow bg-slate-900/70 rounded-md p-4 overflow-y-auto relative prose prose-invert prose-sm max-w-none prose-p:text-slate-300 prose-strong:text-slate-100">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 rounded-md">
            <Spinner />
            <p className="mt-4 text-slate-300 animate-pulse-fast">{statusMessage}</p>
          </div>
        )}
        {error && (
          <div className="text-red-400">
            <h3 className="font-bold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        )}
        {!isLoading && !error && !answer && (
          <div className="text-slate-500 h-full flex items-center justify-center">
            <p>The answer will appear here...</p>
          </div>
        )}
        {answer && (
            <div>{formatAnswer(answer)}</div>
        )}
      </div>
    </div>
  );
};

export default AnswerDisplay;
