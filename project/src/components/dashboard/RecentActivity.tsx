import React from 'react';
import { Summary, Quiz } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { FileText, Award, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecentActivityProps {
  summaries: Summary[];
  quizzes: Quiz[];
}

interface ActivityItem {
  id: string;
  type: 'summary' | 'quiz';
  title: string;
  timestamp: Date;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ summaries, quizzes }) => {
  const navigate = useNavigate();
  
  // Combine summaries and quizzes into a single array
  const activities: ActivityItem[] = [
    ...summaries.map(summary => ({
      id: summary.id,
      type: 'summary' as const,
      title: summary.title,
      timestamp: new Date(summary.timestamp)
    })),
    ...quizzes.map(quiz => ({
      id: quiz.id,
      type: 'quiz' as const,
      title: quiz.title,
      timestamp: new Date(quiz.timestamp)
    }))
  ];
  
  // Sort by timestamp (most recent first)
  activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  // Take only the most recent 5 activities
  const recentActivities = activities.slice(0, 5);
  
  const handleActivityClick = (activity: ActivityItem) => {
    if (activity.type === 'summary') {
      navigate(`/summary/${activity.id}`);
    } else {
      navigate(`/quiz/${activity.id}`);
    }
  };
  
  if (recentActivities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No recent activity. Start by creating a summary or quiz.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div 
              key={`${activity.type}-${activity.id}`}
              className="flex items-start p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              onClick={() => handleActivityClick(activity)}
            >
              <div className={`rounded-full p-2 mr-3 ${
                activity.type === 'summary' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
              }`}>
                {activity.type === 'summary' ? (
                  <FileText className="h-4 w-4" />
                ) : (
                  <Award className="h-4 w-4" />
                )}
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                  {activity.title}
                </p>
                <div className="flex items-center mt-1">
                  <Clock className="h-3 w-3 text-gray-400 dark:text-gray-500 mr-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.timestamp.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="ml-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  activity.type === 'summary'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                }`}>
                  {activity.type === 'summary' ? 'Summary' : 'Quiz'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};