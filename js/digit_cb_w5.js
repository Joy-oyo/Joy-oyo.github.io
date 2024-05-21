function checkTrivia() {
    const answer = document.getElementById('triviaAnswer').value.trim().toLowerCase();
    const responseElement = document.getElementById('triviaResponse');
    const correctAnswer = 'paris';
  
   if (answer === correctAnswer) {
    responseElement.textContent = `You answer is "${answer}". That's correct!`;
   } else {
    responseElement.textContent = `Your answer "${answer}". Try again!`;
   }
}
  
//triger when enter is pressed 
document.addEventListener('DOMContentLoaded', () => {
const triviaInput = document.getElementById('triviaAnswer');
triviaInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
    event.preventDefault();
    checkTrivia();
    }
 });
});
  
//check if 5 digits are legit
function checkNumber() {
    const numInput = document.getElementById('numberInput').value;
    const num = parseInt(numInput);
    const responseElement = document.getElementById('numberResponse');
  
if (!isNaN(num)&& num >= 10000 && num <= 99999) {
      const isEven = num % 2 === 0;
      responseElement.textContent = `The number ${num} is ${isEven ? 'even' : 'odd'}.`;
    } else {
      responseElement.textContent = 'Please enter a valid 5-digit number.';
    }
}
  

document.addEventListener('DOMContentLoaded', () => {
const numberInput = document.getElementById('numberInput');
numberInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    checkNumber();
  }
});
});