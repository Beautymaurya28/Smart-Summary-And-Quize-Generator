import React from 'react';
import { Quiz, QuizAttempt } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { Award, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface QuizResultProps {
  quiz: Quiz;
  attempt: QuizAttempt;
}

export const QuizResult: React.FC<QuizResultProps> = ({ quiz, attempt }) => {
  const navigate = useNavigate();
  
  if (!attempt.completed) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          This quiz attempt is not complete
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          You need to complete the quiz to see results.
        </p>
        <Button
          variant="primary"
          className="mt-4"
          onClick={() => navigate(`/quiz/${quiz.id}/take`)}
        >
          Continue Quiz
        </Button>
      </div>
    );
  }
  
  // Calculate correct/incorrect counts
  let correctCount = 0;
  let incorrectCount = 0;
  
  Object.entries(attempt.answers).forEach(([questionId, answer]) => {
    const question = quiz.questions.find(q => q.id === questionId);
    if (question && answer === question.correctAnswer) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });
  
  // Colors based on score
  const getScoreColor = () => {
    if (attempt.score >= 80) return 'text-green-600 dark:text-green-400';
    if (attempt.score >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  return (
    <Card className="animate-fadeIn">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{quiz.title} - Results</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Completed on {new Date(attempt.timestamp).toLocaleString()}
          </p>
        </div>
        <Badge 
          variant={
            attempt.score >= 80 ? 'success' : 
            attempt.score >= 60 ? 'warning' : 'danger'
          }
          size="md"
        >
          {attempt.score}%
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className="text-center">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>
              {attempt.score}%
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              You got {correctCount} out of {quiz.questions.length} questions correct
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md flex items-center">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-500 mr-4" />
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Correct
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {correctCount} questions
              </p>
            </div>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md flex items-center">
            <XCircle className="h-10 w-10 text-red-600 dark:text-red-500 mr-4" />
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Incorrect
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {incorrectCount} questions
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Question Review
          </h3>
          <div className="space-y-4">
            {quiz.questions.map((question, index) => {
              const userAnswer = attempt.answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div 
                  key={question.id} 
                  className={`p-4 rounded-md border ${
                    isCorrect 
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                      : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Question {index + 1}
                    </span>
                    {isCorrect ? (
                      <Badge variant="success">Correct</Badge>
                    ) : (
                      <Badge variant="danger">Incorrect</Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-800 dark:text-gray-200 mb-3">
                    {question.question}
                  </p>
                  
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Your Answer:
                    </h4>
                    <p className="text-gray-800 dark:text-gray-200 pl-3 border-l-2 border-gray-300 dark:border-gray-600">
                      {question.type === 'multiple-choice' && question.options && typeof userAnswer === 'number'
                        ? question.options[userAnswer]
                        : userAnswer?.toString() || 'No answer provided'}
                    </p>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Correct Answer:
                    </h4>
                    <p className="text-gray-800 dark:text-gray-200 pl-3 border-l-2 border-green-500">
                      {question.type === 'multiple-choice' && question.options && typeof question.correctAnswer === 'number'
                        ? question.options[question.correctAnswer]
                        : question.correctAnswer.toString()}
                    </p>
                  </div>
                  
                  {question.explanation && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Explanation:
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm italic">
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2">
        <Button 
          variant="primary"
          onClick={() => navigate(`/quiz/${quiz.id}/take`)}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retake Quiz
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate(`/quiz/${quiz.id}`)}
        >
          <Award className="mr-2 h-4 w-4" />
          Back to Quiz
        </Button>
      </CardFooter>
    </Card>
  );
};