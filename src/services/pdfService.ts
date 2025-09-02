import jsPDF from 'jspdf';
import { Question, UserAnswers } from '@/types';
import { ExamService } from './examService';

export class PDFService {
  private static readonly PAGE_CONFIG = {
    margin: 20,
    lineHeight: 6,
    titleFontSize: 16,
    headerFontSize: 12,
    bodyFontSize: 10,
    smallFontSize: 8
  };

  /**
   * Generates a comprehensive exam report PDF
   */
  static generateExamReport(questions: Question[], userAnswers: UserAnswers): void {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const { margin } = this.PAGE_CONFIG;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Set dark theme background
    this.setDarkBackground(pdf, pageWidth, pageHeight);

    // Generate title
    yPosition = this.addTitle(pdf, pageWidth, yPosition);

    // Generate summary section
    yPosition = this.addSummary(pdf, userAnswers, margin, yPosition);

    // Generate detailed results
    yPosition = this.addDetailedResults(pdf, questions, userAnswers, margin, maxWidth, yPosition, pageWidth, pageHeight);

    // Save the PDF
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    pdf.save(`exam-report-${timestamp}.pdf`);
  }

  /**
   * Sets dark background for the PDF
   */
  private static setDarkBackground(pdf: jsPDF, pageWidth: number, pageHeight: number): void {
    pdf.setFillColor(33, 37, 41); // Dark background
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  }

  /**
   * Adds title to the PDF
   */
  private static addTitle(pdf: jsPDF, pageWidth: number, yPosition: number): number {
    pdf.setTextColor(255, 255, 255); // White text
    pdf.setFontSize(this.PAGE_CONFIG.titleFontSize);
    pdf.setFont('helvetica', 'bold');
    
    const title = 'Exam Results Report';
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, (pageWidth - titleWidth) / 2, yPosition);
    
    return yPosition + 15;
  }

  /**
   * Adds summary section to the PDF
   */
  private static addSummary(pdf: jsPDF, userAnswers: UserAnswers, margin: number, yPosition: number): number {
    const { total, correct, percentage } = ExamService.calculateScore(userAnswers);
    const incorrect = total - correct;

    pdf.setFontSize(this.PAGE_CONFIG.headerFontSize);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Summary:', margin, yPosition);
    yPosition += 8;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(this.PAGE_CONFIG.bodyFontSize);
    
    const summaryLines = [
      `Total Questions Answered: ${total}`,
      `Correct Answers: ${correct}`,
      `Incorrect Answers: ${incorrect}`,
      `Score: ${percentage}%`
    ];

    summaryLines.forEach(line => {
      pdf.text(line, margin, yPosition);
      yPosition += this.PAGE_CONFIG.lineHeight;
    });

    return yPosition + 8;
  }

  /**
   * Adds detailed results section to the PDF
   */
  private static addDetailedResults(
    pdf: jsPDF,
    questions: Question[],
    userAnswers: UserAnswers,
    margin: number,
    maxWidth: number,
    yPosition: number,
    pageWidth: number,
    pageHeight: number
  ): number {
    pdf.setFontSize(this.PAGE_CONFIG.headerFontSize);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Detailed Results:', margin, yPosition);
    yPosition += 12;

    Object.entries(userAnswers).forEach(([questionNumber, answerData]) => {
      const question = questions.find(q => q.question_number.toString() === questionNumber);
      if (!question) return;

      // Check if we need a new page
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        this.setDarkBackground(pdf, pageWidth, pageHeight);
        yPosition = margin;
      }

      yPosition = this.addQuestionDetails(pdf, question, answerData, margin, maxWidth, yPosition);
    });

    return yPosition;
  }

  /**
   * Adds individual question details to the PDF
   */
  private static addQuestionDetails(
    pdf: jsPDF,
    question: Question,
    answerData: { userAnswer: string; isCorrect: boolean },
    margin: number,
    maxWidth: number,
    yPosition: number
  ): number {
    // Question number and text
    pdf.setFontSize(this.PAGE_CONFIG.bodyFontSize);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    
    const questionTitle = `Question ${question.question_number}:`;
    pdf.text(questionTitle, margin, yPosition);
    yPosition += this.PAGE_CONFIG.lineHeight;

    // Question text with word wrap
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    const questionLines = pdf.splitTextToSize(question.question, maxWidth);
    questionLines.forEach((line: string) => {
      pdf.text(line, margin, yPosition);
      yPosition += 5;
    });
    yPosition += 3;

    // Options
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(this.PAGE_CONFIG.smallFontSize);
    question.options.forEach((option, index) => {
      const optionLetter = ExamService.getOptionLetter(index);
      const isCorrect = question.correct_answers.includes(optionLetter);
      const isUserAnswer = answerData.userAnswer.startsWith(optionLetter);
      
      // Set color based on correctness
      if (isCorrect) {
        pdf.setTextColor(16, 185, 129); // Green for correct
      } else if (isUserAnswer && !isCorrect) {
        pdf.setTextColor(239, 68, 68); // Red for incorrect user answer
      } else {
        pdf.setTextColor(209, 213, 219); // Gray for other options
      }
      
      const optionText = `${optionLetter}. ${option}`;
      const optionLines = pdf.splitTextToSize(optionText, maxWidth - 10);
      optionLines.forEach((line: string) => {
        pdf.text(line, margin + 5, yPosition);
        yPosition += 4;
      });
    });

    // User answer and result
    yPosition += 3;
    pdf.setFontSize(this.PAGE_CONFIG.smallFontSize);
    pdf.setFont('helvetica', 'bold');
    
    if (answerData.isCorrect) {
      pdf.setTextColor(16, 185, 129); // Green
      pdf.text(`Your Answer: ${answerData.userAnswer} ✓ Correct`, margin, yPosition);
    } else {
      pdf.setTextColor(239, 68, 68); // Red
      pdf.text(`Your Answer: ${answerData.userAnswer} ✗ Incorrect`, margin, yPosition);
      yPosition += 4;
      pdf.setTextColor(16, 185, 129);
      pdf.text(`Correct Answer(s): ${question.correct_answers.join(', ')}`, margin, yPosition);
    }
    
    yPosition += 6;

    // Explanation if available
    if (question.explanation) {
      pdf.setTextColor(209, 213, 219);
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(this.PAGE_CONFIG.smallFontSize);
      pdf.text('Explanation:', margin, yPosition);
      yPosition += 4;
      
      const explanationLines = pdf.splitTextToSize(question.explanation, maxWidth);
      explanationLines.forEach((line: string) => {
        pdf.text(line, margin, yPosition);
        yPosition += 4;
      });
    }

    return yPosition + 8; // Add some spacing after each question
  }

  /**
   * Generates a quick summary PDF (lighter version)
   */
  static generateQuickSummary(userAnswers: UserAnswers): void {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    this.setDarkBackground(pdf, pageWidth, pageHeight);
    yPosition = this.addTitle(pdf, pageWidth, yPosition);
    this.addSummary(pdf, userAnswers, margin, yPosition);

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    pdf.save(`exam-summary-${timestamp}.pdf`);
  }
}