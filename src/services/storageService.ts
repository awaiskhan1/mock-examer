import { Question, UserAnswers } from '@/types';

export class StorageService {
  private static readonly KEYS = {
    QUESTIONS: 'examQuestions',
    USER_ANSWERS: 'userAnswers',
    CURRENT_INDEX: 'currentQuestionIndex',
    FILE_NAME: 'uploadedFileName'
  } as const;

  /**
   * Save questions to localStorage
   */
  static saveQuestions(questions: Question[]): void {
    try {
      localStorage.setItem(this.KEYS.QUESTIONS, JSON.stringify(questions));
    } catch (error) {
      console.error('Failed to save questions to localStorage:', error);
    }
  }

  /**
   * Load questions from localStorage
   */
  static loadQuestions(): Question[] | null {
    try {
      const saved = localStorage.getItem(this.KEYS.QUESTIONS);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to load questions from localStorage:', error);
      return null;
    }
  }

  /**
   * Save user answers to localStorage
   */
  static saveUserAnswers(answers: UserAnswers): void {
    try {
      localStorage.setItem(this.KEYS.USER_ANSWERS, JSON.stringify(answers));
    } catch (error) {
      console.error('Failed to save user answers to localStorage:', error);
    }
  }

  /**
   * Load user answers from localStorage
   */
  static loadUserAnswers(): UserAnswers | null {
    try {
      const saved = localStorage.getItem(this.KEYS.USER_ANSWERS);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to load user answers from localStorage:', error);
      return null;
    }
  }

  /**
   * Save current question index to localStorage
   */
  static saveCurrentIndex(index: number): void {
    try {
      localStorage.setItem(this.KEYS.CURRENT_INDEX, index.toString());
    } catch (error) {
      console.error('Failed to save current index to localStorage:', error);
    }
  }

  /**
   * Load current question index from localStorage
   */
  static loadCurrentIndex(): number | null {
    try {
      const saved = localStorage.getItem(this.KEYS.CURRENT_INDEX);
      return saved ? parseInt(saved, 10) : null;
    } catch (error) {
      console.error('Failed to load current index from localStorage:', error);
      return null;
    }
  }

  /**
   * Save uploaded file name to localStorage
   */
  static saveFileName(fileName: string): void {
    try {
      localStorage.setItem(this.KEYS.FILE_NAME, fileName);
    } catch (error) {
      console.error('Failed to save file name to localStorage:', error);
    }
  }

  /**
   * Load uploaded file name from localStorage
   */
  static loadFileName(): string | null {
    try {
      return localStorage.getItem(this.KEYS.FILE_NAME);
    } catch (error) {
      console.error('Failed to load file name from localStorage:', error);
      return null;
    }
  }

  /**
   * Clear all exam-related data from localStorage
   */
  static clearAll(): void {
    try {
      Object.values(this.KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      // Also clear sessionStorage for good measure
      sessionStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get storage usage information
   */
  static getStorageInfo(): {
    used: number;
    available: boolean;
    keys: string[];
  } {
    const keys = Object.values(this.KEYS).filter(key => 
      localStorage.getItem(key) !== null
    );
    
    const used = keys.reduce((total, key) => {
      const item = localStorage.getItem(key);
      return total + (item ? item.length : 0);
    }, 0);

    return {
      used,
      available: this.isAvailable(),
      keys
    };
  }
}