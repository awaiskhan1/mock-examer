import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExamHeader, QuestionCard, Navigation, ExamResults } from '@/components';
import { useExam } from '@/hooks';
import { ExamService } from '@/services/examService';

const ExamPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    questions,
    allQuestions,
    currentQuestionIndex,
    userAnswers,
    selectedAnswer,
    showFeedback,
    isAnswered,
    uploadedFileName,
    handleAnswerSelect,
    handleSubmitAnswer,
    handleNextQuestion,
    handlePreviousQuestion,
    resetSession,
    generatePDF
  } = useExam();

  // If no questions are loaded after initial load, redirect to upload page
  // Add a small delay to allow localStorage to load first
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (questions.length === 0 && allQuestions.length === 0) {
        navigate('/');
      }
    }, 100); // Small delay to allow state restoration

    return () => clearTimeout(timer);
  }, [questions.length, allQuestions.length, navigate]);

  // Override resetSession to navigate back to upload page
  const handleResetSession = () => {
    resetSession();
    navigate('/');
  };

  // Calculate exam completion and results
  const answeredCount = Object.keys(userAnswers).length;
  const isExamComplete = answeredCount === questions.length && questions.length > 0;
  const currentQuestion = questions[currentQuestionIndex] || null;
  
  // Navigation state
  const canGoNext = currentQuestionIndex < questions.length - 1;
  const canGoPrevious = currentQuestionIndex > 0;

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)',
      padding: '20px'
    },
    content: {
      maxWidth: '1000px',
      margin: '0 auto'
    }
  };

  // Show loading if no questions
  if (questions.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={{ textAlign: 'center', color: 'white', marginTop: '50px' }}>
            <p>Loading exam...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show exam results if completed
  if (isExamComplete) {
    const { total, correct, percentage } = ExamService.calculateScore(userAnswers);
    const incorrect = total - correct;
    
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <ExamHeader
            uploadedFileName={uploadedFileName}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            answeredCount={answeredCount}
            onResetSession={handleResetSession}
            onGeneratePDF={generatePDF}
          />
          
          <ExamResults
            totalQuestions={total}
            correctAnswers={correct}
            incorrectAnswers={incorrect}
            score={percentage}
            onRestart={handleResetSession}
            onGeneratePDF={generatePDF}
          />
        </div>
      </div>
    );
  }

  // Show exam interface
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <ExamHeader
          uploadedFileName={uploadedFileName}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          answeredCount={answeredCount}
          onResetSession={handleResetSession}
          onGeneratePDF={generatePDF}
        />
        
        <div style={{ marginTop: '20px' }}>
          {/* Question Card */}
          {currentQuestion && (
            <QuestionCard
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              showFeedback={showFeedback}
              isAnswered={isAnswered}
              onAnswerSelect={handleAnswerSelect}
              onSubmitAnswer={handleSubmitAnswer}
            />
          )}
          
          {/* Navigation */}
          <Navigation
            currentIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            onPrevious={handlePreviousQuestion}
            onNext={handleNextQuestion}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
          />
        </div>
      </div>
    </div>
  );
};

export default ExamPage;