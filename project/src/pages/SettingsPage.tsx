import React from 'react';
import { Layout } from '../components/layout/Layout';
import { SettingsForm } from '../components/settings/SettingsForm';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Settings className="h-6 w-6 text-blue-600 dark:text-blue-500 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
        </div>
        
        <SettingsForm />
        
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            About SmartNote
          </h2>
          
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>
              SmartNote is an AI-powered tool designed to help students, professionals, and educators streamline the learning process.
            </p>
            
            <p>
              Our application allows you to upload or input lecture notes, PDFs, articles, or textbook content and generate concise summaries and interactive quizzes to enhance your learning experience.
            </p>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm">
                Version 1.0.0
              </p>
              <p className="text-sm">
                © {new Date().getFullYear()} SmartNote. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}