import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { SummaryList } from '../components/summary/SummaryList';
import { Summary } from '../types';
import { getSummaries } from '../services/dataService';
import { Clock, Search } from 'lucide-react';
import { Input } from '../components/ui/Input';

export default function HistoryPage() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [filteredSummaries, setFilteredSummaries] = useState<Summary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadSummaries = async () => {
      try {
        setIsLoading(true);
        const summariesData = await getSummaries();
        setSummaries(summariesData);
        setFilteredSummaries(summariesData);
      } catch (error) {
        console.error('Failed to load summaries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSummaries();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSummaries(summaries);
      return;
    }
    
    const filtered = summaries.filter(summary => 
      summary.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      summary.summaryText.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredSummaries(filtered);
  }, [searchTerm, summaries]);
  
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
          <Clock className="h-6 w-6 text-blue-600 dark:text-blue-500 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            History
          </h1>
        </div>
        
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search summaries..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Your Summaries
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {filteredSummaries.length} {filteredSummaries.length === 1 ? 'summary' : 'summaries'} found
          </p>
          
          <SummaryList summaries={filteredSummaries} />
        </div>
      </div>
    </Layout>
  );
}