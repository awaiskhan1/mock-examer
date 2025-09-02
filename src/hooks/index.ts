import { useExamState } from './useExamState';
import { useExamActions } from './useExamActions';

export { useExamState, useExamActions };

// Combined hook that provides both state and actions
export const useExam = () => {
  const examState = useExamState();
  const examActions = useExamActions({
    questions: examState.questions,
    allQuestions: examState.allQuestions,
    currentQuestionIndex: examState.currentQuestionIndex,
    userAnswers: examState.userAnswers,
    selectedAnswers: examState.selectedAnswers,
    examConfig: examState.examConfig,
    setQuestions: examState.setQuestions,
    setAllQuestions: examState.setAllQuestions,
    setCurrentQuestionIndex: examState.setCurrentQuestionIndex,
    setUserAnswers: examState.setUserAnswers,
    setSelectedAnswers: examState.setSelectedAnswers,
    setShowFeedback: examState.setShowFeedback,
    setIsAnswered: examState.setIsAnswered,
    setUploadedFileName: examState.setUploadedFileName,
    setExamConfig: examState.setExamConfig,
    setShowConfigModal: examState.setShowConfigModal
  });

  return {
    ...examState,
    ...examActions
  };
};