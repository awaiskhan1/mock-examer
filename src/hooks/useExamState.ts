import { useState, useEffect } from 'react';
import { Question, UserAnswers, ExamConfig } from '@/types';
import { StorageService } from '@/services/storageService';

/**
 * Custom hook for managing exam state
 */
export const useExamState = () => {
  // Core state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // File and configuration state
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [examConfig, setExamConfig] = useState<ExamConfig>({
    startRange: '',
    endRange: '',
    randomize: false,
    randomCount: ''
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedQuestions = StorageService.loadQuestions();
    const savedCurrentIndex = StorageService.loadCurrentIndex();
    const savedUserAnswers = StorageService.loadUserAnswers();
    const savedFileName = StorageService.loadFileName();

    if (savedQuestions && savedQuestions.length > 0) {
      setQuestions(savedQuestions);
      setAllQuestions(savedQuestions);
    }
    if (savedCurrentIndex !== null) {
      setCurrentQuestionIndex(savedCurrentIndex);
    }
    if (savedUserAnswers && Object.keys(savedUserAnswers).length > 0) {
      setUserAnswers(savedUserAnswers);
    }
    if (savedFileName) {
      setUploadedFileName(savedFileName);
    }
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    if (questions.length > 0) {
      StorageService.saveQuestions(questions);
    }
  }, [questions]);

  // Note: allQuestions are saved as part of questions since StorageService doesn't have separate method

  useEffect(() => {
    StorageService.saveCurrentIndex(currentQuestionIndex);
  }, [currentQuestionIndex]);

  useEffect(() => {
    StorageService.saveUserAnswers(userAnswers);
  }, [userAnswers]);

  useEffect(() => {
    if (uploadedFileName) {
      StorageService.saveFileName(uploadedFileName);
    }
  }, [uploadedFileName]);

  // Update answer state when current question changes
  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      const savedAnswer = userAnswers[currentQuestion.question_number];
      if (savedAnswer) {
        setSelectedAnswers(savedAnswer.userAnswers);
        setIsAnswered(true);
        setShowFeedback(true);
      } else {
        setSelectedAnswers([]);
        setIsAnswered(false);
        setShowFeedback(false);
      }
    }
  }, [currentQuestionIndex, questions, userAnswers]);

  // Computed values
  const currentQuestion = questions[currentQuestionIndex] || null;
  const totalQuestions = questions.length;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const hasQuestions = questions.length > 0;
  const hasAllQuestions = allQuestions.length > 0;
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercentage = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return {
    // State
    questions,
    allQuestions,
    currentQuestionIndex,
    userAnswers,
    selectedAnswers,
    showFeedback,
    isAnswered,
    uploadedFileName,
    showConfigModal,
    examConfig,
    
    // Setters
    setQuestions,
    setAllQuestions,
    setCurrentQuestionIndex,
    setUserAnswers,
    setSelectedAnswers,
    setShowFeedback,
    setIsAnswered,
    setUploadedFileName,
    setShowConfigModal,
    setExamConfig,
    
    // Computed values
    currentQuestion,
    totalQuestions,
    isFirstQuestion,
    isLastQuestion,
    hasQuestions,
    hasAllQuestions,
    answeredCount,
    progressPercentage
  };
};