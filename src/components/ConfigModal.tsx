import React from 'react';
import { X, Settings, Shuffle, Hash, Play, SkipForward } from 'lucide-react';
import { ConfigModalProps } from '@/types';
import { FormattingUtils } from '@/utils';

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999
  },
  modal: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '24px',
    width: '90%',
    maxWidth: '500px',
    border: '1px solid #333',
    position: 'relative' as const
  },
  modalMobile: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '16px',
    width: '95%',
    maxWidth: '400px',
    border: '1px solid #333',
    position: 'relative' as const,
    maxHeight: '90vh',
    overflowY: 'auto' as const
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px'
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  titleMobile: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#bbb',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'color 0.3s ease'
  },
  closeButtonHover: {
    color: '#fff'
  },
  section: {
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  inputGroup: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '12px'
  },
  inputGroupMobile: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  label: {
    fontSize: '14px',
    color: '#bbb',
    minWidth: '80px'
  },
  input: {
    backgroundColor: '#2c2c2c',
    border: '1px solid #444',
    borderRadius: '6px',
    padding: '8px 12px',
    color: '#fff',
    fontSize: '14px',
    width: '80px'
  },
  inputFocused: {
    borderColor: '#3498db',
    outline: 'none'
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#3498db'
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#fff',
    cursor: 'pointer'
  },
  randomCountGroup: {
    marginLeft: '26px',
    marginTop: '8px'
  },
  infoText: {
    fontSize: '12px',
    color: '#888',
    fontStyle: 'italic',
    marginTop: '4px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px'
  },
  buttonGroupMobile: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    marginTop: '20px'
  },
  button: {
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    border: 'none'
  },
  skipButton: {
    backgroundColor: 'transparent',
    color: '#bbb',
    border: '1px solid #555'
  },
  skipButtonHover: {
    backgroundColor: '#333',
    color: '#fff'
  },
  applyButton: {
    backgroundColor: '#27ae60',
    color: 'white'
  },
  applyButtonHover: {
    backgroundColor: '#229954',
    transform: 'translateY(-1px)'
  },
  summary: {
    backgroundColor: '#2c3e50',
    padding: '16px',
    borderRadius: '8px',
    marginTop: '16px'
  },
  summaryTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '8px'
  },
  summaryText: {
    fontSize: '12px',
    color: '#bdc3c7',
    lineHeight: '1.4'
  }
};

const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  examConfig,
  totalQuestions,
  onConfigChange,
  onApplyConfiguration,
  onSkipConfiguration,
  onClose
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
  const [hoveredButton, setHoveredButton] = React.useState<string | null>(null);
  const [isCloseHovered, setIsCloseHovered] = React.useState(false);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getConfigSummary = () => {
    const parts: string[] = [];
    
    if (examConfig.startRange && examConfig.endRange) {
      const start = parseInt(examConfig.startRange);
      const end = parseInt(examConfig.endRange);
      const rangeCount = end - start + 1;
      parts.push(`Questions ${start}-${end} (${rangeCount} questions)`);
    }
    
    if (examConfig.randomize && examConfig.randomCount) {
      const count = parseInt(examConfig.randomCount);
      parts.push(`${count} random questions`);
    }
    
    if (parts.length === 0) {
      return `All ${totalQuestions} questions will be included`;
    }
    
    return parts.join(', ');
  };

  const isConfigValid = () => {
    if (examConfig.startRange && examConfig.endRange) {
      const start = parseInt(examConfig.startRange);
      const end = parseInt(examConfig.endRange);
      if (isNaN(start) || isNaN(end) || start < 1 || end > totalQuestions || start >= end) {
        return false;
      }
    }
    
    if (examConfig.randomize && examConfig.randomCount) {
      const count = parseInt(examConfig.randomCount);
      if (isNaN(count) || count <= 0 || count > totalQuestions) {
        return false;
      }
    }
    
    return true;
  };

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={isMobile ? styles.modalMobile : styles.modal}>
        <div style={styles.header}>
          <h2 style={isMobile ? styles.titleMobile : styles.title}>
            <Settings style={{ width: '20px', height: '20px' }} />
            Exam Configuration
          </h2>
          <button
            style={{
              ...styles.closeButton,
              ...(isCloseHovered ? styles.closeButtonHover : {})
            }}
            onClick={onClose}
            onMouseEnter={() => setIsCloseHovered(true)}
            onMouseLeave={() => setIsCloseHovered(false)}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Question Range Section */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <Hash style={{ width: '16px', height: '16px' }} />
            Question Range
          </div>
          
          <div style={isMobile ? styles.inputGroupMobile : styles.inputGroup}>
            <span style={styles.label}>From:</span>
            <input
              type="number"
              min="1"
              max={totalQuestions}
              value={examConfig.startRange}
              onChange={(e) => onConfigChange('startRange', e.target.value)}
              style={styles.input}
              placeholder="1"
            />
            <span style={styles.label}>To:</span>
            <input
              type="number"
              min="1"
              max={totalQuestions}
              value={examConfig.endRange}
              onChange={(e) => onConfigChange('endRange', e.target.value)}
              style={styles.input}
              placeholder={totalQuestions.toString()}
            />
          </div>
          
          <div style={styles.infoText}>
            Leave empty to include all questions (1-{totalQuestions})
          </div>
        </div>

        {/* Randomization Section */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <Shuffle style={{ width: '16px', height: '16px' }} />
            Randomization
          </div>
          
          <div style={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="randomize"
              checked={examConfig.randomize}
              onChange={(e) => onConfigChange('randomize', e.target.checked)}
              style={styles.checkbox}
            />
            <label htmlFor="randomize" style={styles.checkboxLabel}>
              Randomize question order
            </label>
          </div>
          
          {examConfig.randomize && (
            <div style={styles.randomCountGroup}>
              <div style={isMobile ? styles.inputGroupMobile : styles.inputGroup}>
                <span style={styles.label}>Count:</span>
                <input
                  type="number"
                  min="1"
                  max={totalQuestions}
                  value={examConfig.randomCount}
                  onChange={(e) => onConfigChange('randomCount', e.target.value)}
                  style={styles.input}
                  placeholder={totalQuestions.toString()}
                />
              </div>
              <div style={styles.infoText}>
                Number of random questions to select
              </div>
            </div>
          )}
        </div>

        {/* Configuration Summary */}
        <div style={styles.summary}>
          <div style={styles.summaryTitle}>Configuration Summary:</div>
          <div style={styles.summaryText}>
            {getConfigSummary()}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={isMobile ? styles.buttonGroupMobile : styles.buttonGroup}>
          <button
            style={{
              ...styles.button,
              ...styles.skipButton,
              ...(hoveredButton === 'skip' ? styles.skipButtonHover : {})
            }}
            onClick={onSkipConfiguration}
            onMouseEnter={() => setHoveredButton('skip')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <SkipForward style={{ width: '16px', height: '16px' }} />
            Skip Configuration
          </button>
          
          <button
            style={{
              ...styles.button,
              ...styles.applyButton,
              ...(hoveredButton === 'apply' ? styles.applyButtonHover : {}),
              ...(isConfigValid() ? {} : { opacity: 0.6, cursor: 'not-allowed' })
            }}
            onClick={onApplyConfiguration}
            disabled={!isConfigValid()}
            onMouseEnter={() => setHoveredButton('apply')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <Play style={{ width: '16px', height: '16px' }} />
            Start Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;