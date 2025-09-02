// Core data types
export interface Question {
  question_number: number;
  question: string;
  options: string[];
  correct_answers: string[];
  explanation?: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface UserAnswer {
  userAnswers: string[];
  isCorrect: boolean;
  timestamp: string;
}

export interface UserAnswers {
  [questionNumber: string]: UserAnswer;
}

// Exam configuration types
export interface ExamConfig {
  randomize: boolean;
  randomCount: string;
  startRange: string;
  endRange: string;
}

// Component props types
export interface QuestionCardProps {
  question: Question;
  selectedAnswers: string[];
  showFeedback: boolean;
  isAnswered: boolean;
  onAnswerSelect: (answer: string) => void;
  onSubmitAnswer: () => void;
}

export interface NavigationProps {
  currentIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export interface FileUploadProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedFileName: string;
  totalQuestions: number;
  onChangeFile: () => void;
  onStartExam: () => void;
}

export interface ConfigModalProps {
  isOpen: boolean;
  examConfig: ExamConfig;
  totalQuestions: number;
  onConfigChange: (field: keyof ExamConfig, value: string | boolean) => void;
  onApplyConfiguration: () => void;
  onSkipConfiguration: () => void;
  onClose: () => void;
}

export interface ProgressBarProps {
  current: number;
  total: number;
  answered: number;
}

export interface ExamHeaderProps {
  uploadedFileName: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredCount: number;
  onResetSession: () => void;
  onGeneratePDF: () => void;
}

export interface ExamResultsProps {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  onRestart: () => void;
  onGeneratePDF: () => void;
}

// Service types
export interface ExamService {
  filterQuestions: (questions: Question[], config: ExamConfig) => Question[];
  shuffleArray: <T>(array: T[]) => T[];
  calculateScore: (userAnswers: UserAnswers) => {
    total: number;
    correct: number;
    percentage: number;
  };
}

export interface StorageService {
  saveQuestions: (questions: Question[]) => void;
  loadQuestions: () => Question[] | null;
  saveUserAnswers: (answers: UserAnswers) => void;
  loadUserAnswers: () => UserAnswers | null;
  saveCurrentIndex: (index: number) => void;
  loadCurrentIndex: () => number | null;
  saveFileName: (fileName: string) => void;
  loadFileName: () => string | null;
  clearAll: () => void;
}

export interface PDFService {
  generateExamReport: (questions: Question[], userAnswers: UserAnswers) => void;
}

// Hook types
export interface UseExamState {
  questions: Question[];
  allQuestions: Question[];
  currentQuestionIndex: number;
  userAnswers: UserAnswers;
  selectedAnswers: string[];
  showFeedback: boolean;
  isAnswered: boolean;
  uploadedFileName: string;
  examConfig: ExamConfig;
  showConfigModal: boolean;
}

export interface UseExamActions {
  setQuestions: (questions: Question[]) => void;
  setAllQuestions: (questions: Question[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setUserAnswers: (answers: UserAnswers | ((prev: UserAnswers) => UserAnswers)) => void;
  setSelectedAnswers: (answers: string[] | ((prev: string[]) => string[])) => void;
  setShowFeedback: (show: boolean) => void;
  setIsAnswered: (answered: boolean) => void;
  setUploadedFileName: (fileName: string) => void;
  setExamConfig: (config: ExamConfig | ((prev: ExamConfig) => ExamConfig)) => void;
  setShowConfigModal: (show: boolean) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAnswerSelect: (answer: string) => void;
  handleSubmitAnswer: () => void;
  handleNextQuestion: () => void;
  handlePreviousQuestion: () => void;
  handleStartExam: () => void;
  handleChangeFile: () => void;
  handleConfigChange: (field: keyof ExamConfig, value: string | boolean) => void;
  applyConfiguration: () => void;
  skipConfiguration: () => void;
  resetSession: () => void;
  generatePDF: () => void;
}

// Style types
export interface StyleObject {
  [key: string]: React.CSSProperties;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;