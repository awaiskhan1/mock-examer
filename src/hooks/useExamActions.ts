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
  selectedAnswers: string[];
  examConfig: ExamConfig;
  
  // Setters
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
    selectedAnswers,
    examConfig,
    setQuestions,
    setAllQuestions,
    setCurrentQuestionIndex,
    setUserAnswers,
    setSelectedAnswers,
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
        const rawData = JSON.parse(content);
        
        // Transform data format if needed
        const transformedData = rawData.map((question: any) => {
          // Handle options format transformation
          let options: string[];
          let letterMapping: { [key: string]: number } = {}; // Maps original letter to new position
          
          if (Array.isArray(question.options)) {
            // Check if options already have letter prefixes (e.g., "A. text", "B. text")
            // First validate that all options are strings
            if (question.options.some((option: any) => typeof option !== 'string')) {
              throw new Error(`Question at index ${question.question_number - 1} has non-string options: ${JSON.stringify(question.options)}`);
            }
            
            const hasLetterPrefixes = question.options.some((option: any) => 
              typeof option === 'string' && /^[A-Z]\. /.test(option)
            );
            
            if (hasLetterPrefixes) {
              // Create mapping from original letters to their content
              const optionMap: { [key: string]: string } = {};
              question.options.forEach((option: any) => {
                const letter = option.charAt(0);
                const text = option.replace(/^[A-Z]\. /, '');
                // Ensure text is not empty after removing prefix
                if (text.trim().length === 0) {
                  throw new Error(`Question at index ${question.question_number - 1} has option '${option}' with no content after letter prefix`);
                }
                optionMap[letter] = text;
              });
              
              // Sort letters alphabetically and create the options array
              const sortedLetters = Object.keys(optionMap).sort();
              options = sortedLetters.map(letter => optionMap[letter]);
              
              // Create mapping from original letter to new position (A=0, B=1, C=2, D=3)
              sortedLetters.forEach((letter, index) => {
                letterMapping[letter] = index;
              });
            } else {
              options = question.options;
            }
          } else if (typeof question.options === 'object') {
            // Convert object format {"A": "text", "B": "text"} to array
            // Sort keys to maintain A, B, C, D order
            const sortedKeys = Object.keys(question.options).sort();
            options = sortedKeys.map(key => question.options[key]);
          } else {
            throw new Error(`Invalid options format in question ${question.question_number}`);
          }

          // Handle correct_answer(s) format transformation
          let correct_answers: string[];
          if (Array.isArray(question.correct_answers)) {
            // If we have letter mapping, convert letter-based answers to position-based
            if (Object.keys(letterMapping).length > 0) {
              correct_answers = question.correct_answers.map((answer: any) => {
                if (typeof answer === 'string' && letterMapping.hasOwnProperty(answer)) {
                  // Convert letter to corresponding position letter (A, B, C, D)
                  return String.fromCharCode(65 + letterMapping[answer]); // 65 is 'A'
                }
                return answer;
              });
            } else {
              correct_answers = question.correct_answers;
            }
          } else if (question.correct_answer) {
            // Convert single correct_answer to array
            let singleAnswer = question.correct_answer;
            if (Object.keys(letterMapping).length > 0 && typeof singleAnswer === 'string' && letterMapping.hasOwnProperty(singleAnswer)) {
              singleAnswer = String.fromCharCode(65 + letterMapping[singleAnswer]);
            }
            correct_answers = [singleAnswer];
          } else if (question.correct_answers) {
            // Handle case where it might be a string
            if (typeof question.correct_answers === 'string') {
              let stringAnswer = question.correct_answers;
              if (Object.keys(letterMapping).length > 0 && letterMapping.hasOwnProperty(stringAnswer)) {
                stringAnswer = String.fromCharCode(65 + letterMapping[stringAnswer]);
              }
              correct_answers = [stringAnswer];
            } else {
              // If we have letter mapping, convert letter-based answers to position-based
              if (Object.keys(letterMapping).length > 0) {
                correct_answers = question.correct_answers.map((answer: any) => {
                  if (typeof answer === 'string' && letterMapping.hasOwnProperty(answer)) {
                    return String.fromCharCode(65 + letterMapping[answer]);
                  }
                  return answer;
                });
              } else {
                correct_answers = question.correct_answers;
              }
            }
          } else {
            throw new Error(`No correct answer found in question ${question.question_number}`);
          }

          return {
            ...question,
            options,
            correct_answers
          };
        });
        
        // Validate transformed question data
        const dataValidation = ValidationUtils.validateQuestionData(transformedData);
        if (!dataValidation.isValid) {
          alert(dataValidation.error);
          return;
        }

        setAllQuestions(transformedData);
        setUploadedFileName(file.name);
        // Set default exam configuration with proper values
        setExamConfig({
          startRange: '1',
          endRange: transformedData.length.toString(),
          randomize: false,
          randomCount: ''
        });
      } catch (error) {
        console.error('JSON parsing error:', error);
        console.error('File content preview:', reader.result?.toString().substring(0, 500));
        alert(`Invalid JSON file. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    reader.readAsText(file);
  }, [setAllQuestions, setUploadedFileName, setExamConfig]);

  /**
   * Handle answer selection
   */
  const handleAnswerSelect = useCallback((answer: string) => {
    setSelectedAnswers((prev: string[]) => {
      if (prev.includes(answer)) {
        // Remove answer if already selected
        return prev.filter((a: string) => a !== answer);
      } else {
        // Add answer if not selected
        return [...prev, answer];
      }
    });
  }, [setSelectedAnswers]);

  /**
   * Handle answer submission
   */
  const handleSubmitAnswer = useCallback(() => {
    if (selectedAnswers.length === 0 || !questions[currentQuestionIndex]) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = ExamService.isAnswerCorrect(currentQuestion, selectedAnswers);
    
    const userAnswer: UserAnswer = {
      userAnswers: selectedAnswers,
      isCorrect,
      timestamp: new Date().toISOString()
    };

    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.question_number]: userAnswer
    }));

    setIsAnswered(true);
    setShowFeedback(true);
  }, [selectedAnswers, questions, currentQuestionIndex, setUserAnswers, setIsAnswered, setShowFeedback]);

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
    setSelectedAnswers([]);
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
    setSelectedAnswers,
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
    setSelectedAnswers([]);
    setShowFeedback(false);
    setIsAnswered(false);
    setShowConfigModal(false);
  }, [
    examConfig,
    allQuestions,
    setQuestions,
    setCurrentQuestionIndex,
    setUserAnswers,
    setSelectedAnswers,
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
    setSelectedAnswers([]);
    setShowFeedback(false);
    setIsAnswered(false);
    setShowConfigModal(false);
  }, [
    allQuestions,
    setQuestions,
    setCurrentQuestionIndex,
    setUserAnswers,
    setSelectedAnswers,
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
      setSelectedAnswers([]);
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
    setSelectedAnswers,
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