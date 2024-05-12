// Select elements and initialize state
const display = document.getElementById('inputBox');
const buttons = document.querySelectorAll('button');
let expression = '';
let lastButtonWasEquals = false; // New boolean state to track last button press

// Attach click event listeners to all buttons
buttons.forEach(btn => {
    btn.addEventListener('click', handleButtonClick);
});

// Handle button click events
function handleButtonClick(e) {
    const buttonText = e.target.innerHTML;

    switch (buttonText) {
        case 'DEL':
            expression = expression.slice(0, -1);
            break;
        case 'AC':
            expression = '';
            break;
        case '=':
            evaluateExpression();
            lastButtonWasEquals = true; // Set the flag
            break;
        default:
            if (lastButtonWasEquals && !isOperator(buttonText)) {
                // Clear expression if the last button pressed was '=' and the new input is a number
                expression = '';
                lastButtonWasEquals = false; // Reset the flag only if appending a number
            } else if (lastButtonWasEquals && isOperator(buttonText)) {
                // If an operator is pressed after '=', reset the flag
                lastButtonWasEquals = false;
            }

            if (isOperator(buttonText) && isOperator(expression.slice(-1))) {
                // Replace the last operator if the new one is pressed
                expression = expression.slice(0, -1) + buttonText;
            } else {
                expression += buttonText;
            }
            break;
    }

    updateDisplay();
}

function evaluateExpression() {
    try {
        const result = safeEval(expression);
        expression = result.toString();
    } catch (error) {
        expression = 'Error';
    }
    updateDisplay();

    lastButtonWasEquals = false; // Reset the flag after evaluation
}

// Update the display with the current expression
function updateDisplay() {
    display.value = expression;
}

// Check if a character is an operator
function isOperator(char) {
    return ['+', '-', '*', '/', '%'].includes(char);
}

function safeEval(exp) {
    const tokens = exp.match(/(\d+\.\d+|\d+|[+\-*/%])/g) || [];

    const stack = [];
    let currentOperator = null;

    tokens.forEach(token => {
        if (isOperator(token)) {
            currentOperator = token;
        } else {
            const num = parseFloat(token);
            if (!isNaN(num)) {
                if (currentOperator === null) {
                    stack.push(num);
                } else {
                    const prevNum = stack.pop();
                    switch (currentOperator) {
                        case '+':
                            stack.push(prevNum + num);
                            break;
                        case '-':
                            stack.push(prevNum - num);
                            break;
                        case '*':
                            stack.push(prevNum * num);
                            break;
                        case '/':
                            if (num === 0) throw new Error('Division by zero');
                            stack.push(prevNum / num);
                            break;
                        case '%':
                            stack.push(prevNum % num);
                            break;
                    }
                    currentOperator = null;
                }
            }
        }
    });

    if (stack.length !== 1) throw new Error('Invalid expression');
    return stack.pop();
}
