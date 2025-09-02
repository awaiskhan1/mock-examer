import React from 'react';
import { ProgressBarProps } from '@/types';
import { FormattingUtils } from '@/utils';

const styles = {
  container: {
    backgroundColor: '#1a1a1a',
    padding: '16px 20px',
    borderRadius: '8px',
    border: '1px solid #333',
    marginBottom: '20px'
  },
  containerMobile: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '16px',
    margin: '12px 0',
    border: '1px solid #333'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  headerMobile: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    marginBottom: '12px',
    gap: '8px'
  },
  title: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff'
  },
  titleMobile: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff'
  },
  stats: {
    fontSize: '12px',
    color: '#bbb'
  },
  statsMobile: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap' as const
  },
  progressBarContainer: {
    position: 'relative' as const,
    backgroundColor: '#333',
    borderRadius: '10px',
    height: '20px',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 0.5s ease-in-out',
    position: 'relative' as const,
    background: 'linear-gradient(90deg, #3498db 0%, #2ecc71 100%)'
  },
  progressBarMobile: {
    height: '100%',
    borderRadius: '8px',
    transition: 'width 0.5s ease-in-out',
    position: 'relative' as const,
    background: 'linear-gradient(90deg, #3498db 0%, #2ecc71 100%)'
  },
  progressText: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
    zIndex: 1
  },
  detailsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '8px',
    fontSize: '11px',
    color: '#888'
  },
  detailsContainerMobile: {
    display: 'flex',
    flexDirection: 'column' as const,
    marginTop: '10px',
    fontSize: '12px',
    color: '#888',
    gap: '4px'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  indicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  currentIndicator: {
    backgroundColor: '#3498db'
  },
  answeredIndicator: {
    backgroundColor: '#27ae60'
  },
  remainingIndicator: {
    backgroundColor: '#95a5a6'
  }
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  answered
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
  const progressPercentage = total > 0 ? Math.round((answered / total) * 100) : 0;
  const currentPercentage = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;
  const remaining = total - answered;
  
  // Calculate the width for the progress bar
  const progressWidth = `${progressPercentage}%`;
  
  return (
    <div style={isMobile ? styles.containerMobile : styles.container}>
      <div style={isMobile ? styles.headerMobile : styles.header}>
        <div style={isMobile ? styles.titleMobile : styles.title}>
          Exam Progress
        </div>
        <div style={isMobile ? styles.statsMobile : styles.stats}>
          {FormattingUtils.formatProgress(answered, total)} Complete
        </div>
      </div>
      
      <div style={styles.progressBarContainer}>
        <div 
          style={{
            ...(isMobile ? styles.progressBarMobile : styles.progressBar),
            width: progressWidth
          }}
        />
        <div style={styles.progressText}>
          {answered} / {total}
        </div>
      </div>
      
      <div style={isMobile ? styles.detailsContainerMobile : styles.detailsContainer}>
        <div style={styles.detailItem}>
          <div style={{
            ...styles.indicator,
            ...styles.currentIndicator
          }} />
          Current: Q{FormattingUtils.formatQuestionNumber(current + 1, total)}
        </div>
        
        <div style={styles.detailItem}>
          <div style={{
            ...styles.indicator,
            ...styles.answeredIndicator
          }} />
          Answered: {answered}
        </div>
        
        <div style={styles.detailItem}>
          <div style={{
            ...styles.indicator,
            ...styles.remainingIndicator
          }} />
          Remaining: {remaining}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;