import React from 'react';
import { RotateCcw, Download, FileText, Target } from 'lucide-react';
import { ExamHeaderProps } from '@/types';
import { FormattingUtils } from '@/utils';

const styles = {
  container: {
    backgroundColor: '#1a1a1a',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #333',
    marginBottom: '20px'
  },
  containerMobile: {
    backgroundColor: '#1a1a1a',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #333',
    marginBottom: '16px',
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box' as const,
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap' as const,
    gap: '12px'
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  icon: {
    width: '24px',
    height: '24px',
    color: '#3498db'
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff'
  },
  titleMobile: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const
  },
  button: {
    backgroundColor: 'transparent',
    border: '1px solid #555',
    color: '#bbb',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  buttonMobile: {
    backgroundColor: 'transparent',
    border: '1px solid #555',
    color: '#bbb',
    padding: '6px 8px',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    minWidth: '70px',
    justifyContent: 'center'
  },
  resetButton: {
    borderColor: '#e74c3c',
    color: '#e74c3c'
  },
  resetButtonHover: {
    backgroundColor: '#e74c3c',
    color: 'white'
  },
  pdfButton: {
    borderColor: '#3498db',
    color: '#3498db'
  },
  pdfButtonHover: {
    backgroundColor: '#3498db',
    color: 'white'
  },
  infoSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '16px'
  },
  infoSectionMobile: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    gap: '12px'
  },
  infoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: '#bbb'
  },
  infoIcon: {
    width: '16px',
    height: '16px',
    color: '#3498db'
  },
  fileName: {
    fontSize: '14px',
    color: '#ecf0f1',
    fontWeight: '500',
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const
  },
  statsGroup: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  statsGroupMobile: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    justifyContent: 'flex-start'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px'
  },
  statValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff'
  },
  statValueMobile: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#fff'
  },
  statLabel: {
    fontSize: '11px',
    color: '#888',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  statLabelMobile: {
    fontSize: '9px',
    color: '#888',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  divider: {
    width: '1px',
    height: '30px',
    backgroundColor: '#333'
  }
};

const ExamHeader: React.FC<ExamHeaderProps> = ({
  uploadedFileName,
  currentQuestionIndex,
  totalQuestions,
  answeredCount,
  onResetSession,
  onGeneratePDF
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
  
  const progressPercentage = FormattingUtils.formatProgress(answeredCount, totalQuestions);
  const currentQuestionNumber = FormattingUtils.formatQuestionNumber(currentQuestionIndex + 1, totalQuestions);
  
  const getButtonStyle = (buttonType: string, baseStyle: any, hoverStyle: any) => {
    const buttonBaseStyle = isMobile ? styles.buttonMobile : styles.button;
    return {
      ...buttonBaseStyle,
      ...baseStyle,
      ...(hoveredButton === buttonType ? hoverStyle : {})
    };
  };

  return (
    <div style={isMobile ? styles.containerMobile : styles.container}>
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <Target style={styles.icon} />
          <h1 style={isMobile ? styles.titleMobile : styles.title}>Exam Preparation Tool</h1>
        </div>
        
        <div style={styles.actionButtons}>
          <button
            style={getButtonStyle('reset', styles.resetButton, styles.resetButtonHover)}
            onClick={onResetSession}
            onMouseEnter={() => setHoveredButton('reset')}
            onMouseLeave={() => setHoveredButton(null)}
            title="Reset exam session"
          >
            <RotateCcw style={{ width: '14px', height: '14px' }} />
            Reset
          </button>
          
          <button
            style={getButtonStyle('pdf', styles.pdfButton, styles.pdfButtonHover)}
            onClick={onGeneratePDF}
            onMouseEnter={() => setHoveredButton('pdf')}
            onMouseLeave={() => setHoveredButton(null)}
            title="Generate PDF report"
          >
            <Download style={{ width: '14px', height: '14px' }} />
            Export PDF
          </button>
        </div>
      </div>
      
      <div style={isMobile ? styles.infoSectionMobile : styles.infoSection}>
        <div style={styles.infoGroup}>
          <div style={styles.infoItem}>
            <FileText style={styles.infoIcon} />
            <span style={styles.fileName} title={uploadedFileName}>
              {FormattingUtils.truncateText(uploadedFileName, 30)}
            </span>
          </div>
        </div>
        
        <div style={isMobile ? styles.statsGroupMobile : styles.statsGroup}>
          <div style={styles.statItem}>
            <div style={isMobile ? styles.statValueMobile : styles.statValue}>
              Q{currentQuestionNumber}
            </div>
            <div style={isMobile ? styles.statLabelMobile : styles.statLabel}>
              Current
            </div>
          </div>
          
          {!isMobile && <div style={styles.divider} />}
          
          <div style={styles.statItem}>
            <div style={isMobile ? styles.statValueMobile : styles.statValue}>
              {answeredCount}
            </div>
            <div style={isMobile ? styles.statLabelMobile : styles.statLabel}>
              Answered
            </div>
          </div>
          
          {!isMobile && <div style={styles.divider} />}
          
          <div style={styles.statItem}>
            <div style={isMobile ? styles.statValueMobile : styles.statValue}>
              {totalQuestions}
            </div>
            <div style={isMobile ? styles.statLabelMobile : styles.statLabel}>
              Total
            </div>
          </div>
          
          {!isMobile && <div style={styles.divider} />}
          
          <div style={styles.statItem}>
            <div style={isMobile ? styles.statValueMobile : styles.statValue}>
              {progressPercentage}
            </div>
            <div style={isMobile ? styles.statLabelMobile : styles.statLabel}>
              Complete
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamHeader;