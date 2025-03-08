import { Component, input } from '@angular/core';

@Component({
  selector: 'app-calculator',
  imports: [],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent {
  // The text shown in the calculator display.
  displayValue = '0';

  // Holds the first operand in any operation.
  private firstOperand: number | null = null;

  // Holds the current operator
  private operator: string | null = null;
  
  // Flag to indicate if we should start a new opearnd entry.
  private waitingForSecondOperand = false;

  /** 
   * Append a digit (0-9) to the display. 
   */
  appendDigit(digit: string): void {
    if (this.waitingForSecondOperand) {
      // Start a new number
      this.displayValue = digit;
      this.waitingForSecondOperand = false;
    } 
    else {
      // Avoid multiple leading zeros
      this.displayValue = this.displayValue === '0' ? digit: this.displayValue + digit;
    }
  }

  /** 
   * Append a decimal point if not already present. 
   */
  appendDot(): void {
    if (this.waitingForSecondOperand) {
      this.displayValue = '0';
      this.waitingForSecondOperand = false;
      return;
    }
    if (!this.displayValue.includes('.')) {
      this.displayValue += '.';
    }
  }

  /** 
   * Clear the current entry and reset state 
   */
  clear(): void {
    this.displayValue = '0';
    this.firstOperand = null;
    this.operator = null;
    this.waitingForSecondOperand = false;
  }

  /** 
   * Toggle the sign of the current display value 
   */
  toggleSign(): void {
    if (this.displayValue !== '0') {
      // Toggle the sign
      const toggled = (parseFloat(this.displayValue) * -1).toString();
      this.displayValue = toggled;

      // If we're still working with the first operand, update it.
      if (!this.waitingForSecondOperand) {
        this.firstOperand = parseFloat(toggled);
      }
    }
  }

  /** 
   * Convert the current display value to a percentage 
   */
  percentage(): void {
    this.displayValue = (parseFloat(this.displayValue) / 100).toString();
  }

  /**
   * Set the operator and prepare to receive the second operand.
   * If an operator already exists, perform the calculation first.
   */
  setOperator(nextOperator: string): void {
    const inputValue = parseFloat(this.displayValue);

    if (this.firstOperand === null) {
      this.firstOperand = inputValue;
    } 
    else if (this.operator && !this.waitingForSecondOperand) {
      const result = this.performCalculation(this.operator, this.firstOperand, inputValue);
      this.displayValue = String(result);
      this.firstOperand = result;
    }

    this.operator = nextOperator;
    this.waitingForSecondOperand = true;
  }

  /** 
   * Perform the calculation when the equals buttin is pressed. 
   */
  calculate(): void {
    if (this.operator && this.firstOperand !== null && !this.waitingForSecondOperand) {
      const inputValue = parseFloat(this.displayValue);
      const result = this.performCalculation(this.operator, this.firstOperand, inputValue);
      this.displayValue = String(result);
      
      // Reset operator so that further operations can start afresh.
      this.firstOperand = result;
      this.operator = null;
    }
  }

  /** 
   * A helper function to perform arithmetic operations 
   */
  performCalculation(operator: string, firstOperand: number, secondOperand: number): number {
    switch (operator) {
      case '+': return firstOperand + secondOperand;
      case '-': return firstOperand - secondOperand;
      case '×': return firstOperand * secondOperand;
      case '÷': return secondOperand !== 0 ? firstOperand / secondOperand : NaN;
      default: return secondOperand;
    }
  }

}
