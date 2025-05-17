import React, { useState } from 'react';
import { Quiz, QuizAttempt } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Award, Download, Eye, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { exportToText, exportToPDF } from '../../services/dataService';

interface QuizDetailProps {
  quiz: Quiz;
  attempts: QuizAttempt[];
}

export const QuizDetail: React.FC<QuizDetailProps> = ({ quiz, attempts }) => {
  const navigate = useNavigate();
  
  const handleExportText = () => {
    // Format quiz as text
    let content = `${quiz.title}\n\n`;
    content += `Difficulty: ${quiz.difficulty}\n`;
    content += `Questions: ${quiz.questions.length}\n\n`;
    
    quiz.questions.forEach((q, index) => {
      content += `${index + 1}. ${q.question}\n`;
      
      if (q.type === 'multiple-choice' && q.options) {
        q.options.forEach((option, i) => {
          content += `   ${String.fromCharCode(65 + i)}. ${option}\n`;
        });
      }
      
      content += `\nCorrect Answer: `;
      if (q.type === 'multiple-choice' && q.options && typeof q.correctAnswer === 'number') {
        content += `${String.fromCharCode(65 + q.correctAnswer)}. ${q.options[q.correctAnswer]}\n`;
      } else {
        content += `${q.correctAnswer}\n`;
      }
      
      if (q.explanation) {
        content += `Explanation: ${q.explanation}\n`;
      }
      
      content += '\n';
    });
    
    exportToText(content);
  };
  
  const handleExportPDF = () => {
    // Format quiz for PDF
    let content = `${quiz.title}\n\n`;
    content += `Difficulty: ${quiz.difficulty}\n`;
    content += `Questions: ${quiz.questions.length}\n\n`;
    
    quiz.questions.forEach((q, index) => {
      content += `${index + 1}. ${q.question}\n`;
      
      if (q.type === 'multiple-choice' && q.options) {
        q.options.forEach((option, i) => {
          content += `   ${String.fromCharCode(65 + i)}. ${option}\n`;
        });
      }
      
      content += `\nCorrect Answer: `;
      if (q.type === 'multiple-choice' && q.options && typeof q.correctAnswer === 'number') {
        content += `${String.fromCharCode(65 + q.correctAnswer)}. ${q.options[q.correctAnswer]}\n`;
      } else {
        content += `${q.correctAnswer}\n`;
      }
      
      if (q.explanation) {
        content += `Explanation: ${q.explanation}\n`;
      }
      
      content += '\n';
    });
    
    exportToPDF(content, quiz.title);
  };
  
  return (
    <Card className="animate-fadeIn">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{quiz.title}</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(quiz.timestamp).toLocaleString()}
          </p>
        </div>
        <Badge 
          variant={quiz.difficulty === 'easy' ? 'success' : quiz.difficulty === 'medium' ? 'warning' : 'danger'}
          size="md"
        >
          {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-750 p-4 rounded-md">
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white">
              Quiz Details
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {quiz.questions.length} questions
            </p>
          </div>
          
          <div className="flex flex-col items-end">
            <h3 className="text-md font-medium text-gray-900 dark:text-white">
              Attempts
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {attempts.length} total
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">
            Questions Preview
          </h3>
          <div className="space-y-3">
            {quiz.questions.slice(0, 3).map((question, index) => (
              <div key={question.id} className="bg-gray-50 dark:bg-gray-750 p-3 rounded-md">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Question {index + 1}
                  </span>
                  <Badge
                    variant={
                      question.type === 'multiple-choice' ? 'primary' : 
                      question.type === 'true-false' ? 'secondary' : 'default'
                    }
                    size="sm"
                  >
                    {question.type === 'multiple-choice' ? 'Multiple Choice' : 
                     question.type === 'true-false' ? 'True/False' : 'Short Answer'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                  {question.question}
                </p>
              </div>
            ))}
            
            {quiz.questions.length > 3 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {quiz.questions.length - 3} more questions...
              </p>
            )}
          </div>
        </div>
        
        {attempts.length > 0 && (
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">
              Your Attempts
            </h3>
            <div className="space-y-2">
              {attempts.slice(0, 3).map((attempt) => (
                <div 
                  key={attempt.id} 
                  className="bg-gray-50 dark:bg-gray-750 p-3 rounded-md flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => navigate(`/quiz/${quiz.id}/attempt/${attempt.id}`)}
                >
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {new Date(attempt.timestamp).toLocaleString()}
                    </p>
                    <Badge 
                      variant={attempt.completed ? 'success' : 'warning'}
                      size="sm"
                      className="mt-1"
                    >
                      {attempt.completed ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                  
                  {attempt.completed && (
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {attempt.score}%
                      </span>
                    </div>
                  )}
                </div>
              ))}
              
              {attempts.length > 3 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  {attempts.length - 3} more attempts...
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={() => navigate(`/quiz/${quiz.id}/take`)}>
          <Pencil className="mr-2 h-4 w-4" />
          Take Quiz
        </Button>
        
        <Button variant="secondary" onClick={() => navigate(`/quiz/${quiz.id}/preview`)}>
          <Eye className="mr-2 h-4 w-4" />
          Preview All Questions
        </Button>
        
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" onClick={handleExportText}>
            <Award className="mr-2 h-4 w-4" />
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