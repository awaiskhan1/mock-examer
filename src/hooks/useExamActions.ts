import { useCallback } from 'react';
import { Question, UserAnswers, ExamConfig, UserAnswer } from '@/types';
import { ExamService } from '@/services/examService';
import { PDFService } from '@/services/pdfService';
import { StorageService } from '@/services/storageService';
import { ValidationUtils } from '@/utils/validation';

interface UseExamActionsProps {
  // State
  questions: Question[];
  allQuestions: Question[];
  currentQuestionIndex: number;
  userAnswers: UserAnswers;
  selectedAnswer: string;
  examConfig: ExamConfig;
  
  // Setters
  setQuestions: (questions: Question[]) => void;
  setAllQuestions: (questions: Question[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setUserAnswers: (answers: UserAnswers | ((prev: UserAnswers) => UserAnswers)) => void;
  setSelectedAnswer: (answer: string) => void;
  setShowFeedback: (show: boolean) => void;
  setIsAnswered: (answered: boolean) => void;
  setUploadedFileName: (fileName: string) => void;
  setExamConfig: (config: ExamConfig | ((prev: ExamConfig) => ExamConfig)) => void;
  setShowConfigModal: (show: boolean) => void;
}

/**
 * Custom hook for exam actions and business logic
 */
export const useExamActions = (props: UseExamActionsProps) => {
  const {
    questions,
    allQuestions,
    currentQuestionIndex,
    userAnswers,
    selectedAnswer,
    examConfig,
    setQuestions,
    setAllQuestions,
    setCurrentQuestionIndex,
    setUserAnswers,
    setSelectedAnswer,
    setShowFeedback,
    setIsAnswered,
    setUploadedFileName,
    setExamConfig,
    setShowConfigModal
  } = props;

  /**
   * Handle file upload
   */
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const fileValidation = ValidationUtils.validateFile(file);
    if (!fileValidation.isValid) {
      alert(fileValidation.error);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Validate question data
        const dataValidation = ValidationUtils.validateQuestionData(data);
        if (!dataValidation.isValid) {
          alert(dataValidation.error);
          return;
        }

        setAllQuestions(data);
        setUploadedFileName(file.name);
        // Set default exam configuration with proper values
        setExamConfig({
          startRange: '1',
          endRange: data.length.toString(),
          randomize: false,
          randomCount: ''
        });
      } catch (error) {
        alert('Invalid JSON file. Please check the file format.');
      }
    };
    reader.readAsText(file);
  }, [setAllQuestions, setUploadedFileName, setExamConfig]);

  /**
   * Handle answer selection
   */
  const handleAnswerSelect = useCallback((answer: string) => {
    setSelectedAnswer(answer);
  }, [setSelectedAnswer]);

  /**
   * Handle answer submission
   */
  const handleSubmitAnswer = useCallback(() => {
    if (!selectedAnswer || !questions[currentQuestionIndex]) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = ExamService.isAnswerCorrect(currentQuestion, selectedAnswer);
    
    const userAnswer: UserAnswer = {
      userAnswer: selectedAnswer,
      isCorrect,
      timestamp: new Date().toISOString()
    };

    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.question_number]: userAnswer
    }));

    setIsAnswered(true);
    setShowFeedback(true);
  }, [selectedAnswer, questions, currentQuestionIndex, setUserAnswers, setIsAnswered, setShowFeedback]);

  /**
   * Handle next question navigation
   */
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, questions.length, setCurrentQuestionIndex]);

  /**
   * Handle previous question navigation
   */
  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex, setCurrentQuestionIndex]);

  /**
   * Handle start exam button click
   */
  const handleStartExam = useCallback(() => {
    if (allQuestions.length === 0) {
      alert('Please upload a question file first.');
      return;
    }
    setShowConfigModal(true);
  }, [allQuestions.length, setShowConfigModal]);

  /**
   * Handle change file button click
   */
  const handleChangeFile = useCallback(() => {
    // Clear all state
    setAllQuestions([]);
    setQuestions([]);
    setUploadedFileName('');
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setSelectedAnswer('');
    setShowFeedback(false);
    setIsAnswered(false);
    setExamConfig({
      startRange: '',
      endRange: '',
      randomize: false,
      randomCount: ''
    });
    
    // Clear storage
    StorageService.clearAll();
  }, [
    setAllQuestions,
    setQuestions,
    setUploadedFileName,
    setCurrentQuestionIndex,
    setUserAnswers,
    setSelectedAnswer,
    setShowFeedback,
    setIsAnswered,
    setExamConfig
  ]);

  /**
   * Handle exam configuration change
   */
  const handleConfigChange = useCallback((field: keyof ExamConfig, value: string | boolean) => {
    setExamConfig(prev => ({
      ...prev,
      [field]: value
    }));
  }, [setExamConfig]);

  /**
   * Apply exam configuration
   */
  const applyConfiguration = useCallback(() => {
    // Validate configuration
    const configValidation = ValidationUtils.validateExamConfig(examConfig, allQuestions.length);
    if (!configValidation.isValid) {
      alert(configValidation.error);
      return;
    }

    const filteredQuestions = ExamService.filterQuestions(allQuestions, examConfig);
    setQuestions(filteredQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setSelectedAnswer('');
    setShowFeedback(false);
    setIsAnswered(false);
    setShowConfigModal(false);
  }, [
    examConfig,
    allQuestions,
    setQuestions,
    setCurrentQuestionIndex,
    setUserAnswers,
    setSelectedAnswer,
    setShowFeedback,
    setIsAnswered,
    setShowConfigModal
  ]);

  /**
   * Skip configuration and use all questions
   */
  const skipConfiguration = useCallback(() => {
    setQuestions(allQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setSelectedAnswer('');
    setShowFeedback(false);
    setIsAnswered(false);
    setShowConfigModal(false);
  }, [
    allQuestions,
    setQuestions,
    setCurrentQuestionIndex,
    setUserAnswers,
    setSelectedAnswer,
    setShowFeedback,
    setIsAnswered,
    setShowConfigModal
  ]);

  /**
   * Reset exam session and return to file upload page
   */
  const resetSession = useCallback(() => {
    if (window.confirm('Are you sure you want to reset the session? All progress will be lost.')) {
      // Clear all exam data
      setAllQuestions([]);
      setQuestions([]);
      setUploadedFileName('');
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setSelectedAnswer('');
      setShowFeedback(false);
      setIsAnswered(false);
      setShowConfigModal(false);
      setExamConfig({
        startRange: '',
        endRange: '',
        randomize: false,
        randomCount: ''
      });
      // Clear localStorage
      StorageService.clearAll();
    }
  }, [
    setAllQuestions,
    setQuestions,
    setUploadedFileName,
    setCurrentQuestionIndex,
    setUserAnswers,
    setSelectedAnswer,
    setShowFeedback,
    setIsAnswered,
    setShowConfigModal,
    setExamConfig
  ]);

  /**
   * Generate PDF report
   */
  const generatePDF = useCallback(() => {
    if (questions.length === 0) {
      alert('No questions available for PDF generation.');
      return;
    }

    try {
      PDFService.generateExamReport(questions, userAnswers);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  }, [questions, userAnswers]);

  return {
    handleFileUpload,
    handleAnswerSelect,
    handleSubmitAnswer,
    handleNextQuestion,
    handlePreviousQuestion,
    handleStartExam,
    handleChangeFile,
    handleConfigChange,
    applyConfiguration,
    skipConfiguration,
    resetSession,
    generatePDF
  };
};