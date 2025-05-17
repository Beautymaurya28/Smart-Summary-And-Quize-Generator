import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { QuizDetail } from '../components/quiz/QuizDetail';
import { Quiz, QuizAttempt } from '../types';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, getQuizAttemptsForQuiz, deleteQuiz } from '../services/dataService';
import { ArrowLeft, Trash } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function QuizDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadQuiz = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const [quizData, attemptsData] = await Promise.all([
          getQuiz(id),
          getQuizAttemptsForQuiz(id)
        ]);
        
        if (!quizData) {
          setError('Quiz not found');
          return;
        }
        
        setQuiz(quizData);
        setAttempts(attemptsData);
      } catch (err) {
        setError('Failed to load quiz');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuiz();
  }, [id]);
  
  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        await deleteQuiz(id);
        navigate('/quizzes');
      } catch (err) {
        setError('Failed to delete quiz');
        console.error(err);
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
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
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <Button
            variant="ghost"
            className="mb-4 sm:mb-0"
            onClick={() => navigate('/quizzes')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quizzes
          </Button>
          
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Quiz
          </Button>
        </div>
        
        <QuizDetail quiz={quiz} attempts={attempts} />
      </div>
    </Layout>
  );
}