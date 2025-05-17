import React, { useState } from 'react';
import { TextArea } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Upload, FileText } from 'lucide-react';
import { createSummary } from '../../services/dataService';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export const SummaryForm: React.FC = () => {
  const { settings } = useAppContext();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>(settings.defaultSummaryLength);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only accept text files
    if (!file.type.includes('text')) {
      setError('Please upload a text file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
      
      // Set title to filename without extension
      const fileName = file.name.split('.').slice(0, -1).join('.');
      setTitle(fileName || 'Untitled Document');
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Please enter some text to summarize');
      return;
    }
    
    if (!title.trim()) {
      setError('Please enter a title for your summary');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const summary = await createSummary(text, title, length);
      navigate(`/summary/${summary.id}`);
    } catch (err) {
      setError('Failed to create summary. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <TextArea
            label="Title"
            placeholder="Enter a title for your summary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
            required
          />
        </div>
        
        <div>
          <Select
            label="Summary Length"
            options={[
              { value: 'short', label: 'Short' },
              { value: 'medium', label: 'Medium' },
              { value: 'long', label: 'Long' },
            ]}
            value={length}
            onChange={setLength as (value: string) => void}
            helperText="Select the desired summary length"
          />
        </div>
      </div>
      
      <TextArea
        label="Text to Summarize"
        placeholder="Paste or type the text you want to summarize..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full min-h-[200px]"
        required
      />
      
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div>
          <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none">
            <Upload className="mr-2 h-4 w-4" />
            Upload File
            <input
              type="file"
              className="hidden"
              accept=".txt,.md,.rtf"
              onChange={handleFileUpload}
            />
          </label>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            or paste text above
          </span>
        </div>
        
        <Button 
          type="submit" 
          isLoading={isLoading}
          disabled={!text.trim() || !title.trim() || isLoading}
          className="flex items-center"
        >
          <FileText className="mr-2 h-4 w-4" />
          Generate Summary
        </Button>
      </div>
      
      {error && (
        <div className="text-red-600 dark:text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </form>
  );
};