import { Summary, Quiz, QuizQuestion, QuizAttempt } from '../types';

// Mock data for development purposes
export const mockSummaries: Summary[] = [
  {
    id: '1',
    title: 'Introduction to Machine Learning',
    originalText: 'Machine learning is a field of study that gives computers the ability to learn without being explicitly programmed. It is a branch of artificial intelligence based on the idea that systems can learn from data, identify patterns, and make decisions with minimal human intervention. The process of learning begins with observations or data, such as examples, direct experience, or instruction, in order to look for patterns in data and make better decisions in the future based on the examples that we provide. The primary aim is to allow the computers to learn automatically without human intervention or assistance and adjust actions accordingly.',
    summaryText: 'Machine learning enables computers to learn without explicit programming. As a branch of AI, it allows systems to learn from data, identify patterns, and make decisions with minimal human input. Learning starts with observations or data to find patterns and improve future decisions, with the goal of enabling automatic learning without human intervention.',
    timestamp: new Date('2025-04-10T14:30:00'),
    length: 'medium',
  },
  {
    id: '2',
    title: 'Climate Change Effects',
    originalText: 'Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, such as through variations in the solar cycle. But since the 1800s, human activities have been the main driver of climate change, primarily due to burning fossil fuels like coal, oil and gas. Burning fossil fuels generates greenhouse gas emissions that act like a blanket wrapped around the Earth, trapping the sun\'s heat and raising temperatures. Examples of greenhouse gas emissions that are causing climate change include carbon dioxide and methane. These come from using gasoline for driving a car or coal for heating a building, for example. Clearing land and forests can also release carbon dioxide. Landfills for garbage are a major source of methane emissions. Energy, industry, transport, buildings, agriculture and land use are among the main emitters.',
    summaryText: 'Climate change involves long-term shifts in temperatures and weather patterns. While natural causes exist, human activities, especially burning fossil fuels, have been the primary driver since the 1800s. These activities produce greenhouse gases like carbon dioxide and methane that trap heat and raise Earth\'s temperature. Major emission sources include energy, industry, transport, buildings, agriculture, land use, and landfills.',
    timestamp: new Date('2025-04-12T09:15:00'),
    length: 'short',
  },
];

export const mockQuizQuestions: Record<string, QuizQuestion[]> = {
  '1': [
    {
      id: 'q1-1',
      question: 'What is the primary aim of machine learning?',
      type: 'multiple-choice',
      options: [
        'To replace human workers',
        'To allow computers to learn automatically without human intervention',
        'To create perfect algorithms',
        'To generate random patterns'
      ],
      correctAnswer: 1,
      explanation: 'Machine learning aims to allow computers to learn automatically and adjust actions accordingly without human intervention.'
    },
    {
      id: 'q1-2',
      question: 'Machine learning is a branch of:',
      type: 'multiple-choice',
      options: [
        'Psychology',
        'Biology',
        'Artificial Intelligence',
        'Neuroscience'
      ],
      correctAnswer: 2,
      explanation: 'Machine learning is a branch of artificial intelligence that focuses on systems learning from data.'
    },
    {
      id: 'q1-3',
      question: 'Machine learning requires explicit programming for each task.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 1,
      explanation: 'False. The key characteristic of machine learning is that it gives computers the ability to learn without being explicitly programmed.'
    },
    {
      id: 'q1-4',
      question: 'What does the process of learning begin with in machine learning?',
      type: 'multiple-choice',
      options: [
        'Computer programming',
        'Hardware installation',
        'Observations or data',
        'Software design'
      ],
      correctAnswer: 2,
      explanation: 'The process of learning in machine learning begins with observations or data, from which patterns can be identified.'
    },
    {
      id: 'q1-5',
      question: 'Explain how machine learning systems improve over time.',
      type: 'short-answer',
      correctAnswer: 'By analyzing patterns in data and adjusting their models based on new information and feedback.',
      explanation: 'Machine learning systems improve by continuously analyzing patterns in data, learning from past experiences, and adjusting their models to make better predictions or decisions based on new information and feedback.'
    }
  ],
  '2': [
    {
      id: 'q2-1',
      question: 'What has been the main driver of climate change since the 1800s?',
      type: 'multiple-choice',
      options: [
        'Natural variations in the solar cycle',
        'Volcanic eruptions',
        'Human activities, primarily burning fossil fuels',
        'Changes in Earth\'s orbit'
      ],
      correctAnswer: 2,
      explanation: 'Since the 1800s, human activities, primarily burning fossil fuels like coal, oil, and gas, have been the main driver of climate change.'
    },
    {
      id: 'q2-2',
      question: 'Which of the following are examples of greenhouse gases causing climate change?',
      type: 'multiple-choice',
      options: [
        'Oxygen and nitrogen',
        'Hydrogen and helium',
        'Carbon dioxide and methane',
        'Neon and argon'
      ],
      correctAnswer: 2,
      explanation: 'Carbon dioxide and methane are examples of greenhouse gases that are causing climate change.'
    },
    {
      id: 'q2-3',
      question: 'Climate change only refers to global warming.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 1,
      explanation: 'False. Climate change refers to long-term shifts in temperatures and weather patterns, which includes but is not limited to global warming.'
    }
  ]
};

export const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Machine Learning Basics Quiz',
    sourceId: '1',
    questions: mockQuizQuestions['1'],
    timestamp: new Date('2025-04-10T15:00:00'),
    difficulty: 'medium',
  },
  {
    id: '2',
    title: 'Climate Change Quiz',
    sourceId: '2',
    questions: mockQuizQuestions['2'],
    timestamp: new Date('2025-04-12T10:00:00'),
    difficulty: 'easy',
  },
];

export const mockQuizAttempts: QuizAttempt[] = [
  {
    id: 'a1',
    quizId: '1',
    answers: {
      'q1-1': 1,
      'q1-2': 2,
      'q1-3': 1,
      'q1-4': 2,
      'q1-5': 'By learning from data and improving predictions over time'
    },
    score: 80,
    timestamp: new Date('2025-04-10T16:30:00'),
    completed: true,
  }
];