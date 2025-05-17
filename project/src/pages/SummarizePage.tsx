import React from 'react';
import { Layout } from '../components/layout/Layout';
import { SummaryForm } from '../components/summary/SummaryForm';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { FileText } from 'lucide-react';

export default function SummarizePage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <FileText className="h-6 w-6 text-blue-600 dark:text-blue-500 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create Summary
          </h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Generate AI Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <SummaryForm />
          </CardContent>
        </Card>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-blue-600 dark:text-blue-400 mb-2 text-lg font-semibold">
              Focus on Key Points
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Our AI identifies and extracts the most important information from your notes.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-blue-600 dark:text-blue-400 mb-2 text-lg font-semibold">
              Save Time
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Quickly transform lengthy documents into concise, digestible summaries.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-blue-600 dark:text-blue-400 mb-2 text-lg font-semibold">
              Generate Quizzes
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Turn your summaries into interactive quizzes to reinforce learning.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}