import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { SummaryStats } from '../components/dashboard/SummaryStats';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { SummaryList } from '../components/summary/SummaryList';
import { QuizList } from '../components/quiz/QuizList';
import { Summary, Quiz } from '../types';
import { useNavigate } from 'react-router-dom';
import { getSummaries, getQuizzes } from '../services/dataService';
import { Plus, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [summariesData, quizzesData] = await Promise.all([
          getSummaries(),
          getQuizzes()
        ]);
        setSummaries(summariesData);
        setQuizzes(quizzesData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Welcome to SmartNote! Create summaries and quizzes from your notes.
            </p>
          </div>
          
          <Button 
            variant="primary"
            className="mt-4 sm:mt-0"
            onClick={() => navigate('/summarize')}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Summary
          </Button>
        </div>
        
        <SummaryStats summaries={summaries} quizzes={quizzes} />
        
        <RecentActivity summaries={summaries} quizzes={quizzes} />
        
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Summaries</h2>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => navigate('/history')}
              className="text-blue-600 dark:text-blue-400"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <SummaryList summaries={summaries.slice(0, 3)} />
        </div>
        
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Quizzes</h2>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => navigate('/quizzes')}
              className="text-blue-600 dark:text-blue-400"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <QuizList quizzes={quizzes.slice(0, 3)} />
        </div>
      </div>
    </Layout>
  );
}