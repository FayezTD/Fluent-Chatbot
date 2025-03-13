import React from 'react';

const ModelSelector = ({ selectedModel, onSelectModel }) => {
  return (
    <div className="flex items-center space-x-4">
      <label className="inline-flex items-center">
        <input
          type="radio"
          className="form-radio h-5 w-5"
          name="model"
          value="GPT-4o"
          checked={selectedModel === 'GPT-4o'}
          onChange={() => onSelectModel('GPT-4o')}
        />
        <span className="ml-2 text-lg font-black text-black" style={{ textShadow: '0 0 3px rgba(255,255,255,0.7)' }}>GPT-4o</span>
      </label>
      
      <label className="inline-flex items-center">
        <input
          type="radio"
          className="form-radio h-5 w-5"
          name="model"
          value="o1-Preview"
          checked={selectedModel === 'o1-Preview'}
          onChange={() => onSelectModel('o1-Preview')}
        />
        <span className="ml-2 text-lg font-black text-black" style={{ textShadow: '0 0 3px rgba(255,255,255,0.7)' }}>o1-Preview</span>
      </label>
    </div>
  );
};

export default ModelSelector;