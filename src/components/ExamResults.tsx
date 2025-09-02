import React from 'react';
import { CheckCircle, XCircle, Award, BarChart3, Download, RotateCcw } from 'lucide-react';
import { ExamResultsProps } from '@/types';
import { FormattingUtils } from '@/utils';

const styles = {
  container: {
    backgroundColor: '#1a1a1a',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #333',
    textAlign: 'center' as const,
    maxWidth: '600px',
    margin: '0 auto'
  },
  containerMobile: {
    backgroundColor: '#1a1a1a',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #333',
    textAlign: 'center' as const,
    maxWidth: '100%',
    margin: '0 auto'
  },
  header: {
    marginBottom: '24px'
  },
  icon: {
    width: '64px',
    height: '64px',
    margin: '0 auto 16px',
    color: '#27ae60'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '8px'
  },
  titleMobile: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '6px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#bbb',
    marginBottom: '24px'
  },
  scoreSection: {
    backgroundColor: '#2c3e50',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '24px'
  },
  scoreValue: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: '8px'
  },
  scoreValueMobile: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: '6px'
  },
  scoreLabel: {
    fontSize: '14px',
    color: '#bbb',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  statsGridMobile: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '12px',
    marginBottom: '20px'
  },
  statCard: {
    backgroundColor: '#2c3e50',
    padding: '16px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px'
  },
  statIcon: {
    width: '24px',
    height: '24px'
  },
  correctIcon: {
    color: '#27ae60'
  },
  incorrectIcon: {
    color: '#e74c3c'
  },
  chartIcon: {
    color: '#3498db'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff'
  },
  statLabel: {
    fontSize: '12px',
    color: '#bbb',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  performanceBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#333',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '24px'
  },
  performanceFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 1s ease-in-out'
  },
  excellentPerformance: {
    background: 'linear-gradient(90deg, #27ae60, #2ecc71)'
  },
  goodPerformance: {
    background: 'linear-gradient(90deg, #f39c12, #e67e22)'
  },
  poorPerformance: {
    background: 'linear-gradient(90deg, #e74c3c, #c0392b)'
  },
  performanceText: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px'
  },
  excellentText: {
    color: '#27ae60'
  },
  goodText: {
    color: '#f39c12'
  },
  poorText: {
    color: '#e74c3c'
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap' as const
  },
  actionButtonsMobile: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: 'transparent',
    border: '1px solid #555',
    color: '#bbb',
    padding: '12px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: '140px',
    justifyContent: 'center'
  },
  buttonMobile: {
    backgroundColor: 'transparent',
    border: '1px solid #555',
    color: '#bbb',
    padding: '10px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    width: '100%',
    justifyContent: 'center'
  },
  primaryButton: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
    color: 'white'
  },
  primaryButtonHover: {
    backgroundColor: '#2980b9',
    borderColor: '#2980b9'
  },
  secondaryButton: {
    borderColor: '#95a5a6',
    color: '#95a5a6'
  },
  secondaryButtonHover: {
    backgroundColor: '#95a5a6',
    color: 'white'
  }
};

const ExamResults: React.FC<ExamResultsProps> = ({
  totalQuestions,
  correctAnswers,
  incorrectAnswers,
  score,
  onRestart,
  onGeneratePDF
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
  
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  // Determine performance level
  const getPerformanceLevel = () => {
    if (percentage >= 80) return 'excellent';
    if (percentage >= 60) return 'good';
    return 'poor';
  };
  
  const performanceLevel = getPerformanceLevel();
  
  const getPerformanceStyles = () => {
    switch (performanceLevel) {
      case 'excellent':
        return {
          fill: styles.excellentPerformance,
          text: { ...styles.performanceText, ...styles.excellentText },
          message: 'Excellent Performance!'
        };
      case 'good':
        return {
          fill: styles.goodPerformance,
          text: { ...styles.performanceText, ...styles.goodText },
          message: 'Good Performance!'
        };
      default:
        return {
          fill: styles.poorPerformance,
          text: { ...styles.performanceText, ...styles.poorText },
          message: 'Keep Practicing!'
        };
    }
  };
  
  const performanceStyles = getPerformanceStyles();
  
  const getButtonStyle = (buttonType: string, baseStyle: any, hoverStyle: any) => {
    return {
      ...styles.button,
      ...baseStyle,
      ...(hoveredButton === buttonType ? hoverStyle : {})
    };
  };

  return (
    <div style={isMobile ? styles.containerMobile : styles.container}>
      <div style={styles.header}>
        <Award style={styles.icon} />
        <h2 style={isMobile ? styles.titleMobile : styles.title}>Exam Complete!</h2>
        <p style={styles.subtitle}>
          You've completed all {totalQuestions} questions
        </p>
      </div>
      
      <div style={styles.scoreSection}>
        <div style={isMobile ? styles.scoreValueMobile : styles.scoreValue}>
          {score}%
        </div>
        <div style={styles.scoreLabel}>
          Final Score
        </div>
      </div>
      
      <div style={performanceStyles.text}>
        {performanceStyles.message}
      </div>
      
      <div style={styles.performanceBar}>
        <div 
          style={{
            ...performanceStyles.fill,
            width: `${percentage}%`
          }}
        />
      </div>
      
      <div style={isMobile ? styles.statsGridMobile : styles.statsGrid}>
        <div style={styles.statCard}>
          <CheckCircle style={{
            ...styles.statIcon,
            ...styles.correctIcon
          }} />
          <div style={styles.statValue}>
            {correctAnswers}
          </div>
          <div style={styles.statLabel}>
            Correct
          </div>
        </div>
        
        <div style={styles.statCard}>
          <XCircle style={{
            ...styles.statIcon,
            ...styles.incorrectIcon
          }} />
          <div style={styles.statValue}>
            {incorrectAnswers}
          </div>
          <div style={styles.statLabel}>
            Incorrect
          </div>
        </div>
        
        <div style={styles.statCard}>
          <BarChart3 style={{
            ...styles.statIcon,
            ...styles.chartIcon
          }} />
          <div style={styles.statValue}>
            {totalQuestions}
          </div>
          <div style={styles.statLabel}>
            Total
          </div>
        </div>
      </div>
      
      <div style={isMobile ? styles.actionButtonsMobile : styles.actionButtons}>
        <button
          style={{
            ...(isMobile ? styles.buttonMobile : styles.button),
            ...styles.primaryButton,
            ...(hoveredButton === 'pdf' ? styles.primaryButtonHover : {})
          }}
          onClick={onGeneratePDF}
          onMouseEnter={() => setHoveredButton('pdf')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <Download style={{ width: '16px', height: '16px' }} />
          Download Report
        </button>
        
        <button
          style={{
            ...(isMobile ? styles.buttonMobile : styles.button),
            ...styles.secondaryButton,
            ...(hoveredButton === 'restart' ? styles.secondaryButtonHover : {})
          }}
          onClick={onRestart}
          onMouseEnter={() => setHoveredButton('restart')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <RotateCcw style={{ width: '16px', height: '16px' }} />
          Start New Exam
        </button>
      </div>
    </div>
  );
};

export default ExamResults;