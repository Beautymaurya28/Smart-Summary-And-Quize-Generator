import React from 'react';
import { Quiz } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { Award, Clock } from 'lucide-react';

interface QuizListProps {
  quizzes: Quiz[];
}

export const QuizList: React.FC<QuizListProps> = ({ quizzes }) => {
  const navigate = useNavigate();
  
  if (quizzes.length === 0) {
    return (
      <div className="text-center py-8">
        <Award className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No quizzes</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new quiz from a summary.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quizzes.map((quiz) => (
        <Card 
          key={quiz.id}
          className="cursor-pointer hover:shadow-lg transition-shadow duration-200 transform hover:-translate-y-1"
          onClick={() => navigate(`/quiz/${quiz.id}`)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-1">
                {quiz.title}
              </h3>
              <Badge 
                variant={quiz.difficulty === 'easy' ? 'success' : quiz.difficulty === 'medium' ? 'warning' : 'danger'}
                size="sm"
              >
                {quiz.difficulty}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(quiz.timestamp).toLocaleDateString()}
            </p>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {quiz.questions.length} questions
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/quiz/${quiz.id}/take`);
                }}
              >
                Take Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};