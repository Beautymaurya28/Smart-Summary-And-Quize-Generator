import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { QuizTaker } from '../components/quiz/QuizTaker';
import { Quiz } from '../types';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz } from '../services/dataService';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function QuizTakePage() {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadQuiz = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const quizData = await getQuiz(id);
        
        if (!quizData) {
          setError('Quiz not found');
          return;
        }
        
        setQuiz(quizData);
      } catch (err) {
        setError('Failed to load quiz');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuiz();
  }, [id]);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }
  
  if (error || !quiz) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{error || 'Quiz not found'}</h3>
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
            onClick={() => navigate(`/quiz/${id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quiz Details
          </Button>
        </div>
        
        <QuizTaker quiz={quiz} />
      </div>
    </Layout>
  );
}