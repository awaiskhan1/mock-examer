import { Question, ExamConfig } from '@/types';

/**
 * Validation utilities for exam data and configuration
 */
export class ValidationUtils {
  /**
   * Validates if the uploaded file contains valid question data
   */
  static validateQuestionData(data: any): { isValid: boolean; error?: string } {
    if (!data) {
      return { isValid: false, error: 'No data provided' };
    }

    if (!Array.isArray(data)) {
      return { isValid: false, error: 'Data must be an array of questions' };
    }

    if (data.length === 0) {
      return { isValid: false, error: 'Question array cannot be empty' };
    }

    for (let i = 0; i < data.length; i++) {
      const question = data[i];
      const validation = this.validateSingleQuestion(question, i);
      if (!validation.isValid) {
        return validation;
      }
    }

    return { isValid: true };
  }

  /**
   * Validates a single question object
   */
  static validateSingleQuestion(question: any, index: number): { isValid: boolean; error?: string } {
    if (!question || typeof question !== 'object') {
      return { isValid: false, error: `Question at index ${index} is not a valid object` };
    }

    // Check required fields
    const requiredFields = ['question_number', 'question', 'options'];
    for (const field of requiredFields) {
      if (!(field in question)) {
        return { isValid: false, error: `Question at index ${index} is missing required field: ${field}` };
      }
    }
    
    // Check for correct answer field (either correct_answer or correct_answers)
    if (!('correct_answer' in question) && !('correct_answers' in question)) {
      return { isValid: false, error: `Question at index ${index} is missing correct answer field (correct_answer or correct_answers)` };
    }

    // Validate question_number
    if (typeof question.question_number !== 'number' || question.question_number <= 0) {
      return { isValid: false, error: `Question at index ${index} has invalid question_number` };
    }

    // Validate question text
    if (typeof question.question !== 'string' || question.question.trim().length === 0) {
      return { isValid: false, error: `Question at index ${index} has invalid question text` };
    }

    // Validate options (can be array or object)
    if (Array.isArray(question.options)) {
      if (question.options.length === 0) {
        return { isValid: false, error: `Question at index ${index} has empty options array` };
      }
      if (question.options.some((option: any) => typeof option !== 'string' || option.trim().length === 0)) {
        return { isValid: false, error: `Question at index ${index} has invalid option text` };
      }
    } else if (typeof question.options === 'object' && question.options !== null) {
      const optionKeys = Object.keys(question.options);
      if (optionKeys.length === 0) {
        return { isValid: false, error: `Question at index ${index} has empty options object` };
      }
      for (const key of optionKeys) {
        if (typeof question.options[key] !== 'string' || question.options[key].trim().length === 0) {
          return { isValid: false, error: `Question at index ${index} has invalid option text for key ${key}` };
        }
      }
    } else {
      return { isValid: false, error: `Question at index ${index} has invalid options format (must be array or object)` };
    }

    // Validate correct answers (can be correct_answer string or correct_answers array)
    if (question.correct_answers) {
      if (Array.isArray(question.correct_answers)) {
        if (question.correct_answers.length === 0) {
          return { isValid: false, error: `Question at index ${index} has empty correct_answers array` };
        }
        if (question.correct_answers.some((answer: any) => typeof answer !== 'string' || answer.trim().length === 0)) {
          return { isValid: false, error: `Question at index ${index} has invalid correct answer` };
        }
      } else if (typeof question.correct_answers === 'string') {
        if (question.correct_answers.trim().length === 0) {
          return { isValid: false, error: `Question at index ${index} has empty correct_answers string` };
        }
      } else {
        return { isValid: false, error: `Question at index ${index} has invalid correct_answers format` };
      }
    } else if (question.correct_answer) {
      if (typeof question.correct_answer !== 'string' || question.correct_answer.trim().length === 0) {
        return { isValid: false, error: `Question at index ${index} has invalid correct_answer` };
      }
    }

    // Validate that correct answers reference valid options
    let optionCount: number;
    let validOptionKeys: string[];
    
    if (Array.isArray(question.options)) {
      optionCount = question.options.length;
      validOptionKeys = Array.from({ length: optionCount }, (_, i) => String.fromCharCode(65 + i)); // A, B, C, etc.
    } else {
      validOptionKeys = Object.keys(question.options).sort();
      optionCount = validOptionKeys.length;
    }
    
    // Get correct answers to validate
    let answersToValidate: string[] = [];
    if (question.correct_answers) {
      if (Array.isArray(question.correct_answers)) {
        answersToValidate = question.correct_answers;
      } else {
        answersToValidate = [question.correct_answers];
      }
    } else if (question.correct_answer) {
      answersToValidate = [question.correct_answer];
    }
    
    for (const answer of answersToValidate) {
      const answerLetter = answer.charAt(0).toUpperCase();
      if (!validOptionKeys.includes(answerLetter)) {
        return { 
          isValid: false, 
          error: `Question at index ${index} has correct answer '${answer}' that doesn't match available options (${validOptionKeys.join(', ')})` 
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Validates exam configuration
   */
  static validateExamConfig(config: ExamConfig, totalQuestions: number): { isValid: boolean; error?: string } {
    // Validate range values
    if (config.startRange && config.endRange) {
      const start = parseInt(config.startRange);
      const end = parseInt(config.endRange);

      if (isNaN(start) || isNaN(end)) {
        return { isValid: false, error: 'Start and end range must be valid numbers' };
      }

      if (start < 1) {
        return { isValid: false, error: 'Start range must be at least 1' };
      }

      if (end > totalQuestions) {
        return { isValid: false, error: `End range cannot exceed total questions (${totalQuestions})` };
      }

      if (start >= end) {
        return { isValid: false, error: 'Start range must be less than end range' };
      }
    }

    // Validate random count
    if (config.randomize && config.randomCount) {
      const count = parseInt(config.randomCount);
      if (isNaN(count) || count <= 0) {
        return { isValid: false, error: 'Random count must be a positive number' };
      }

      if (count > totalQuestions) {
        return { isValid: false, error: `Random count cannot exceed total questions (${totalQuestions})` };
      }
    }

    return { isValid: true };
  }

  /**
   * Validates file type and size
   */
  static validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    if (file.type !== 'application/json') {
      return { isValid: false, error: 'File must be a JSON file' };
    }

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 10MB' };
    }

    // Check if file is empty
    if (file.size === 0) {
      return { isValid: false, error: 'File cannot be empty' };
    }

    return { isValid: true };
  }

  /**
   * Sanitizes user input to prevent XSS
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Validates question number format
   */
  static isValidQuestionNumber(questionNumber: any): boolean {
    return typeof questionNumber === 'number' && 
           Number.isInteger(questionNumber) && 
           questionNumber > 0;
  }

  /**
   * Validates answer format (should be A, B, C, D, etc.)
   */
  static isValidAnswerFormat(answer: string): boolean {
    return /^[A-Z]$/i.test(answer.charAt(0));
  }
}