import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { QuizResult } from '../components/quiz/QuizResult';
import { Quiz, QuizAttempt } from '../types';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, getQuizAttemptsForQuiz } from '../services/dataService';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function QuizResultPage() {
  const { quizId, attemptId } = useParams<{ quizId: string, attemptId: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadData = async () => {
      if (!quizId || !attemptId) return;
      
      try {
        setIsLoading(true);
        const quizData = await getQuiz(quizId);
        
        if (!quizData) {
          setError('Quiz not found');
          return;
        }
        
        const attempts = await getQuizAttemptsForQuiz(quizId);
        const attemptData = attempts.find(a => a.id === attemptId);
        
        if (!attemptData) {
          setError('Attempt not found');
          return;
        }
        
        setQuiz(quizData);
        setAttempt(attemptData);
      } catch (err) {
        setError('Failed to load quiz result');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [quizId, attemptId]);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }
  
  if (error || !quiz || !attempt) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{error || 'Quiz result not found'}</h3>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate('/quizzes')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quizzes
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/quiz/${quizId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quiz
          </Button>
        </div>
        
        <QuizResult quiz={quiz} attempt={attempt} />
      </div>
    </Layout>
  );
}