import React, { useState, useEffect } from 'react';
import { Quiz, QuizQuestion, QuizAttempt } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { createQuizAttempt, submitQuizAnswer, completeQuizAttempt } from '../../services/dataService';
import { useNavigate } from 'react-router-dom';
import { TextArea } from '../ui/Input';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface QuizTakerProps {
  quiz: Quiz;
}

export const QuizTaker: React.FC<QuizTakerProps> = ({ quiz }) => {
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  
  useEffect(() => {
    const initQuizAttempt = async () => {
      try {
        setIsLoading(true);
        const newAttempt = await createQuizAttempt(quiz.id);
        setAttempt(newAttempt);
      } catch (err) {
        setError('Failed to initialize quiz. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    initQuizAttempt();
  }, [quiz.id]);
  
  const handleAnswerChange = async (questionId: string, answer: string | number) => {
    if (!attempt) return;
    
    // Update local state
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    
    try {
      // Send to backend
      await submitQuizAnswer(attempt.id, questionId, answer);
    } catch (err) {
      console.error('Failed to save answer:', err);
    }
  };
  
  const navigateToQuestion = (index: number) => {
    if (index >= 0 && index < quiz.questions.length) {
      setCurrentQuestionIndex(index);
    }
  };
  
  const handleSubmitQuiz = async () => {
    if (!attempt) return;
    
    try {
      setIsSubmitting(true);
      const completedAttempt = await completeQuizAttempt(attempt.id);
      navigate(`/quiz/${quiz.id}/attempt/${completedAttempt.id}`);
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!currentQuestion) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No questions found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          This quiz doesn't have any questions.
        </p>
      </div>
    );
  }
  
  return (
    <Card className="animate-fadeIn">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{quiz.title}</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
        </div>
        <Badge 
          variant={quiz.difficulty === 'easy' ? 'success' : quiz.difficulty === 'medium' ? 'warning' : 'danger'}
          size="md"
        >
          {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
        </Badge>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Question Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 dark:bg-blue-500 h-full transition-all duration-300 ease-in-out"
              style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
          
          {/* Question */}
          <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <Badge
                variant={
                  currentQuestion.type === 'multiple-choice' ? 'primary' : 
                  currentQuestion.type === 'true-false' ? 'secondary' : 'default'
                }
              >
                {currentQuestion.type === 'multiple-choice' ? 'Multiple Choice' : 
                 currentQuestion.type === 'true-false' ? 'True/False' : 'Short Answer'}
              </Badge>
              
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Object.keys(answers).length} of {quiz.questions.length} answered
              </span>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {currentQuestion.question}
            </h3>
            
            {/* Answer Options */}
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <div 
                    key={index}
                    className={`
                      p-3 rounded-md border cursor-pointer transition-all
                      ${answers[currentQuestion.id] === index 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400' 
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}
                    `}
                    onClick={() => handleAnswerChange(currentQuestion.id, index)}
                  >
                    <div className="flex items-center">
                      <div className={`
                        w-5 h-5 rounded-full border flex items-center justify-center mr-3
                        ${answers[currentQuestion.id] === index 
                          ? 'border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400' 
                          : 'border-gray-400 dark:border-gray-500'}
                      `}>
                        {answers[currentQuestion.id] === index && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      {option}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {currentQuestion.type === 'true-false' && (
              <div className="flex gap-4">
                <Button
                  variant={answers[currentQuestion.id] === 0 ? 'primary' : 'outline'}
                  className="flex-1"
                  onClick={() => handleAnswerChange(currentQuestion.id, 0)}
                >
                  True
                </Button>
                <Button
                  variant={answers[currentQuestion.id] === 1 ? 'primary' : 'outline'}
                  className="flex-1"
                  onClick={() => handleAnswerChange(currentQuestion.id, 1)}
                >
                  False
                </Button>
              </div>
            )}
            
            {currentQuestion.type === 'short-answer' && (
              <TextArea
                placeholder="Type your answer here..."
                value={answers[currentQuestion.id] as string || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                className="min-h-[100px]"
              />
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => navigateToQuestion(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <Button
            variant="outline"
            onClick={() => navigateToQuestion(currentQuestionIndex + 1)}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleSubmitQuiz}
            isLoading={isSubmitting}
          >
            Submit Quiz
          </Button>
        )}
      </CardFooter>
      
      {error && (
        <div className="p-4 text-red-600 dark:text-red-500 text-sm">
          {error}
        </div>
      )}
    </Card>
  );
};