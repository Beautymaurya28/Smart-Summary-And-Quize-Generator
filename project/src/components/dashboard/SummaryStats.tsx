import React from 'react';
import { Summary, Quiz } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { FileText, Award, Zap } from 'lucide-react';

interface SummaryStatsProps {
  summaries: Summary[];
  quizzes: Quiz[];
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ summaries, quizzes }) => {
  // Calculate stats
  const totalSummaries = summaries.length;
  const totalQuizzes = quizzes.length;
  const totalCharacters = summaries.reduce((acc, summary) => acc + summary.originalText.length, 0);
  
  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardContent className="flex items-center p-6">
          <div className="rounded-full bg-blue-400/30 p-3 mr-4">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-blue-100 text-sm">Total Summaries</p>
            <h3 className="text-2xl font-bold">{totalSummaries}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <CardContent className="flex items-center p-6">
          <div className="rounded-full bg-purple-400/30 p-3 mr-4">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-purple-100 text-sm">Total Quizzes</p>
            <h3 className="text-2xl font-bold">{totalQuizzes}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardContent className="flex items-center p-6">
          <div className="rounded-full bg-green-400/30 p-3 mr-4">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-green-100 text-sm">Characters Processed</p>
            <h3 className="text-2xl font-bold">{formatNumber(totalCharacters)}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};