import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { SummaryDetail } from '../components/summary/SummaryDetail';
import { QuizForm } from '../components/quiz/QuizForm';
import { Summary } from '../types';
import { useParams, useNavigate } from 'react-router-dom';
import { getSummary, deleteSummary } from '../services/dataService';
import { ArrowLeft, Trash } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function SummaryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadSummary = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const summaryData = await getSummary(id);
        
        if (!summaryData) {
          setError('Summary not found');
          return;
        }
        
        setSummary(summaryData);
      } catch (err) {
        setError('Failed to load summary');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSummary();
  }, [id]);
  
  const handleCreateQuiz = () => {
    setShowQuizForm(true);
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this summary? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        await deleteSummary(id);
        navigate('/history');
      } catch (err) {
        setError('Failed to delete summary');
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
  
  if (error || !summary) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{error || 'Summary not found'}</h3>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate('/history')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
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
            onClick={() => navigate('/history')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Button>
          
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Summary
          </Button>
        </div>
        
        <SummaryDetail 
          summary={summary} 
          onCreateQuiz={handleCreateQuiz} 
        />
        
        {showQuizForm && (
          <div className="mt-8 animate-fadeIn">
            <QuizForm summary={summary} />
          </div>
        )}
      </div>
    </Layout>
  );
}