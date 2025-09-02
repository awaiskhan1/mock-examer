import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#111827'
  },
  header: {
    backgroundColor: '#1f2937',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
    borderBottom: '1px solid #374151'
  },
  headerContent: {
    maxWidth: '1024px',
    margin: '0 auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  headerTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#f9fafb',
    margin: 0
  },
  headerSubtitle: {
    fontSize: '0.875rem',
    color: '#d1d5db',
    margin: 0
  },
  buttonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  progressSection: {
    backgroundColor: '#1f2937',
    borderBottom: '1px solid #374151'
  },
  progressContent: {
    maxWidth: '1024px',
    margin: '0 auto',
    padding: '0.75rem 1rem'
  },
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.875rem',
    color: '#d1d5db',
    marginBottom: '0.5rem'
  },
  mainContent: {
    maxWidth: '1024px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  questionCard: {
    backgroundColor: '#1f2937',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    padding: '1.5rem',
    marginBottom: '1.5rem'
  },
  questionHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    marginBottom: '1rem'
  },
  badge: {
    backgroundColor: '#1e3a8a',
    color: '#93c5fd',
    fontSize: '0.875rem',
    fontWeight: '500',
    padding: '0.125rem 0.625rem',
    borderRadius: '0.25rem'
  },
  topicBadge: {
    backgroundColor: '#374151',
    color: '#d1d5db',
    fontSize: '0.875rem',
    fontWeight: '500',
    padding: '0.125rem 0.625rem',
    borderRadius: '0.25rem'
  },
  questionText: {
    fontSize: '1.125rem',
    fontWeight: '500',
    color: '#f9fafb',
    lineHeight: '1.6',
    margin: 0
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.5rem'
  },
  optionButton: {
    width: '100%',
    textAlign: 'left',
    padding: '1rem',
    borderRadius: '0.5rem',
    border: '2px solid #4b5563',
    backgroundColor: '#374151',
    color: '#f9fafb',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem'
  },
  optionSelected: {
    borderColor: '#60a5fa',
    backgroundColor: '#2563eb',
    boxShadow: '0 0 0 2px #60a5fa, 0 0 8px rgba(96, 165, 250, 0.3)'
  },
  optionCorrect: {
    borderColor: '#10b981',
    backgroundColor: '#064e3b',
    color: '#6ee7b7',
    boxShadow: '0 0 0 1px #10b981'
  },
  optionIncorrect: {
    borderColor: '#ef4444',
    backgroundColor: '#7f1d1d',
    color: '#fca5a5',
    boxShadow: '0 0 0 1px #ef4444'
  },
  optionLetter: {
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '50%',
    border: '2px solid #6b7280',
    backgroundColor: '#4b5563',
    color: '#f9fafb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: '500',
    flexShrink: 0
  },
  optionLetterSelected: {
    borderColor: '#60a5fa',
    backgroundColor: '#60a5fa',
    color: '#1e3a8a',
    fontWeight: 'bold'
  },
  optionLetterCorrect: {
    borderColor: '#10b981',
    backgroundColor: '#10b981',
    color: 'white'
  },
  optionLetterIncorrect: {
    borderColor: '#ef4444',
    backgroundColor: '#ef4444',
    color: 'white'
  },
  feedbackSection: {
    marginTop: '1.5rem',
    padding: '1rem',
    borderRadius: '0.5rem',
    backgroundColor: '#374151'
  },
  feedbackHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.75rem'
  },
  feedbackText: {
    fontSize: '0.875rem',
    color: '#d1d5db',
    marginBottom: '0.5rem'
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  uploadContainer: {
    minHeight: '100vh',
    backgroundColor: '#111827',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
  },
  uploadCard: {
    maxWidth: '28rem',
    width: '100%',
    backgroundColor: '#1f2937',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    padding: '2rem',
    textAlign: 'center'
  },
  uploadIcon: {
    margin: '0 auto 1rem',
    height: '4rem',
    width: '4rem',
    color: '#3b82f6'
  },
  uploadTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: '0.5rem'
  },
  uploadDescription: {
    color: '#d1d5db',
    marginBottom: '1.5rem'
  },
  fileInput: {
    display: 'block',
    width: '100%',
    fontSize: '0.875rem',
    color: '#d1d5db',
    cursor: 'pointer'
  },
  // Modal styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#1f2937',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
    padding: '2rem',
    maxWidth: '32rem',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#d1d5db',
    marginBottom: '0.5rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #4b5563',
    backgroundColor: '#374151',
    color: '#f9fafb',
    fontSize: '0.875rem'
  },
  checkbox: {
    marginRight: '0.5rem',
    accentColor: '#3b82f6'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',
    color: '#d1d5db',
    cursor: 'pointer'
  },
  modalButtons: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    marginTop: '2rem'
  },
  configButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }
};

function App() {
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]); // Store all uploaded questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  
  // Configuration modal state
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [examConfig, setExamConfig] = useState({
    startQuestion: '',
    endQuestion: '',
    randomize: false,
    randomCount: ''
  });

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedQuestions = localStorage.getItem('examQuestions');
    const savedAnswers = localStorage.getItem('userAnswers');
    const savedIndex = localStorage.getItem('currentQuestionIndex');
    const savedFileName = localStorage.getItem('uploadedFileName');

    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
    if (savedAnswers) {
      setUserAnswers(JSON.parse(savedAnswers));
    }
    if (savedIndex) {
      setCurrentQuestionIndex(parseInt(savedIndex));
    }
    if (savedFileName) {
      setUploadedFileName(savedFileName);
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem('examQuestions', JSON.stringify(questions));
    }
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
  }, [userAnswers]);

  useEffect(() => {
    localStorage.setItem('currentQuestionIndex', currentQuestionIndex.toString());
  }, [currentQuestionIndex]);

  useEffect(() => {
    localStorage.setItem('uploadedFileName', uploadedFileName);
  }, [uploadedFileName]);

  // Check if current question is already answered
  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && userAnswers[currentQuestion.question_number]) {
      setSelectedAnswer(userAnswers[currentQuestion.question_number].userAnswer);
      setShowFeedback(true);
      setIsAnswered(true);
    } else {
      setSelectedAnswer('');
      setShowFeedback(false);
      setIsAnswered(false);
    }
  }, [currentQuestionIndex, questions, userAnswers]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          if (Array.isArray(jsonData) && jsonData.length > 0) {
            setAllQuestions(jsonData);
            setUploadedFileName(file.name);
            setShowConfigModal(true); // Show configuration modal
          } else {
            alert('Invalid JSON format. Please upload a valid questions array.');
          }
        } catch (error) {
          alert('Error parsing JSON file. Please check the file format.');
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid JSON file.');
    }
  };

  // Configuration functions
  const handleConfigChange = (field, value) => {
    setExamConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyConfiguration = () => {
    let filteredQuestions = [...allQuestions];
    
    // Apply question range filtering
    if (examConfig.startQuestion && examConfig.endQuestion) {
      const start = parseInt(examConfig.startQuestion) - 1;
      const end = parseInt(examConfig.endQuestion);
      if (start >= 0 && end <= allQuestions.length && start < end) {
        filteredQuestions = allQuestions.slice(start, end);
      }
    }
    
    // Apply randomization
    if (examConfig.randomize) {
      // Shuffle the questions
      for (let i = filteredQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredQuestions[i], filteredQuestions[j]] = [filteredQuestions[j], filteredQuestions[i]];
      }
      
      // Limit to random count if specified
      if (examConfig.randomCount && parseInt(examConfig.randomCount) > 0) {
        const count = Math.min(parseInt(examConfig.randomCount), filteredQuestions.length);
        filteredQuestions = filteredQuestions.slice(0, count);
      }
    }
    
    // Set the filtered questions and reset exam state
    setQuestions(filteredQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setSelectedAnswer('');
    setShowFeedback(false);
    setIsAnswered(false);
    setShowConfigModal(false);
  };

  const skipConfiguration = () => {
    // Use all questions without any filtering
    setQuestions(allQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setSelectedAnswer('');
    setShowFeedback(false);
    setIsAnswered(false);
    setShowConfigModal(false);
  };

  const handleAnswerSelect = (answer) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || isAnswered) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.correct_answers.includes(selectedAnswer.charAt(0));
    
    const answerData = {
      userAnswer: selectedAnswer,
      isCorrect,
      timestamp: new Date().toISOString()
    };

    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.question_number]: answerData
    }));

    setShowFeedback(true);
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const resetSession = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowFeedback(false);
    setIsAnswered(false);
    localStorage.removeItem('userAnswers');
    localStorage.setItem('currentQuestionIndex', '0');
  };

  const generatePDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Set dark theme colors
    pdf.setFillColor(33, 37, 41); // Dark background
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Title
    pdf.setTextColor(255, 255, 255); // White text
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    const title = 'Exam Results Report';
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, (pageWidth - titleWidth) / 2, yPosition);
    yPosition += 15;

    // Summary
    const answeredQuestions = Object.keys(userAnswers).length;
    const correctAnswers = Object.values(userAnswers).filter(answer => answer.isCorrect).length;
    const incorrectAnswers = answeredQuestions - correctAnswers;
    const percentage = answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Summary:', margin, yPosition);
    yPosition += 8;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    const summaryLines = [
      `Total Questions Answered: ${answeredQuestions}`,
      `Correct Answers: ${correctAnswers}`,
      `Incorrect Answers: ${incorrectAnswers}`,
      `Score: ${percentage}%`
    ];

    summaryLines.forEach(line => {
      pdf.text(line, margin, yPosition);
      yPosition += 6;
    });

    yPosition += 8;

    // Questions and answers
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Detailed Results:', margin, yPosition);
    yPosition += 12;

    Object.entries(userAnswers).forEach(([questionNumber, answerData]) => {
      const question = questions.find(q => q.question_number.toString() === questionNumber);
      if (!question) return;

      // Check if we need a new page
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        pdf.setFillColor(33, 37, 41);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        yPosition = margin;
      }

      // Question number and text
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      const questionTitle = `Question ${questionNumber}:`;
      pdf.text(questionTitle, margin, yPosition);
      yPosition += 6;

      // Question text with word wrap
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      const questionLines = pdf.splitTextToSize(question.question, maxWidth);
      questionLines.forEach(line => {
        pdf.text(line, margin, yPosition);
        yPosition += 5;
      });
      yPosition += 3;

      // Options
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      question.options.forEach(option => {
        const optionLines = pdf.splitTextToSize(option, maxWidth - 10);
        optionLines.forEach((line, index) => {
          pdf.text(index === 0 ? line : `  ${line}`, margin + 5, yPosition);
          yPosition += 4;
        });
      });
      yPosition += 3;

      // User answer and result with proper text wrapping
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      
      // Split user answer and status for better formatting
      const userAnswerLabel = 'Your Answer:';
      const userAnswerValue = answerData.userAnswer;
      const statusText = answerData.isCorrect ? '✓ CORRECT' : '✗ INCORRECT';
      
      // Display "Your Answer:" label
      pdf.setTextColor(255, 255, 255);
      pdf.text(userAnswerLabel, margin, yPosition);
      yPosition += 5;
      
      // Display the actual answer with text wrapping
      pdf.setFont('helvetica', 'normal');
      const userAnswerLines = pdf.splitTextToSize(userAnswerValue, maxWidth - 10);
      userAnswerLines.forEach(line => {
        pdf.text(line, margin + 5, yPosition);
        yPosition += 4;
      });
      
      // Display status on a separate line
      pdf.setFont('helvetica', 'bold');
      if (answerData.isCorrect) {
        pdf.setTextColor(34, 197, 94); // Green for correct
      } else {
        pdf.setTextColor(239, 68, 68); // Red for incorrect
      }
      pdf.text(statusText, margin, yPosition);
      yPosition += 6;

      // Correct answer with proper text wrapping
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'normal');
      const correctAnswerText = `Correct Answer: ${question.correct_answer_display}`;
      const correctAnswerLines = pdf.splitTextToSize(correctAnswerText, maxWidth);
      correctAnswerLines.forEach(line => {
        pdf.text(line, margin, yPosition);
        yPosition += 5;
      });

      // Explanation if available
      if (question.explanation && question.explanation.trim()) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.text('Explanation:', margin, yPosition);
        yPosition += 4;
        pdf.setFont('helvetica', 'normal');
        const explanationLines = pdf.splitTextToSize(question.explanation, maxWidth);
        explanationLines.forEach(line => {
          pdf.text(line, margin, yPosition);
          yPosition += 4;
        });
        yPosition += 2;
      }

      // Community votes if available with proper text wrapping
      if (question.community_votes && question.community_votes.length > 0) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        const communityVotesText = `Community Votes: ${question.community_votes.join(', ')}`;
        const communityVotesLines = pdf.splitTextToSize(communityVotesText, maxWidth);
        communityVotesLines.forEach(line => {
          pdf.text(line, margin, yPosition);
          yPosition += 4;
        });
        yPosition += 2;
      }

      yPosition += 8; // Space between questions
    });

    // Save the PDF
    const fileName = `exam-results-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  };

  if (questions.length === 0) {
    return (
      <div style={styles.uploadContainer}>
        <div style={styles.uploadCard}>
          <div style={{ marginBottom: '1.5rem' }}>
            <svg style={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <h1 style={styles.uploadTitle}>Exam Preparation Tool</h1>
            <p style={styles.uploadDescription}>Upload a JSON file containing your exam questions to get started.</p>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Choose JSON File
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              style={styles.fileInput}
            />
          </div>
          
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            <p>Expected format: Array of question objects with options, correct answers, and explanations.</p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = Object.values(userAnswers).filter(answer => answer.isCorrect).length;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h1 style={styles.headerTitle}>Exam Preparation</h1>
            <p style={styles.headerSubtitle}>{uploadedFileName}</p>
          </div>
          <div style={styles.buttonGroup}>
            <button
              onClick={() => {
                setQuestions([]);
                setUserAnswers({});
                setCurrentQuestionIndex(0);
                setUploadedFileName('');
                setShowConfigModal(false);
              }}
              className="btn-secondary"
            >
              Back to Upload
            </button>
            <button
              onClick={generatePDF}
              disabled={answeredCount === 0}
              className="btn-primary"
            >
              Generate PDF Report
            </button>
            <button
              onClick={resetSession}
              className="btn-secondary"
            >
              Reset Session
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressSection}>
        <div style={styles.progressContent}>
          <div style={styles.progressInfo}>
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>Answered: {answeredCount} | Correct: {correctCount}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.questionCard}>
          {/* Question */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={styles.questionHeader}>
              <span style={styles.badge}>
                Q{currentQuestion.question_number}
              </span>
              {currentQuestion.topic && (
                <span style={styles.topicBadge}>
                  Topic {currentQuestion.topic}
                </span>
              )}
            </div>
            <h2 style={styles.questionText}>
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options */}
          <div style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = showFeedback && currentQuestion.correct_answers.includes(option.charAt(0));
              const isUserWrong = showFeedback && isSelected && !isCorrect;
              
              let buttonStyle = { ...styles.optionButton };
              let letterStyle = { ...styles.optionLetter };
              
              if (isSelected && !showFeedback) {
                buttonStyle = { ...buttonStyle, ...styles.optionSelected };
                letterStyle = { ...letterStyle, ...styles.optionLetterSelected };
              } else if (isCorrect && showFeedback) {
                buttonStyle = { ...buttonStyle, ...styles.optionCorrect };
                letterStyle = { ...letterStyle, ...styles.optionLetterCorrect };
              } else if (isUserWrong) {
                buttonStyle = { ...buttonStyle, ...styles.optionIncorrect };
                letterStyle = { ...letterStyle, ...styles.optionLetterIncorrect };
              }
              
              if (isAnswered) {
                buttonStyle.cursor = 'not-allowed';
              }
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isAnswered}
                  style={buttonStyle}
                >
                  <span style={letterStyle}>
                    {option.charAt(0)}
                  </span>
                  <span style={{ flex: 1 }}>{option.substring(3)}</span>
                  {showFeedback && isCorrect && (
                    <span style={{ color: '#10b981' }}>✓</span>
                  )}
                  {showFeedback && isUserWrong && (
                    <span style={{ color: '#ef4444' }}>✗</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          {!isAnswered && (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              Submit Answer
            </button>
          )}

          {/* Feedback */}
          {showFeedback && (
            <div style={styles.feedbackSection}>
              <div style={styles.feedbackHeader}>
                {userAnswers[currentQuestion.question_number]?.isCorrect ? (
                  <>
                    <span style={{ fontSize: '1.25rem' }}>✅</span>
                    <span style={{ fontWeight: '500', color: '#065f46' }}>Correct!</span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '1.25rem' }}>❌</span>
                    <span style={{ fontWeight: '500', color: '#991b1b' }}>Incorrect.</span>
                  </>
                )}
              </div>
              
              <p style={styles.feedbackText}>
                <strong>Correct Answer:</strong> {currentQuestion.correct_answer_display}
              </p>
              
              {currentQuestion.explanation && currentQuestion.explanation.trim() && (
                <p style={styles.feedbackText}>
                  <strong>Explanation:</strong> {currentQuestion.explanation}
                </p>
              )}
              
              {currentQuestion.community_votes && currentQuestion.community_votes.length > 0 && (
                <p style={styles.feedbackText}>
                  <strong>Community Votes:</strong> {currentQuestion.community_votes.join(', ')}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={styles.navigation}>
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="btn-secondary"
          >
            ← Previous
          </button>
          
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            {currentQuestionIndex + 1} / {questions.length}
          </span>
          
          <button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
            className="btn-secondary"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Configuration Modal */}
      {showConfigModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Exam Configuration</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Question Range</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="Start"
                  min="1"
                  max={allQuestions.length}
                  value={examConfig.startQuestion}
                  onChange={(e) => handleConfigChange('startQuestion', e.target.value)}
                  style={styles.input}
                />
                <span style={{ color: '#d1d5db' }}>to</span>
                <input
                  type="number"
                  placeholder="End"
                  min="1"
                  max={allQuestions.length}
                  value={examConfig.endQuestion}
                  onChange={(e) => handleConfigChange('endQuestion', e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                Total available questions: {allQuestions.length}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={examConfig.randomize}
                  onChange={(e) => handleConfigChange('randomize', e.target.checked)}
                  style={styles.checkbox}
                />
                Randomize Questions
              </label>
            </div>

            {examConfig.randomize && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Number of Random Questions</label>
                <input
                  type="number"
                  placeholder="Enter number"
                  min="1"
                  max={allQuestions.length}
                  value={examConfig.randomCount}
                  onChange={(e) => handleConfigChange('randomCount', e.target.value)}
                  style={styles.input}
                />
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  Leave empty to use all questions in range
                </div>
              </div>
            )}

            <div style={styles.modalButtons}>
              <button
                onClick={skipConfiguration}
                style={{
                  ...styles.configButton,
                  backgroundColor: '#6b7280'
                }}
              >
                Use All Questions
              </button>
              <button
                onClick={applyConfiguration}
                style={styles.configButton}
              >
                Apply Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
