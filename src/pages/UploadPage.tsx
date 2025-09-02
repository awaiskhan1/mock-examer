import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUpload, ConfigModal } from '@/components';
import { useExam } from '@/hooks';
import { Target } from 'lucide-react';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(false);
  
  const {
    allQuestions,
    uploadedFileName,
    examConfig,
    showConfigModal,
    handleFileUpload,
    handleStartExam,
    handleConfigChange,
    handleChangeFile,
    applyConfiguration,
    skipConfiguration
  } = useExam();

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);



  // Override applyConfiguration to navigate to exam page
  const handleApplyConfiguration = () => {
    applyConfiguration();
    navigate('/exam');
  };

  // Override skipConfiguration to navigate to exam page
  const handleSkipConfiguration = () => {
    skipConfiguration();
    navigate('/exam');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2c2c2c 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box' as const
    },
    containerMobile: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2c2c2c 100%)',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '16px 12px',
      boxSizing: 'border-box' as const,
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden'
    },
    content: {
      maxWidth: '800px',
      width: '100%'
    },
    contentMobile: {
      width: '100%',
      maxWidth: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '40px',
      color: 'white'
    },
    headerMobile: {
      textAlign: 'center' as const,
      marginBottom: '24px',
      color: 'white',
      width: '100%',
      padding: '0 8px'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px'
    },
    titleMobile: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      margin: '12px 0px 0px 0px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      flexWrap: 'wrap' as const,
      lineHeight: '1.2'
    },
    subtitle: {
      fontSize: '1.1rem',
      opacity: 0.9,
      marginTop: '10px'
    },
    subtitleMobile: {
      fontSize: '0.95rem',
      opacity: 0.9,
      marginTop: '16px',
      lineHeight: '1.4',
      textAlign: 'center'
    }
  };

  return (
    <div style={isMobile ? styles.containerMobile : styles.container}>
      <div style={isMobile ? styles.contentMobile : styles.content}>
        <div style={isMobile ? styles.headerMobile : styles.header}>
          <h1 style={isMobile ? styles.titleMobile : styles.title}>
            <Target size={isMobile ? 32 : 40} />
            Exam Preparation Tool
          </h1>
          <p style={isMobile ? styles.subtitleMobile : styles.subtitle}>
            Upload your exam questions and start practicing
          </p>
        </div>
        
        <FileUpload
          onFileUpload={handleFileUpload}
          uploadedFileName={uploadedFileName}
          totalQuestions={allQuestions.length}
          onChangeFile={handleChangeFile}
          onStartExam={handleStartExam}
        />
        
        {/* Configuration Modal */}
        {showConfigModal && (
          <ConfigModal
            isOpen={showConfigModal}
            examConfig={examConfig}
            totalQuestions={allQuestions.length}
            onConfigChange={handleConfigChange}
            onApplyConfiguration={handleApplyConfiguration}
            onSkipConfiguration={handleSkipConfiguration}
            onClose={handleSkipConfiguration}
          />
        )}
        

      </div>
    </div>
  );
};

export default UploadPage;