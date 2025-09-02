import { Question, ExamConfig, UserAnswers } from '@/types';

export class ExamService {
  /**
   * Filters questions based on exam configuration
   */
  static filterQuestions(questions: Question[], config: ExamConfig): Question[] {
    let filteredQuestions = [...questions];
    
    // Apply question range filtering
    if (config.startRange && config.endRange) {
      const start = parseInt(config.startRange) - 1;
      const end = parseInt(config.endRange);
      if (start >= 0 && end <= questions.length && start < end) {
        filteredQuestions = questions.slice(start, end);
      }
    }
    
    // Apply randomization
    if (config.randomize) {
      // Shuffle the questions
      filteredQuestions = this.shuffleArray(filteredQuestions);
      
      // Limit to random count if specified
      if (config.randomCount && parseInt(config.randomCount) > 0) {
        const count = Math.min(parseInt(config.randomCount), filteredQuestions.length);
        filteredQuestions = filteredQuestions.slice(0, count);
      }
    }
    
    return filteredQuestions;
  }

  /**
   * Shuffles an array using Fisher-Yates algorithm
   */
  static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Calculates exam score from user answers
   */
  static calculateScore(userAnswers: UserAnswers): {
    total: number;
    correct: number;
    percentage: number;
  } {
    const total = Object.keys(userAnswers).length;
    const correct = Object.values(userAnswers).filter(answer => answer.isCorrect).length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    return { total, correct, percentage };
  }

  /**
   * Validates question data structure
   */
  static validateQuestions(data: any): data is Question[] {
    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }

    return data.every(item => 
      typeof item === 'object' &&
      typeof item.question_number === 'number' &&
      typeof item.question === 'string' &&
      Array.isArray(item.options) &&
      Array.isArray(item.correct_answers) &&
      item.options.length > 0 &&
      item.correct_answers.length > 0
    );
  }

  /**
   * Checks if answers are correct for a given question
   */
  static isAnswerCorrect(question: Question, answers: string[]): boolean {
    // For single correct answer questions, user must select exactly one correct answer
    if (question.correct_answers.length === 1) {
      return answers.length === 1 && question.correct_answers.includes(answers[0].charAt(0));
    }
    
    // For multiple correct answer questions, user must select all correct answers and no incorrect ones
    const userAnswerLetters = answers.map(a => a.charAt(0));
    const correctAnswerLetters = question.correct_answers;
    
    return userAnswerLetters.length === correctAnswerLetters.length &&
           userAnswerLetters.every(letter => correctAnswerLetters.includes(letter)) &&
           correctAnswerLetters.every(letter => userAnswerLetters.includes(letter));
  }

  /**
   * Gets the correct answer letter(s) for a question
   */
  static getCorrectAnswers(question: Question): string[] {
    return question.correct_answers;
  }

  /**
   * Formats question options with letters (A, B, C, D)
   */
  static formatOptionWithLetter(option: string, index: number): string {
    const letter = String.fromCharCode(65 + index); // A, B, C, D...
    return `${letter}. ${option}`;
  }

  /**
   * Gets option letter from index
   */
  static getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }
}