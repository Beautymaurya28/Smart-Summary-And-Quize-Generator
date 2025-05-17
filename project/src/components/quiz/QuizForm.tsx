import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Award } from 'lucide-react';
import { createQuiz } from '../../services/dataService';
import { useNavigate } from 'react-router-dom';
import { Summary } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface QuizFormProps {
  summary: Summary;
}

export const QuizForm: React.FC<QuizFormProps> = ({ summary }) => {
  const { settings } = useAppContext();
  const [title, setTitle] = useState(`Quiz on ${summary.title}`);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(settings.defaultQuizDifficulty);
  const [questionCount, setQuestionCount] = useState(settings.defaultQuizQuestionCount.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a title for your quiz');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const quiz = await createQuiz(
        summary.id, 
        title, 
        difficulty,
        parseInt(questionCount, 10)
      );
      navigate(`/quiz/${quiz.id}`);
    } catch (err) {
      setError('Failed to create quiz. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 dark:bg-gray-750 p-4 rounded-md mb-4">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
          Creating quiz from: {summary.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This quiz will be based on the content of your summary. You can customize the quiz settings below.
        </p>
      </div>
      
      <Input
        label="Quiz Title"
        placeholder="Enter a title for your quiz"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full"
        required
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Difficulty"
          options={[
            { value: 'easy', label: 'Easy' },
            { value: 'medium', label: 'Medium' },
            { value: 'hard', label: 'Hard' },
          ]}
          value={difficulty}
          onChange={setDifficulty as (value: string) => void}
          helperText="Select the quiz difficulty level"
        />
        
        <Select
          label="Number of Questions"
          options={[
            { value: '3', label: '3 questions' },
            { value: '5', label: '5 questions' },
            { value: '10', label: '10 questions' },
          ]}
          value={questionCount}
          onChange={setQuestionCount}
          helperText="Select how many questions to generate"
        />
      </div>
      
      <Button 
        type="submit" 
        isLoading={isLoading}
        disabled={!title.trim() || isLoading}
        className="w-full md:w-auto"
      >
        <Award className="mr-2 h-4 w-4" />
        Generate Quiz
      </Button>
      
      {error && (
        <div className="text-red-600 dark:text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </form>
  );
};