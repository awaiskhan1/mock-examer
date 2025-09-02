import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUpload, ConfigModal } from '@/components';
import { useExam } from '@/hooks';
import { Target } from 'lucide-react';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
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
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    content: {
      maxWidth: '800px',
      width: '100%'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '40px',
      color: 'white'
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
    subtitle: {
      fontSize: '1.1rem',
      opacity: 0.9,
      marginTop: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <Target size={40} />
            Exam Preparation Tool
          </h1>
          <p style={styles.subtitle}>
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