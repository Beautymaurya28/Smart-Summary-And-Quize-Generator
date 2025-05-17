import React from 'react';
import { Summary } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock } from 'lucide-react';

interface SummaryListProps {
  summaries: Summary[];
}

export const SummaryList: React.FC<SummaryListProps> = ({ summaries }) => {
  const navigate = useNavigate();
  
  if (summaries.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No summaries</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new summary.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {summaries.map((summary) => (
        <Card 
          key={summary.id}
          className="cursor-pointer hover:shadow-lg transition-shadow duration-200 transform hover:-translate-y-1"
          onClick={() => navigate(`/summary/${summary.id}`)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-1">
                {summary.title}
              </h3>
              <Badge 
                variant={summary.length === 'short' ? 'primary' : summary.length === 'medium' ? 'secondary' : 'success'}
                size="sm"
              >
                {summary.length}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(summary.timestamp).toLocaleDateString()}
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 line-clamp-3 text-sm">
              {summary.summaryText}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};