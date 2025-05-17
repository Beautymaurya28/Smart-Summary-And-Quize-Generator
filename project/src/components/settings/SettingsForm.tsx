import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useAppContext } from '../../context/AppContext';
import { UserSettings } from '../../types';
import { Save } from 'lucide-react';

export const SettingsForm: React.FC = () => {
  const { settings, updateSettings } = useAppContext();
  const [formValues, setFormValues] = useState<UserSettings>({ ...settings });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const handleChange = (key: keyof UserSettings, value: string) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });
    
    try {
      await updateSettings(formValues);
      setMessage({ 
        text: 'Settings saved successfully.', 
        type: 'success' 
      });
    } catch (error) {
      setMessage({ 
        text: 'Failed to save settings. Please try again.', 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Default Summary Length"
              options={[
                { value: 'short', label: 'Short' },
                { value: 'medium', label: 'Medium' },
                { value: 'long', label: 'Long' },
              ]}
              value={formValues.defaultSummaryLength}
              onChange={(value) => handleChange('defaultSummaryLength', value)}
              helperText="Choose the default length for new summaries"
            />
            
            <Select
              label="Default Quiz Difficulty"
              options={[
                { value: 'easy', label: 'Easy' },
                { value: 'medium', label: 'Medium' },
                { value: 'hard', label: 'Hard' },
              ]}
              value={formValues.defaultQuizDifficulty}
              onChange={(value) => handleChange('defaultQuizDifficulty', value)}
              helperText="Choose the default difficulty for new quizzes"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Default Quiz Question Count"
              options={[
                { value: '3', label: '3 questions' },
                { value: '5', label: '5 questions' },
                { value: '10', label: '10 questions' },
              ]}
              value={formValues.defaultQuizQuestionCount.toString()}
              onChange={(value) => handleChange('defaultQuizQuestionCount', value)}
              helperText="Choose the default number of questions for new quizzes"
            />
            
            <Select
              label="Theme"
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'system', label: 'System (follow device settings)' },
              ]}
              value={formValues.theme}
              onChange={(value) => handleChange('theme', value)}
              helperText="Choose your preferred theme"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col items-start">
          <Button 
            type="submit" 
            isLoading={isSubmitting}
            className="flex items-center"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
          
          {message.text && (
            <p className={`mt-4 text-sm ${
              message.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {message.text}
            </p>
          )}
        </CardFooter>
      </Card>
    </form>
  );
};