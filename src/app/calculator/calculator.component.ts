import { Component, AfterViewChecked, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../local-storage.service';

/** Interface representing an item in the calculation history */
interface HistoryItem {
  /** The mathematical expression as a string (e.g., "5+3") */
  expression: string;
  /** The evaluated result of the expression (e.g., "8") */
  result: string;
}

@Component({
  selector: 'app-calculator', // Selector used in the HTML to include this component
  standalone: true,
  imports: [CommonModule],   // Import common Angular modules (needed for structural directives like *ngIf)
  templateUrl: './calculator.component.html', // Path to the HTML template file
  styleUrl: './calculator.component.css'      // Path to CSS styles for this component
})
/** 
 * The main Angular component that implements the calculator's logic and user interface
*/
export class CalculatorComponent implements AfterViewChecked, OnInit {
  // ------------------- Private Properties -------------------

  /**
   * Number of decimal places to round results, used to avoid floating-point 
   * precision errors
   */
  private readonly ROUND_DP = 10;

  /** Tokens representing the current mathematical expression (e.g., ["5", "+", "3"]) */
  private tokens: string[] = [];

  // ------------------- Public Properties -------------------

  /** List of previous calculations stored in history items */
  history: HistoryItem[] = [];

  /** Flag to show/hide the confirmation dialog for clearing all data */
  showConfirmation: boolean = false;

  // ------------------- Constructor -------------------

  /**
   * Dependency injection for accessing local storage operations through the service
   */
  constructor(private localStorage: LocalStorageService) {}

  // ViewChild decorator to reference the HTML element for the history container
  @ViewChild('historyContainer') private historyContainer!: ElementRef;

  // ------------------- Getters and Setters -------------------

  /**
   * Gets the current display value for the calculator screen
   */
  get displayValue(): string {
    // Returns joined tokens or "0" if there's nothing to display
    return this.tokens.length > 0 ? this.tokens.join('') : '0';
  }

  /**
   * Gets the real-time evaluation result of current tokens (shows while typing)
   */
  get liveResult(): string {
    if (this.tokens.length === 0) return '';
    
    let expression = this.tokens.join('');
    
    // Ignore trailing operator for evaluation
    if (this.isOperator(expression.slice(-1))) {
      expression = this.tokens.slice(0, -1).join('');
    }

    // Replace operator symbols with JavaScript syntax
    expression = this.replaceOperators(expression);
    
    try {
      const result = window.eval(expression);
      return this.roundResult(result).toString();
    } catch (error) {
      return '';
    }
  }

  // ------------------- Angular Lifecycle Hook -------------------

  /**
   * Angular lifecycle hook that runs after view updates
   * Scrolls history container to bottom whenever the view is updated
   */
  ngAfterViewChecked(): void {
    this.scrollHistoryToBottom();
  }

  /**
   * Initialize component state by restoring history from local storage when 
   * the component is first loaded
   */
  ngOnInit(): void {
    // Load stored history
    const storedHistory = this.localStorage.getItem('equations');
    if (storedHistory) {
      this.history = JSON.parse(storedHistory);
    }
  }

  // ------------------- Public Methods -------------------

  /**
   * Displays the confirmation dialog for clearing all expressions and history
   */
  clearAllDialog(): void {
    this.showConfirmation = true;
  }

  /**
   * Clears all current tokens and history, then hides the confirmation dialog
   */
  confirmClearAll(): void {
    this.tokens = [];
    this.history = [];
    this.saveHistory(); // Save history to local storage
    this.showConfirmation = false;
  }

  /**
   * Closes the clear confirmation dialog without performing any action
   */
  cancelClearAll(): void {
    this.showConfirmation = false;
  }

  /**
   * Adds a digit character to current operand(s)
   * @param digit - the numeric character being added (e.g., "5")
   */
  appendDigit(digit: string): void {
    if (this.tokens[this.tokens.length-1] === "Error") this.tokens = [];
    
    // Start new operand if needed (e.g., after an operator)
    if (this.tokens.length === 0 || this.isOperator(this.tokens[this.tokens.length -1])) {
      this.tokens.push(digit);
    }
    // Append digit to current operand (build multi-digit numbers) 
    else {
      const last = this.tokens[this.tokens.length-1];
      this.tokens[this.tokens.length-1] = last + digit;
    }
  }

  /**
   * Adds a decimal point to the current operand
   */
  appendDot(): void {
    // Start new "0.x" if needed (e.g., empty display)
    if (this.tokens.length ===0 || this.isOperator(this.tokens[this.tokens.length-1])) {
      this.tokens.push("0.");
    } 
    // Prevents adding multiple decimal points in the same number. 
    // Allows only one '.' per operand
    else {
      const last = this.tokens.slice(-1)[0];
      if (!last.includes(".")) this.tokens[this.tokens.length-1] += ".";
    }
  }

  /**
   * Adds an operator to the current expression
   * @param operator - the mathematical operator being added (+, -, ×, ÷)
   */
  setOperator(operator: string): void {
    // Start with 0 if empty
    if (this.tokens.length ===0) this.tokens = ['0', operator];
    
    // Replace existing trailing operator (e.g., changing from "+" to "×")
    if (this.isOperator(this.tokens[this.tokens.length-1])) {
      this.tokens[this.tokens.length-1] = operator;
    } else {
      this.tokens.push(operator);
    }
  }

  /**
   * Toggles the sign of current operand between positive and negative
   */
  toggleSign(): void {
    const lastToken = this.tokens[this.tokens.length-1];
    
    // Toggle the sign of current operand between positive and negative. 
    // Only applies to non-operator tokens
    if (!this.isOperator(lastToken)) {
      const value = lastToken.startsWith("-") ? 
        lastToken.slice(1) : `-${lastToken}`;
      this.tokens[this.tokens.length-1] = value;
    }
  }

  /**
   * Converts current operand to percentage (divides by 100)
   */
  percentage(): void {
    const lastToken = this.tokens[this.tokens.length-1];
    
    if (!this.isOperator(lastToken)) {
      const value = parseFloat(lastToken) / 100;
      this.tokens[this.tokens.length-1] = value.toString();
    }
  }

  /**
   * Adds parentheses to the current expression
   * @param bracket - either "(" or ")"
   */
  appendBracket(bracket: string): void {
    this.tokens.push(bracket);  
  }

  /**
   * Removes last character or token from current expression
   */
  delete(): void {
    const lastToken = this.tokens[this.tokens.length-1];
    
    if (lastToken.length > 1) {
      this.tokens[this.tokens.length-1] = lastToken.slice(0, -1);
    } else {
      this.tokens.pop();
    }
  }

  /**
   * Evaluates current mathematical expression and updates history
   */
  calculate(): void {
    if (this.tokens.length ===0) return;
    
    // Remove trailing operator
    while (this.isOperator(this.tokens[this.tokens.length-1])) this.tokens.pop();
    
    const expression = this.tokens.join('');
    
    // Replace operator symbols with valid javascript
    let jsExpression = this.replaceOperators(expression);
    
    try {
      const result = window.eval(jsExpression);
      const rounded = this.roundResult(result);
      
      // Save to history
      this.history.push({ expression, result: rounded.toString() });

      // Save history to local storage
      this.saveHistory();
      
      // Update current tokens for chaining
      this.tokens = [rounded.toString()];  
    } catch {
      // Handle errors gracefully (invalid input)
      this.tokens = ['Error'];
    }
  }

  /**
   * Clears all current tokens (resets input field)
   */
  clear(): void {
    this.tokens = [];
  }

  // ------------------- Private Helper Methods -------------------

  /**
   * Checks if a token is one of the supported operators
   * @param token - string to check against operator list
   */
  private isOperator(token: string): boolean {
    return ['+', '-', '×', '÷', '^'].includes(token);
  }

  /**
   * Converts mathematical symbols (÷, ×, ^) to JavaScript-compatible 
   * operators (/ , *, **) for evaluation
   */
  private replaceOperators(expression: string): string {
    return expression.replace(/÷/g, '/').replace(/×/g, '*').replace(/\^/g, '**');
  }

  /**
   * Rounds number to avoid floating point precision issues
   * @param num - numeric value to round
   */
  private roundResult(num: number): number {
    return parseFloat(num.toFixed(this.ROUND_DP));
  }

  /**
   * Saves the equation history to local storage
   */
  private saveHistory(): void {
    this.localStorage.setItem('equations', JSON.stringify(this.history));
  }

  /**
   * Scrolls the history container to display the latest entry at the bottom
   */
  private scrollHistoryToBottom(): void {
    if (this.historyContainer) {
      try {
        this.historyContainer.nativeElement.scrollTop = 
          this.historyContainer.nativeElement.scrollHeight;
      } catch (error) { }
    }
  }
}