import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { QuestionCardProps } from '@/types';
import { FormattingUtils } from '@/utils';

const styles = {
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '24px',
    margin: '20px 0',
    border: '1px solid #333'
  },
  containerMobile: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '16px',
    margin: '12px 0',
    border: '1px solid #333'
  },
  questionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '12px'
  },
  questionHeaderMobile: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '16px',
    gap: '8px',
    flexDirection: 'column' as const
  },
  questionNumber: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  questionText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#fff',
    lineHeight: '1.6',
    flex: 1
  },
  questionTextMobile: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    lineHeight: '1.5',
    width: '100%'
  },
  optionsContainer: {
    marginBottom: '20px'
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    margin: '8px 0',
    borderRadius: '8px',
    border: '2px solid #333',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: '#2c2c2c'
  },
  optionMobile: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '10px 12px',
    margin: '6px 0',
    borderRadius: '8px',
    border: '2px solid #333',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: '#2c2c2c'
  },
  optionSelected: {
    borderColor: '#3498db',
    backgroundColor: '#1e3a5f'
  },
  optionCorrect: {
    borderColor: '#27ae60',
    backgroundColor: '#1e4d3a'
  },
  optionIncorrect: {
    borderColor: '#e74c3c',
    backgroundColor: '#4d1e1e'
  },
  optionLetter: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    marginRight: '12px',
    flexShrink: 0
  },
  optionLetterCorrect: {
    backgroundColor: '#27ae60'
  },
  optionLetterIncorrect: {
    backgroundColor: '#e74c3c'
  },
  optionText: {
    fontSize: '16px',
    color: '#fff',
    flex: 1,
    lineHeight: '1.4'
  },
  optionTextMobile: {
    fontSize: '14px',
    color: '#fff',
    flex: 1,
    lineHeight: '1.3'
  },
  optionIcon: {
    width: '20px',
    height: '20px',
    marginLeft: '12px'
  },
  submitButton: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  submitButtonMobile: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    width: '100%',
    justifyContent: 'center'
  },
  submitButtonDisabled: {
    backgroundColor: '#555',
    cursor: 'not-allowed',
    opacity: 0.6
  },
  submitButtonHover: {
    backgroundColor: '#229954',
    transform: 'translateY(-2px)'
  },
  feedbackContainer: {
    marginTop: '20px',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #333'
  },
  feedbackCorrect: {
    backgroundColor: '#1e4d3a',
    borderColor: '#27ae60'
  },
  feedbackIncorrect: {
    backgroundColor: '#4d1e1e',
    borderColor: '#e74c3c'
  },
  feedbackHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px'
  },
  feedbackIcon: {
    width: '20px',
    height: '20px'
  },
  feedbackTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff'
  },
  feedbackText: {
    fontSize: '14px',
    color: '#bbb',
    lineHeight: '1.5'
  },
  correctAnswers: {
    marginTop: '12px',
    fontSize: '14px',
    color: '#27ae60',
    fontWeight: '600'
  },
  explanation: {
    marginTop: '12px',
    fontSize: '14px',
    color: '#ecf0f1',
    lineHeight: '1.5',
    fontStyle: 'italic'
  }
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  showFeedback,
  isAnswered,
  onAnswerSelect,
  onSubmitAnswer
}) => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const [isHovered, setIsHovered] = React.useState(false);
  const formattedOptions = FormattingUtils.formatQuestionOptions(question.options);
  const correctAnswerLetters = question.correct_answers.map(ans => ans.charAt(0).toUpperCase());
  const isSelectedCorrect = correctAnswerLetters.includes(selectedAnswer.charAt(0).toUpperCase());

  const getOptionStyle = (optionLetter: string) => {
    let style = { ...styles.option };
    
    if (showFeedback) {
      if (correctAnswerLetters.includes(optionLetter)) {
        style = { ...style, ...styles.optionCorrect };
      } else if (selectedAnswer.charAt(0).toUpperCase() === optionLetter) {
        style = { ...style, ...styles.optionIncorrect };
      }
    } else if (selectedAnswer.charAt(0).toUpperCase() === optionLetter) {
      style = { ...style, ...styles.optionSelected };
    }
    
    return style;
  };

  const getOptionLetterStyle = (optionLetter: string) => {
    let style = { ...styles.optionLetter };
    
    if (showFeedback) {
      if (correctAnswerLetters.includes(optionLetter)) {
        style = { ...style, ...styles.optionLetterCorrect };
      } else if (selectedAnswer.charAt(0).toUpperCase() === optionLetter) {
        style = { ...style, ...styles.optionLetterIncorrect };
      }
    }
    
    return style;
  };

  const renderOptionIcon = (optionLetter: string) => {
    if (!showFeedback) return null;
    
    if (correctAnswerLetters.includes(optionLetter)) {
      return <CheckCircle style={{ ...styles.optionIcon, color: '#27ae60' }} />;
    } else if (selectedAnswer.charAt(0).toUpperCase() === optionLetter) {
      return <XCircle style={{ ...styles.optionIcon, color: '#e74c3c' }} />;
    }
    
    return null;
  };

  return (
    <div style={isMobile ? styles.containerMobile : styles.container}>
      <div style={isMobile ? styles.questionHeaderMobile : styles.questionHeader}>
        <div style={styles.questionNumber}>
          Q{question.question_number}
        </div>
        <div style={isMobile ? styles.questionTextMobile : styles.questionText}>
          {question.question}
        </div>
      </div>

      <div style={styles.optionsContainer}>
        {formattedOptions.map((option) => (
          <div
            key={option.letter}
            style={{
              ...(isMobile ? styles.optionMobile : styles.option),
              ...getOptionStyle(option.letter)
            }}
            onClick={() => !isAnswered && onAnswerSelect(option.letter)}
          >
            <div style={getOptionLetterStyle(option.letter)}>
              {option.letter}
            </div>
            <div style={isMobile ? styles.optionTextMobile : styles.optionText}>
              {option.text}
            </div>
            {renderOptionIcon(option.letter)}
          </div>
        ))}
      </div>

      {!isAnswered && (
        <button
          style={{
            ...(isMobile ? styles.submitButtonMobile : styles.submitButton),
            ...(selectedAnswer ? {} : styles.submitButtonDisabled),
            ...(isHovered && selectedAnswer ? styles.submitButtonHover : {})
          }}
          onClick={onSubmitAnswer}
          disabled={!selectedAnswer}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CheckCircle style={{ width: '20px', height: '20px' }} />
          Submit Answer
        </button>
      )}

      {showFeedback && (
        <div style={{
          ...styles.feedbackContainer,
          ...(isSelectedCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect)
        }}>
          <div style={styles.feedbackHeader}>
            {isSelectedCorrect ? (
              <CheckCircle style={{ ...styles.feedbackIcon, color: '#27ae60' }} />
            ) : (
              <XCircle style={{ ...styles.feedbackIcon, color: '#e74c3c' }} />
            )}
            <div style={styles.feedbackTitle}>
              {isSelectedCorrect ? 'Correct!' : 'Incorrect'}
            </div>
          </div>
          
          <div style={styles.feedbackText}>
            {isSelectedCorrect 
              ? 'Well done! You selected the correct answer.' 
              : 'That\'s not quite right. Review the correct answer below.'}
          </div>
          
          <div style={styles.correctAnswers}>
            Correct Answer(s): {FormattingUtils.formatAnswerLetters(question.correct_answers)}
          </div>
          
          {question.explanation && (
            <div style={styles.explanation}>
              {question.explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;