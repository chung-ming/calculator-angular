# Calculator App in Angular

A clean and intuitive calculator built with Angular, offering real-time calculations and equation history tracking.

---

## Demo 🎬
![Calculator Demo](/docs/img/Screenshot-1.png)
![Calculator Demo](/docs/img/Screenshot-2.png)
![Calculator Demo](/docs/img/Screenshot-3.png)

---

## Features ✨
- **Real-Time Calculations**: See intermediate results displayed as you type (e.g., typing `3+5` shows `8` instantly).
- **Equation History Tracking**: Past calculations are saved and displayed above your current input for easy reference.
- **Advanced Math Support**: Handles multiplication (×), division (÷), exponents (^), and percentages (%).
- **Dark Mode UI**: Sleek black background with contrasting text for visibility.  
- **Error Handling**: Gracefully displays "Error" for invalid inputs (e.g., dividing by zero).
- **Clear All Confirmation**: Prevents accidental deletion of history with a confirmation dialog.

---

## How to Use 🕹️
### Basic Operations  
- **Number Buttons**: Tap digits and operators (+, -, ×, ÷, ^) to build expressions.
- **AC Button**: Clears the current input (tokens).
- **Trash Icon**: Opens a confirmation dialog to delete all history.
- **Backspace Icon**: Deletes the last character/operation.

### Advanced Features
- **Parentheses**: Use `(` and `)` for order of operations (e.g., `(3+2)×4`).
- **Exponents**: Tap `^` for powers (e.g., `2^3 = 8`).
- **Percentage**: Tap `%` to convert numbers (e.g., `50×20% = 10`).

### History  
- Past calculations are saved automatically and displayed above the input field.
- Swipe or scroll to see older entries in the history panel.

---

## Installation 🚀
1. **Prerequisites**: Ensure you have [Node.js](https://nodejs.org/) and Angular CLI installed.
   ```bash
   npm install -g @angular/cli
   ```

2. **Clone the Repository**:
   ```bash
   git clone https://github.com/chung-ming/calculator-angular.git
   cd calculator-app  
   ```  

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Start the Application**:
   ```bash
   ng serve -o
   ```
   Open your browser and navigate to `http://localhost:4200/`.

---

## Technical Details ⚙️
- **Tech Stack**: Built with **Angular (TypeScript)** for logic, **HTML5/CSS3** for structure and styling.

### Key Components
1. **`calculator.component.ts` (The Brain)**
   - Parses user input into mathematical tokens (numbers/operators).
   - Converts symbols like `×` → `*`, `^` → `**`, and `÷` → `/` for JavaScript compatibility.
   - Safely evaluates expressions using **`eval()`** after rigorous cleaning (e.g., removing trailing operators, error handling).
   - Tracks calculation history using **LocalStorage** to persist data across sessions.

2. **`calculator.component.html` (The Interface)**
   - Design: Responsive grid layout with 5×5 buttons, live result display, and scrolling history.
   - Dynamic updates: Shows input in real-time, highlights errors, and displays historical calculations above the live feed.
   - Includes a confirmation dialog for deleting all history (user-friendly safety check).

3. **`calculator.component.css` (The Look)**
   - Clean, dark theme design with rounded buttons and intuitive spacing.
   - Icons for trash/backspace buttons add visual clarity.
   - Scrolling history window ensures long calculations stay accessible without cluttering the UI.

### Security & Safety Notes
- **`eval()` is used but isolated**—only processes sanitized input (no arbitrary code execution).
- **LocalStorage** ensures history stays between sessions but is reset only via user action.

### How It Works
1. You press buttons → **HTML** notifies **TypeScript** via event handlers.
2. TypeScript updates the display, checks validity of inputs (e.g., disallowing trailing `+`), and shows results.
3. CSS ensures everything **looks good** while keeping the focus on usability.

This separation of concerns keeps logic, presentation, and interactivity neatly organized! 💡

---

## Contributing 🤝
Feel free to fork and improve the app!
1. Fork the repository and create a new branch: `git checkout -b feature/your-feature`.
2. Make your changes and commit them.
3. Push to the branch: `git push origin feature/your-feature`.
4. Open a pull request against the main branch.

---

## License 📄
[Apache License](/docs/LICENSE) © 2025 Arielyte

--- 