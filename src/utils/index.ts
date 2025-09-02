import { ValidationUtils } from './validation';
import { FormattingUtils } from './formatting';

export { ValidationUtils, FormattingUtils };

// Re-export commonly used utilities for convenience
export const {
  validateQuestionData,
  validateExamConfig,
  validateFile,
  sanitizeInput
} = ValidationUtils;

export const {
  formatQuestionNumber,
  formatScore,
  formatScoreDetailed,
  formatDuration,
  formatFileSize,
  formatDate,
  formatQuestionOptions,
  formatAnswerLetters,
  truncateText,
  formatExamConfig,
  formatProgress
} = FormattingUtils;