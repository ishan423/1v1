const problemTextElement = document.getElementById('problem-text');
const codeAreaElement = document.getElementById('code-area');
const timerElement = document.getElementById('timer');
const submitButton = document.getElementById('submit-button');
const timestampElement = document.getElementById('timestamp');

let startTime;
let intervalId;
let totalTime = 60 * 60 * 1000; // One hour in milliseconds

function startTimer() {
  startTime = new Date();
  intervalId = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const now = new Date();
  const elapsedTime = now - startTime;
  const remainingTime = totalTime - elapsedTime;

  if (remainingTime <= 0) {
    clearInterval(intervalId);
    timerElement.textContent = '00:00';
    alert('Time is up! Please submit your code.');
  } else {
    const hours = Math.floor((remainingTime / (60 * 60 * 1000)) % 24);
    const minutes = Math.floor((remainingTime / (60 * 1000)) % 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);

    timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Load problem data from JSON file (replace with your actual path)
fetch('problems.json')
  .then(response => response.json())
  .then(data => {
    problemTextElement.textContent = data.problem;
  })
  .catch(error => {
    // console.error('Error loading problem data:', error);
    problemTextElement.textContent = 'Error loading problem';
  });

submitButton.addEventListener('click', () => {
  const code = codeAreaElement.value;
  const timestamp = new Date().toISOString();

  // Simulate code submission (replace with your actual submission logic)
  console.log('Submitted code:', code);
  console.log('Timestamp:', timestamp);

  timestampElement.textContent = `Code submitted at: ${timestamp}`;
});