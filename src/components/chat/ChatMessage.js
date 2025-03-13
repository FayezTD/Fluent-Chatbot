import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDistanceToNow } from 'date-fns';
import CitationsList from './CitationsList';
import TableRenderer from './TableRenderer';
import GraphRenderer from './GraphRenderer';

const ReasoningLoader = () => {
  const [message, setMessage] = useState("Analyzing query...");

  const loadingSteps = useMemo(() => [
    "Analyzing your query...",
    "Fetching relevant data...",
    "Processing response...",
    "Finalizing answer..."
  ], []);

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      setMessage(loadingSteps[step % loadingSteps.length]);
      step++;
    }, 1500);
    
    return () => clearInterval(interval);
  }, [loadingSteps]);

  return <div className="animate-pulse text-gray-500 italic">{message}</div>;
};

const ChatMessage = ({ message, isLoading }) => {
  const { role, content, timestamp, citations } = message;
  const isUser = role === 'user';

  const formattedTime = timestamp
    ? formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    : '';

  // Check if the content contains special markers
  const hasTable = content && content.includes('%%TABLE_JSON%%');
  const hasGraph = content && content.includes('%%GRAPH_JSON%%');

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 w-full`}>
      <div className={`max-w-3xl w-full rounded-lg p-4 ${isUser ? 'bg-blue-400/75 text-white' : 'bg-gray-100'}`}>
        <div className="flex items-center mb-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-400' : 'bg-blue-100'}`}>
            {isUser ? 'U' : 'AI'}
          </div>
          <div className="ml-2 font-medium">{isUser ? 'You' : 'Assistant'}</div>
          {timestamp && <div className="ml-auto text-xs opacity-75">{formattedTime}</div>}
        </div>
        <div className="prose max-w-full">
          {isLoading && role === "assistant" ? (
            <ReasoningLoader />
          ) : (
            <>
              {hasTable || hasGraph ? (
                <RichContent content={content} />
              ) : (
                <FormattedContent content={content} />
              )}
            </>
          )}
        </div>
        {!isUser && citations && citations.length > 0 && (
          <div className="mt-3 w-full citation-list">
            <CitationsList citations={citations} />
          </div>
        )}
      </div>
    </div>
  );
};

// Component to handle all content formatting
const FormattedContent = ({ content }) => {
  // Clean up the content by removing unnecessary markdown
  const cleanedContent = content
    // Replace <br> tags with newlines
    .replace(/<br>/g, '\n')
    // Remove excessive asterisks (bold formatting)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    // Clean up any consecutive newlines to a maximum of two
    .replace(/\n{3,}/g, '\n\n');

  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      components={{
        // Override list items to ensure proper spacing
        li: ({node, ...props}) => <li className="my-1" {...props} />,
        // Override paragraphs to ensure proper spacing
        p: ({node, ...props}) => <p className="my-2" {...props} />
      }}
    >
      {cleanedContent}
    </ReactMarkdown>
  );
};

// Component to handle mixed content with tables and graphs
const RichContent = ({ content }) => {
  // Split content by all special markers
  const parts = content.split(/(%%TABLE_JSON%%.*?%%END_TABLE%%|%%GRAPH_JSON%%.*?%%END_GRAPH%%)/s);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('%%TABLE_JSON%%')) {
          // Extract the JSON string for tables
          const jsonString = part.replace('%%TABLE_JSON%%', '').replace('%%END_TABLE%%', '');
          try {
            const tableData = JSON.parse(jsonString);
            return <TableRenderer key={index} data={tableData} />;
          } catch (e) {
            console.error('Failed to parse table JSON:', e);
            return <div key={index} className="text-red-500">Error rendering table</div>;
          }
        } else if (part.startsWith('%%GRAPH_JSON%%')) {
          // Extract the JSON string for graphs
          const jsonString = part.replace('%%GRAPH_JSON%%', '').replace('%%END_GRAPH%%', '');
          try {
            const graphData = JSON.parse(jsonString);
            return <GraphRenderer key={index} data={graphData} />;
          } catch (e) {
            console.error('Failed to parse graph JSON:', e);
            return <div key={index} className="text-red-500">Error rendering graph</div>;
          }
        } else if (part.trim()) {
          // Render regular markdown content with cleanup
          return <FormattedContent key={index} content={part} />;
        }
        return null;
      })}
    </>
  );
};

export default ChatMessage;