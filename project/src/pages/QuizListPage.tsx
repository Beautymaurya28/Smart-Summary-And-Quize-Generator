import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { QuizList } from '../components/quiz/QuizList';
import { Quiz } from '../types';
import { getQuizzes } from '../services/dataService';
import { Award } from 'lucide-react';

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setIsLoading(true);
        const quizzesData = await getQuizzes();
        setQuizzes(quizzesData);
      } catch (error) {
        console.error('Failed to load quizzes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuizzes();
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
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <Award className="h-6 w-6 text-purple-600 dark:text-purple-500 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quizzes
          </h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Test Your Knowledge
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Below are all the quizzes you've created. Take a quiz to test your understanding of the material.
          </p>
          
          <QuizList quizzes={quizzes} />
        </div>
      </div>
    </Layout>
  );
}