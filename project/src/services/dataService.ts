import { Summary, Quiz, QuizQuestion, QuizAttempt, UserSettings } from '../types';
import { mockSummaries, mockQuizzes, mockQuizAttempts } from './mockData';

// Simulated delay to mimic API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Local storage keys
const SUMMARIES_KEY = 'smart-note-summaries';
const QUIZZES_KEY = 'smart-note-quizzes';
const ATTEMPTS_KEY = 'smart-note-attempts';
const SETTINGS_KEY = 'smart-note-settings';

// Initialize with mock data or from local storage
const initializeSummaries = (): Summary[] => {
  const storedSummaries = localStorage.getItem(SUMMARIES_KEY);
  return storedSummaries ? JSON.parse(storedSummaries) : mockSummaries;
};

const initializeQuizzes = (): Quiz[] => {
  const storedQuizzes = localStorage.getItem(QUIZZES_KEY);
  return storedQuizzes ? JSON.parse(storedQuizzes) : mockQuizzes;
};

const initializeAttempts = (): QuizAttempt[] => {
  const storedAttempts = localStorage.getItem(ATTEMPTS_KEY);
  return storedAttempts ? JSON.parse(storedAttempts) : mockQuizAttempts;
};

const initializeSettings = (): UserSettings => {
  const storedSettings = localStorage.getItem(SETTINGS_KEY);
  return storedSettings ? JSON.parse(storedSettings) : {
    defaultSummaryLength: 'medium',
    defaultQuizDifficulty: 'medium',
    defaultQuizQuestionCount: 5,
    theme: 'light'
  };
};

// Data stores
let summaries = initializeSummaries();
let quizzes = initializeQuizzes();
let attempts = initializeAttempts();
let settings = initializeSettings();

// Helper to save data to local storage
const saveToLocalStorage = () => {
  localStorage.setItem(SUMMARIES_KEY, JSON.stringify(summaries));
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// Summary services
export const getSummaries = async (): Promise<Summary[]> => {
  await delay(500);
  return [...summaries];
};

export const getSummary = async (id: string): Promise<Summary | undefined> => {
  await delay(300);
  return summaries.find(summary => summary.id === id);
};

export const createSummary = async (text: string, title: string, length: 'short' | 'medium' | 'long'): Promise<Summary> => {
  await delay(1500); // Longer delay to simulate AI processing
  
  // Create a summary based on text length and requested summary length
  let summaryText = '';
  
  if (text.length > 500) {
    const sentenceCount = length === 'short' ? 2 : length === 'medium' ? 4 : 6;
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    summaryText = sentences.slice(0, sentenceCount).join(' ');
  } else {
    summaryText = text.substring(0, text.length / 2);
  }
  
  const newSummary: Summary = {
    id: Date.now().toString(),
    title,
    originalText: text,
    summaryText,
    timestamp: new Date(),
    length
  };
  
  summaries = [newSummary, ...summaries];
  saveToLocalStorage();
  
  return newSummary;
};

export const deleteSummary = async (id: string): Promise<void> => {
  await delay(300);
  summaries = summaries.filter(summary => summary.id !== id);
  saveToLocalStorage();
};

// Quiz services
export const getQuizzes = async (): Promise<Quiz[]> => {
  await delay(500);
  return [...quizzes];
};

export const getQuiz = async (id: string): Promise<Quiz | undefined> => {
  await delay(300);
  return quizzes.find(quiz => quiz.id === id);
};

export const createQuiz = async (
  summaryId: string, 
  title: string, 
  difficulty: 'easy' | 'medium' | 'hard',
  questionCount: number = 5
): Promise<Quiz> => {
  await delay(2000); // Longer delay to simulate AI processing
  
  const summary = await getSummary(summaryId);
  if (!summary) throw new Error('Summary not found');
  
  // Generate quiz questions based on the summary
  const questionTypes: ('multiple-choice' | 'true-false' | 'short-answer')[] = 
    ['multiple-choice', 'multiple-choice', 'true-false', 'multiple-choice', 'short-answer'];
  
  const questions: QuizQuestion[] = [];
  
  // Generate n questions where n = questionCount
  for (let i = 0; i < questionCount; i++) {
    const type = questionTypes[i % questionTypes.length];
    
    // Extract a sentence from the summary to base the question on
    const sentences = summary.summaryText.match(/[^.!?]+[.!?]+/g) || [];
    const sentenceIndex = i % sentences.length;
    const sentence = sentences[sentenceIndex];
    
    // Create a question based on the sentence and question type
    let question: QuizQuestion;
    
    if (type === 'multiple-choice') {
      // Simple placeholder for demo - in a real app, this would use NLP
      question = {
        id: `${summaryId}-q${i+1}`,
        question: `What is the main point of: "${sentence.substring(0, 50)}..."?`,
        type: 'multiple-choice',
        options: [
          'Option A - The correct answer',
          'Option B - An incorrect answer',
          'Option C - Another incorrect answer',
          'Option D - Yet another incorrect answer'
        ],
        correctAnswer: 0, // First option is correct
        explanation: 'This is the explanation for the correct answer.'
      };
    } else if (type === 'true-false') {
      question = {
        id: `${summaryId}-q${i+1}`,
        question: `True or False: ${sentence.substring(0, 50)}...`,
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0, // True is correct
        explanation: 'This statement is accurate based on the text.'
      };
    } else {
      question = {
        id: `${summaryId}-q${i+1}`,
        question: `Explain briefly: ${sentence.substring(0, 50)}...`,
        type: 'short-answer',
        correctAnswer: 'The correct answer would be a brief explanation of the key concepts.',
        explanation: 'A good answer would cover the main points and demonstrate understanding.'
      };
    }
    
    questions.push(question);
  }
  
  const newQuiz: Quiz = {
    id: Date.now().toString(),
    title,
    sourceId: summaryId,
    questions,
    timestamp: new Date(),
    difficulty
  };
  
  quizzes = [newQuiz, ...quizzes];
  saveToLocalStorage();
  
  return newQuiz;
};

export const deleteQuiz = async (id: string): Promise<void> => {
  await delay(300);
  quizzes = quizzes.filter(quiz => quiz.id !== id);
  saveToLocalStorage();
};

// Quiz attempt services
export const getQuizAttempts = async (): Promise<QuizAttempt[]> => {
  await delay(300);
  return [...attempts];
};

export const getQuizAttemptsForQuiz = async (quizId: string): Promise<QuizAttempt[]> => {
  await delay(300);
  return attempts.filter(attempt => attempt.quizId === quizId);
};

export const createQuizAttempt = async (quizId: string): Promise<QuizAttempt> => {
  await delay(300);
  
  const newAttempt: QuizAttempt = {
    id: Date.now().toString(),
    quizId,
    answers: {},
    score: 0,
    timestamp: new Date(),
    completed: false
  };
  
  attempts = [newAttempt, ...attempts];
  saveToLocalStorage();
  
  return newAttempt;
};

export const submitQuizAnswer = async (
  attemptId: string, 
  questionId: string, 
  answer: string | number
): Promise<QuizAttempt> => {
  await delay(200);
  
  const attemptIndex = attempts.findIndex(a => a.id === attemptId);
  if (attemptIndex === -1) throw new Error('Attempt not found');
  
  const updatedAttempt = { ...attempts[attemptIndex] };
  updatedAttempt.answers = { ...updatedAttempt.answers, [questionId]: answer };
  
  attempts = [
    ...attempts.slice(0, attemptIndex),
    updatedAttempt,
    ...attempts.slice(attemptIndex + 1)
  ];
  
  saveToLocalStorage();
  return updatedAttempt;
};

export const completeQuizAttempt = async (attemptId: string): Promise<QuizAttempt> => {
  await delay(500);
  
  const attemptIndex = attempts.findIndex(a => a.id === attemptId);
  if (attemptIndex === -1) throw new Error('Attempt not found');
  
  const attempt = attempts[attemptIndex];
  const quiz = await getQuiz(attempt.quizId);
  if (!quiz) throw new Error('Quiz not found');
  
  // Calculate score
  let correctAnswers = 0;
  
  for (const question of quiz.questions) {
    if (attempt.answers[question.id] === question.correctAnswer) {
      correctAnswers++;
    }
  }
  
  const score = Math.round((correctAnswers / quiz.questions.length) * 100);
  
  const updatedAttempt: QuizAttempt = {
    ...attempt,
    score,
    completed: true
  };
  
  attempts = [
    ...attempts.slice(0, attemptIndex),
    updatedAttempt,
    ...attempts.slice(attemptIndex + 1)
  ];
  
  saveToLocalStorage();
  return updatedAttempt;
};

// Settings services
export const getUserSettings = async (): Promise<UserSettings> => {
  await delay(200);
  return { ...settings };
};

export const updateUserSettings = async (newSettings: Partial<UserSettings>): Promise<UserSettings> => {
  await delay(300);
  settings = { ...settings, ...newSettings };
  saveToLocalStorage();
  return { ...settings };
};

// Export utilities
export const exportToText = (content: string): void => {
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = `export-${Date.now()}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const exportToPDF = async (content: string, title: string): Promise<void> => {
  // In a real app, this would generate a PDF
  // For this demo, we'll use a text file with a .pdf extension
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'application/pdf' });
  element.href = URL.createObjectURL(file);
  element.download = `${title.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};