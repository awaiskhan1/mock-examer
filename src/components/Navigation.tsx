import React from 'react';
import { ChevronLeft, ChevronRight, SkipForward, SkipBack } from 'lucide-react';
import { NavigationProps } from '@/types';
import { FormattingUtils } from '@/utils';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 0',
    borderTop: '1px solid #333',
    marginTop: '20px',
    flexWrap: 'wrap' as const,
    gap: '16px'
  },
  containerMobile: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '16px 0',
    borderTop: '1px solid #333',
    marginTop: '16px',
    gap: '12px',
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box' as const
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexShrink: 0
  },
  button: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    minWidth: '80px',
    justifyContent: 'center'
  },
  buttonMobile: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    minWidth: '60px',
    maxWidth: '80px',
    justifyContent: 'center',
    flex: '1'
  },
  buttonDisabled: {
    backgroundColor: '#555',
    cursor: 'not-allowed',
    opacity: 0.6
  },
  buttonHover: {
    backgroundColor: '#2980b9',
    transform: 'translateY(-1px)'
  },
  previousButton: {
    backgroundColor: '#95a5a6'
  },
  previousButtonHover: {
    backgroundColor: '#7f8c8d'
  },
  progressInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    flex: '1',
    minWidth: '200px',
    maxWidth: '300px'
  },
  progressInfoMobile: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '6px',
    width: '100%',
    maxWidth: '100%',
    minWidth: 'auto'
  },
  progressText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center' as const,
    whiteSpace: 'nowrap' as const
  },
  progressSubtext: {
    fontSize: '11px',
    color: '#bbb',
    textAlign: 'center' as const
  },
  progressBar: {
    width: '100%',
    maxWidth: '200px',
    height: '6px',
    backgroundColor: '#333',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3498db',
    transition: 'width 0.3s ease',
    borderRadius: '3px'
  },
  jumpButtons: {
    display: 'flex',
    gap: '8px'
  },
  jumpButton: {
    backgroundColor: 'transparent',
    color: '#3498db',
    border: '1px solid #3498db',
    padding: '6px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '32px',
    height: '32px'
  },
  jumpButtonHover: {
    backgroundColor: '#3498db',
    color: 'white'
  },
  jumpButtonDisabled: {
    color: '#555',
    borderColor: '#555',
    cursor: 'not-allowed'
  }
};

const Navigation: React.FC<NavigationProps> = ({
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext,
  canGoNext,
  canGoPrevious
}) => {
  const [hoveredButton, setHoveredButton] = React.useState<string | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const progressPercentage = totalQuestions > 0 
    ? Math.round(((currentIndex + 1) / totalQuestions) * 100) 
    : 0;

  const handleJumpToFirst = () => {
    if (currentIndex > 0) {
      // This would need to be passed as a prop or handled differently
      // For now, we'll simulate by calling onPrevious multiple times
      for (let i = currentIndex; i > 0; i--) {
        onPrevious();
      }
    }
  };

  const handleJumpToLast = () => {
    if (currentIndex < totalQuestions - 1) {
      // This would need to be passed as a prop or handled differently
      // For now, we'll simulate by calling onNext multiple times
      for (let i = currentIndex; i < totalQuestions - 1; i++) {
        onNext();
      }
    }
  };

  const getButtonStyle = (buttonType: string, baseStyle: any, hoverStyle: any, disabled = false) => {
    if (disabled) {
      return { ...baseStyle, ...styles.buttonDisabled };
    }
    
    return {
      ...baseStyle,
      ...(hoveredButton === buttonType ? hoverStyle : {})
    };
  };

  const containerStyle = isMobile ? styles.containerMobile : styles.container;

  const buttonGroupStyle = {
    ...styles.buttonGroup,
    ...(isMobile ? {
      justifyContent: 'center' as const,
      width: '100%'
    } : {})
  };

  const progressInfoStyle = isMobile ? styles.progressInfoMobile : styles.progressInfo;

  const buttonStyle = (baseStyle: any) => ({
    ...(isMobile ? styles.buttonMobile : baseStyle)
  });

  return (
    <div style={containerStyle}>
      {/* Progress information - shows first on mobile */}
      <div style={progressInfoStyle}>
        <div style={styles.progressText}>
          Question {FormattingUtils.formatQuestionNumber(currentIndex + 1, totalQuestions)} of {totalQuestions}
        </div>
        <div style={styles.progressBar}>
          <div 
            style={{
              ...styles.progressFill,
              width: `${progressPercentage}%`
            }}
          />
        </div>
        <div style={styles.progressSubtext}>
          {progressPercentage}% Complete
        </div>
      </div>

      {/* Navigation buttons container */}
      <div style={{
        display: 'flex',
        justifyContent: isMobile ? 'center' : 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '100%',
        gap: isMobile ? '12px' : '0',
        boxSizing: 'border-box' as const
      }}>
        {/* Left side - Previous button and jump to first */}
        <div style={buttonGroupStyle}>
          {!isMobile && (
            <div style={styles.jumpButtons}>
              <button
                style={getButtonStyle(
                  'jumpFirst',
                  styles.jumpButton,
                  styles.jumpButtonHover,
                  currentIndex === 0
                )}
                onClick={handleJumpToFirst}
                disabled={currentIndex === 0}
                onMouseEnter={() => setHoveredButton('jumpFirst')}
                onMouseLeave={() => setHoveredButton(null)}
                title="Jump to first question"
              >
                <SkipBack style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          )}
          
          <button
            style={getButtonStyle(
              'previous',
              buttonStyle({ ...styles.button, ...styles.previousButton }),
              styles.previousButtonHover,
              !canGoPrevious
            )}
            onClick={onPrevious}
            disabled={!canGoPrevious}
            onMouseEnter={() => setHoveredButton('previous')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <ChevronLeft style={{ width: '14px', height: '14px' }} />
            {!isMobile && 'Previous'}
          </button>
        </div>

        {/* Right side - Next button and jump to last */}
        <div style={buttonGroupStyle}>
          <button
            style={getButtonStyle(
              'next',
              buttonStyle(styles.button),
              styles.buttonHover,
              !canGoNext
            )}
            onClick={onNext}
            disabled={!canGoNext}
            onMouseEnter={() => setHoveredButton('next')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {!isMobile && 'Next'}
            <ChevronRight style={{ width: '14px', height: '14px' }} />
          </button>
          
          {!isMobile && (
            <div style={styles.jumpButtons}>
              <button
                style={getButtonStyle(
                  'jumpLast',
                  styles.jumpButton,
                  styles.jumpButtonHover,
                  currentIndex === totalQuestions - 1
                )}
                onClick={handleJumpToLast}
                disabled={currentIndex === totalQuestions - 1}
                onMouseEnter={() => setHoveredButton('jumpLast')}
                onMouseLeave={() => setHoveredButton(null)}
                title="Jump to last question"
              >
                <SkipForward style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;