import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Summary } from '../../types';
import { FileText, Download, Copy, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { exportToText, exportToPDF } from '../../services/dataService';

interface SummaryDetailProps {
  summary: Summary;
  onCreateQuiz: () => void;
}

export const SummaryDetail: React.FC<SummaryDetailProps> = ({ summary, onCreateQuiz }) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary.summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleExportText = () => {
    exportToText(summary.summaryText);
  };
  
  const handleExportPDF = () => {
    exportToPDF(summary.summaryText, summary.title);
  };
  
  return (
    <Card className="animate-fadeIn">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{summary.title}</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(summary.timestamp).toLocaleString()}
          </p>
        </div>
        <Badge 
          variant={summary.length === 'short' ? 'primary' : summary.length === 'medium' ? 'secondary' : 'success'}
          size="md"
        >
          {summary.length.charAt(0).toUpperCase() + summary.length.slice(1)}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">
            Summary
          </h3>
          <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-md text-gray-800 dark:text-gray-200">
            {summary.summaryText}
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2 flex items-center">
            <span>Original Text</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              ({summary.originalText.length} characters)
            </span>
          </h3>
          <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-md text-gray-800 dark:text-gray-200 max-h-48 overflow-y-auto">
            {summary.originalText}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={onCreateQuiz}>
          <Award className="mr-2 h-4 w-4" />
          Generate Quiz
        </Button>
        
        <Button variant="outline" onClick={copyToClipboard}>
          <Copy className="mr-2 h-4 w-4" />
          {copied ? 'Copied!' : 'Copy Summary'}
        </Button>
        
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" onClick={handleExportText}>
            <FileText className="mr-2 h-4 w-4" />
            Export Text
          </Button>
          
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};