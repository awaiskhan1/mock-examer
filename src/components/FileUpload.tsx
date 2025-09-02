import React from 'react';
import { Upload, FileText, BarChart3 } from 'lucide-react';
import { FileUploadProps } from '@/types';

const styles = {
  container: {
    textAlign: 'center' as const,
    padding: '40px 20px',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    border: '2px dashed #333',
    margin: '20px 0'
  },
  containerMobile: {
    textAlign: 'center' as const,
    padding: '24px 16px',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    border: '2px dashed #333',
    margin: '16px 0'
  },
  uploadedContainer: {
    backgroundColor: '#0f4c3c',
    border: '2px solid #16a085',
    padding: '20px',
    borderRadius: '12px',
    margin: '20px 0'
  },
  uploadedContainerMobile: {
    backgroundColor: '#0f4c3c',
    border: '2px solid #16a085',
    padding: '16px',
    borderRadius: '12px',
    margin: '16px 0'
  },
  icon: {
    width: '48px',
    height: '48px',
    color: '#3498db',
    margin: '0 auto 20px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '10px'
  },
  titleMobile: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#bbb',
    marginBottom: '30px'
  },
  subtitleMobile: {
    fontSize: '14px',
    color: '#bbb',
    marginBottom: '24px'
  },
  fileInput: {
    display: 'none'
  },
  uploadButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease'
  },
  uploadButtonMobile: {
    backgroundColor: '#3498db',
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
    gap: '6px'
  },
  uploadButtonHover: {
    backgroundColor: '#2980b9',
    transform: 'translateY(-2px)'
  },
  successIcon: {
    width: '24px',
    height: '24px',
    color: '#27ae60',
    marginRight: '10px'
  },
  successTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fileName: {
    fontSize: '14px',
    color: '#ecf0f1',
    marginBottom: '15px'
  },
  statsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '20px'
  },
  statsContainerMobile: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    marginTop: '16px',
    marginBottom: '16px'
  },
  statsItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#ecf0f1'
  },
  statsIcon: {
    width: '16px',
    height: '16px',
    color: '#3498db'
  },
  changeButton: {
    backgroundColor: 'transparent',
    color: '#3498db',
    border: '2px solid #3498db',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  changeButtonMobile: {
    backgroundColor: 'transparent',
    color: '#3498db',
    border: '2px solid #3498db',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  changeButtonHover: {
    backgroundColor: '#3498db',
    color: 'white'
  },
  formatInfo: {
    backgroundColor: '#2c3e50',
    padding: '15px',
    borderRadius: '8px',
    marginTop: '20px'
  },
  formatTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#ecf0f1',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  formatDescription: {
    fontSize: '12px',
    color: '#bdc3c7',
    lineHeight: '1.4'
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px'
  },
  buttonWrapperMobile: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '16px',
    width: '100%'
  }
};

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  uploadedFileName,
  totalQuestions,
  onChangeFile,
  onStartExam
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isChangeHovered, setIsChangeHovered] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (uploadedFileName) {
    return (
      <div style={isMobile ? styles.uploadedContainerMobile : styles.uploadedContainer}>
        <div style={styles.successTitle}>
          <FileText style={styles.successIcon} />
          File Uploaded Successfully!
        </div>
        <div style={styles.fileName}>{uploadedFileName}</div>
        <div style={isMobile ? styles.statsContainerMobile : styles.statsContainer}>
          <div style={styles.statsItem}>
            <BarChart3 style={styles.statsIcon} />
            Total Questions: {totalQuestions}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button
            style={{
              ...styles.uploadButton,
              backgroundColor: '#27ae60',
              ...(isHovered ? { backgroundColor: '#229954', transform: 'translateY(-2px)' } : {})
            }}
            onClick={onStartExam}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Start Exam
          </button>
          <button
            style={{
              ...(isMobile ? styles.changeButtonMobile : styles.changeButton),
              ...(isChangeHovered ? styles.changeButtonHover : {})
            }}
            onClick={onChangeFile}
            onMouseEnter={() => setIsChangeHovered(true)}
            onMouseLeave={() => setIsChangeHovered(false)}
          >
            Change File
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={isMobile ? styles.containerMobile : styles.container}>
      <Upload style={styles.icon} />
      <h2 style={isMobile ? styles.titleMobile : styles.title}>Upload Question File</h2>
      <p style={isMobile ? styles.subtitleMobile : styles.subtitle}>
        Select a JSON file containing your exam questions
      </p>
      
      <input
        type="file"
        accept=".json"
        onChange={onFileUpload}
        style={styles.fileInput}
        id="file-upload"
      />
      
      <div style={isMobile ? styles.buttonWrapperMobile : styles.buttonWrapper}>
        <label htmlFor="file-upload">
          <button
            style={{
              ...(isMobile ? styles.uploadButtonMobile : styles.uploadButton),
              ...(isHovered ? styles.uploadButtonHover : {})
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('file-upload')?.click();
            }}
          >
            <Upload style={{ width: '20px', height: '20px' }} />
            Choose File
          </button>
        </label>
      </div>

      <div style={styles.formatInfo}>
        <div style={styles.formatTitle}>
          <FileText style={{ width: '16px', height: '16px' }} />
          Expected Format:
        </div>
        <div style={styles.formatDescription}>
          Array of question objects with options, correct answers, and explanations.
        </div>
      </div>
    </div>
  );
};

export default FileUpload;