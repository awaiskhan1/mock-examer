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
    const requiredFields = ['question_number', 'question', 'options', 'correct_answers'];
    for (const field of requiredFields) {
      if (!(field in question)) {
        return { isValid: false, error: `Question at index ${index} is missing required field: ${field}` };
      }
    }

    // Validate question_number
    if (typeof question.question_number !== 'number' || question.question_number <= 0) {
      return { isValid: false, error: `Question at index ${index} has invalid question_number` };
    }

    // Validate question text
    if (typeof question.question !== 'string' || question.question.trim().length === 0) {
      return { isValid: false, error: `Question at index ${index} has invalid question text` };
    }

    // Validate options
    if (!Array.isArray(question.options) || question.options.length === 0) {
      return { isValid: false, error: `Question at index ${index} has invalid options array` };
    }

    if (question.options.some((option: any) => typeof option !== 'string' || option.trim().length === 0)) {
      return { isValid: false, error: `Question at index ${index} has invalid option text` };
    }

    // Validate correct_answers
    if (!Array.isArray(question.correct_answers) || question.correct_answers.length === 0) {
      return { isValid: false, error: `Question at index ${index} has invalid correct_answers array` };
    }

    if (question.correct_answers.some((answer: any) => typeof answer !== 'string' || answer.trim().length === 0)) {
      return { isValid: false, error: `Question at index ${index} has invalid correct answer` };
    }

    // Validate that correct answers reference valid option indices
    const maxOptionIndex = question.options.length - 1;
    const maxOptionLetter = String.fromCharCode(65 + maxOptionIndex); // A, B, C, etc.
    
    for (const answer of question.correct_answers) {
      const answerLetter = answer.charAt(0).toUpperCase();
      if (answerLetter < 'A' || answerLetter > maxOptionLetter) {
        return { 
          isValid: false, 
          error: `Question at index ${index} has correct answer '${answer}' that doesn't match available options` 
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