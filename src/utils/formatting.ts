/**
 * Formatting utilities for display and data transformation
 */
export class FormattingUtils {
  /**
   * Formats a question number with leading zeros
   */
  static formatQuestionNumber(questionNumber: number, totalQuestions: number): string {
    const digits = totalQuestions.toString().length;
    return questionNumber.toString().padStart(digits, '0');
  }

  /**
   * Formats exam score as percentage
   */
  static formatScore(correct: number, total: number): string {
    if (total === 0) return '0%';
    const percentage = Math.round((correct / total) * 100);
    return `${percentage}%`;
  }

  /**
   * Formats exam score with details
   */
  static formatScoreDetailed(correct: number, total: number): string {
    const percentage = this.formatScore(correct, total);
    return `${correct}/${total} (${percentage})`;
  }

  /**
   * Formats time duration in minutes and seconds
   */
  static formatDuration(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (minutes === 0) {
      return `${seconds}s`;
    }
    
    return `${minutes}m ${seconds}s`;
  }

  /**
   * Formats file size in human readable format
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Formats date for display
   */
  static formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Formats question options with letters (A, B, C, D)
   */
  static formatQuestionOptions(options: string[]): Array<{ letter: string; text: string }> {
    return options.map((option, index) => ({
      letter: String.fromCharCode(65 + index), // A, B, C, D...
      text: option
    }));
  }

  /**
   * Formats answer letters for display
   */
  static formatAnswerLetters(answers: string[]): string {
    return answers
      .map(answer => answer.charAt(0).toUpperCase())
      .sort()
      .join(', ');
  }

  /**
   * Truncates text to specified length with ellipsis
   */
  static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * Capitalizes first letter of each word
   */
  static titleCase(text: string): string {
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  /**
   * Formats exam configuration for display
   */
  static formatExamConfig(config: {
    startRange?: string;
    endRange?: string;
    randomize: boolean;
    randomCount?: string;
  }): string {
    const parts: string[] = [];
    
    if (config.startRange && config.endRange) {
      parts.push(`Questions ${config.startRange}-${config.endRange}`);
    }
    
    if (config.randomize && config.randomCount) {
      parts.push(`${config.randomCount} random questions`);
    }
    
    return parts.length > 0 ? parts.join(', ') : 'All questions';
  }

  /**
   * Formats progress percentage
   */
  static formatProgress(current: number, total: number): string {
    if (total === 0) return '0%';
    const percentage = Math.round((current / total) * 100);
    return `${percentage}%`;
  }

  /**
   * Formats question text for PDF export
   */
  static formatQuestionForPDF(questionText: string, maxLineLength: number = 80): string[] {
    const words = questionText.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      if ((currentLine + word).length > maxLineLength) {
        if (currentLine) {
          lines.push(currentLine.trim());
          currentLine = word + ' ';
        } else {
          lines.push(word);
        }
      } else {
        currentLine += word + ' ';
      }
    }
    
    if (currentLine) {
      lines.push(currentLine.trim());
    }
    
    return lines;
  }

  /**
   * Removes HTML tags from text
   */
  static stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  /**
   * Formats exam results summary
   */
  static formatExamSummary(results: {
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    skippedQuestions: number;
    timeSpent?: number;
  }): string {
    const { totalQuestions, correctAnswers, incorrectAnswers, skippedQuestions, timeSpent } = results;
    const score = this.formatScoreDetailed(correctAnswers, totalQuestions);
    
    let summary = `Score: ${score}\n`;
    summary += `Correct: ${correctAnswers}\n`;
    summary += `Incorrect: ${incorrectAnswers}\n`;
    
    if (skippedQuestions > 0) {
      summary += `Skipped: ${skippedQuestions}\n`;
    }
    
    if (timeSpent) {
      summary += `Time: ${this.formatDuration(timeSpent)}`;
    }
    
    return summary;
  }
}