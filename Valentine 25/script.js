
const wrapper = document.querySelector(".wrapper");
const question = document.querySelector(".question");
const gif = document.querySelector(".gif");
const yesBtn = document.querySelector(".yes-btn");
const noBtn = document.querySelector(".no-btn");
const newYesBtn = document.querySelector(".new-yes-btn");
const neoBtn = document.querySelector(".neo-btn");
const chatContainer = document.querySelector(".chat-container");
const chatBox = document.querySelector(".chat-box");
const submitBtn = document.querySelector(".submit-btn");
const backArrow = document.querySelector(".back-arrow");
const gameScreen = document.querySelector(".game-screen");
const consoleText = document.querySelector(".console-text");
const bossContainer = document.querySelector(".boss-container");
const loginScreen = document.querySelector(".login-screen");
const nameInput = document.querySelector(".name-input");
const nameSubmit = document.querySelector(".name-submit");

// Game State
let currentQuestionType = null;
let fireballCount = 0;
let countdownInterval;

// Constants just in case i reneed it
const YES_QUESTION = "Solve \\(\\displaystyle\\int_{0}^{\\frac{\\pi}{3}} \\frac{\\sin x}{\\cos x} dx\\)";
const NO_QUESTION = `Which mathematician's series solves \\(\\displaystyle\\int_{1}^{2} \\frac{\\cos x}{x} dx\\)?`;
const SECRET_NAME = "her name";
const BOSS_HIT_THRESHOLD = 23;
const TIMER_DURATION = 20;

const catArt = `
              /| _ ╱|、  
             ( •̀ㅅ •́  )
       ＿ノ ヽ ノ＼＿ 
    /　\`/ ⌒Ｙ⌒ Ｙ　 \\
 ( 　(三ヽ人　 /　 　|
|　ﾉ⌒＼ ￣￣ヽ　 ノ
ヽ＿＿＿＞､＿＿／
          ｜( 王 ﾉ〈 
           /ﾐ\`ー―彡\\ 
          |╰          ╯|   
          |       /\\       |
          |      /  \\      |                    
          |    /     \\     |`.replace(/ /g, '\u00A0');

// Initial Setup
initializeApp();

function initializeApp() {
  wrapper.style.display = 'none';
  gameScreen.style.display = 'none';
  setupEventListeners();
}

function setupEventListeners() {
  nameSubmit.addEventListener("click", verifyName);
  nameInput.addEventListener("keypress", e => e.key === "Enter" && verifyName());
  
  noBtn.addEventListener("click", handleNoButton);
  yesBtn.addEventListener("click", handleYesButton);
  newYesBtn.addEventListener("click", () => setQuestion(YES_QUESTION, 'yes'));
  neoBtn.addEventListener("click", () => setQuestion(NO_QUESTION, 'no'));
  submitBtn.addEventListener("click", handleAnswerSubmit);
  backArrow.addEventListener("click", resetToPhase2);
  noBtn.addEventListener("mouseover", () => moveButtonRandomly(noBtn));
  neoBtn.addEventListener("mouseover", () => moveButtonRandomly(neoBtn));
}

function verifyName() {
  const inputName = nameInput.value.trim().toLowerCase();
  
  if (inputName === SECRET_NAME) {
    loginScreen.style.display = 'none';
    wrapper.style.display = 'block';
  } else {
    document.body.style.backgroundColor = 'red';
    nameInput.classList.add('shake');
    setTimeout(() => {
      document.body.style.backgroundColor = 'white';
      nameInput.classList.remove('shake');
    }, 500);
  }
}

function handleNoButton() {
  if (++yesBtnClickCount >= 10) {
    question.innerHTML = "So much dedication respect that ";
    gif.src = "https://media.giphy.com/media/VpW0LoWNwGIgo7fams/giphy.gif";
    hideAllButtons();
  }
}

function handleYesButton() {
  question.innerHTML = "Liar, I know you do";
  gif.src = "https://media.giphy.com/media/9pDxWePiOBexqOs72z/giphy.gif";
  hideButtons(yesBtn, noBtn);
  showButtons(newYesBtn, neoBtn);
}

function handleAnswerSubmit() {
  const answer = chatBox.value.trim().toLowerCase();
  let correct = false;

  if (currentQuestionType === 'yes') {
    correct = answer.match(/ln2?\(?2\)?/i);
    if (correct) startMinigameSequence();
  } else if (currentQuestionType === 'no') {
    correct = answer.includes('taylor');
    if (correct) showCorrectAnswer("now ain't that kinda", "https://media.giphy.com/media/hbOgjMOUfLdWV2Ty1j/giphy.gif");
  }

  if (!correct) showWrongAnswer();
}


function startMinigameSequence() {
  resetUI();
  createExplosion(wrapper.offsetWidth/2, wrapper.offsetHeight/2);
  setTimeout(() => {
    wrapper.style.display = 'none';
    gameScreen.style.display = 'block';
    typeTextSequence([
      "well well well being my valentine?",
      "now you have magic by clicking",
      "you'll have to beat this boss"
    ], startBossFight);
  }, 500);
}

function typeTextSequence(messages, finalCallback) {
  let messageIndex = 0;
  
  function processNext() {
    if (messageIndex >= messages.length) return finalCallback();
    
    typeText(messages[messageIndex++], () => {
      setTimeout(processNext, 500);
    });
  }
  
  processNext();
}
function typeText(message, callback) {
  let currentIndex = 0;
  const letters = 'abcdefghijklm';
  
  function typeNext() {
    if (currentIndex >= message.length) return callback();
    
    
    const cycleInterval = setInterval(() => {
      const randomChar = letters[Math.floor(Math.random() * letters.length)];
      consoleText.textContent = message.slice(0, currentIndex) + randomChar;
    }, 20);

    setTimeout(() => {
      clearInterval(cycleInterval);
      consoleText.textContent = message.slice(0, ++currentIndex);
      
      setTimeout(typeNext, message[currentIndex-1] === ' ' ? 20 : 50); // Was 50/100
    }, 300); 
  }
  
  typeNext();
}


function startBossFight() {
  bossContainer.innerHTML = catArt;
  bossContainer.style.left = "70%";
  fireballCount = 0;
  gameScreen.addEventListener('click', shootFireball);
  startCountdown();
}

function shootFireball(e) {
  const fireball = createFireball(e.clientX, e.clientY);
  gameScreen.appendChild(fireball);
  animateFireball(fireball, calculateTargetPosition());
}

function createFireball(x, y) {
  const fireball = document.createElement('div');
  fireball.className = 'fireball';
  fireball.textContent = '☄️';
  fireball.style.left = `${x}px`;
  fireball.style.top = `${y}px`;
  return fireball;
}

function calculateTargetPosition() {
  const bossRect = bossContainer.getBoundingClientRect();
  return {
    x: bossRect.left + bossRect.width/2,
    y: bossRect.top + bossRect.height/2
  };
}

function animateFireball(fireball, target) {
  requestAnimationFrame(() => {
    fireball.style.left = `${target.x}px`;
    fireball.style.top = `${target.y}px`;
    setTimeout(() => {
      fireball.remove();
      checkBossHit(target);
    }, 500);
  });
}

function checkBossHit(target) {
  const bossCenter = getBossCenter();
  const distance = Math.hypot(target.x - bossCenter.x, target.y - bossCenter.y);
  
  if (distance < 100 && ++fireballCount >= BOSS_HIT_THRESHOLD) {
    endBossFight(true);
  }
}

function getBossCenter() {
  const rect = bossContainer.getBoundingClientRect();
  return {
    x: rect.left + rect.width/2,
    y: rect.top + rect.height/2
  };
}

// Game Management
function startCountdown() {
  let timeLeft = TIMER_DURATION;
  const timerElement = document.querySelector('.timer');
  timerElement.style.display = 'block';
  timerElement.textContent = timeLeft;

  countdownInterval = setInterval(() => {
    timerElement.textContent = --timeLeft;
    if (timeLeft <= 0) endBossFight(false);
  }, 1000);
}

function endBossFight(success) {
  clearInterval(countdownInterval);
  document.querySelector('.timer').style.display = 'none';
  createExplosion(getBossCenter().x, getBossCenter().y);

  setTimeout(() => {
    gameScreen.style.display = 'none';
    if (success) {
      showSuccessEnding();
    } else {
      showFailureEnding();
    }
    resetBossPosition();
  }, 1000);
}

function showSuccessEnding() {
  wrapper.style.display = 'block';
  question.innerHTML = "Nice I've got a valentine";
  gif.src = "https://media.giphy.com/media/qlAPmI5m92Lo1cial8/giphy.gif";
  resetUI();
}

function showFailureEnding() {
  document.querySelector('.failure-message').style.display = 'block';
  setTimeout(() => {
    wrapper.style.display = 'block';
    question.innerHTML = "heard breaking";
    gif.src = "https://media.giphy.com/media/hbOgjMOUfLdWV2Ty1j/giphy.gif";
    document.querySelector('.failure-message').style.display = 'none';
    resetUI();
  }, 2000);
}

// Helper Functions
function resetUI() {
  chatContainer.style.display = "none";
  backArrow.style.display = "none";
  hideAllButtons();
}

function resetBossPosition() {
  bossContainer.style.left = "20%";
}

function createExplosion(x, y) {
  const explosion = document.createElement('div');
  explosion.className = 'explosion';
  explosion.style.left = `${x}px`;
  explosion.style.top = `${y}px`;
  gameScreen.appendChild(explosion);
  setTimeout(() => explosion.remove(), 500);
}

function setQuestion(questionText, questionType) {
  question.innerHTML = questionText;
  currentQuestionType = questionType;
  hideAllButtons();
  chatContainer.style.display = "flex";
  backArrow.style.display = "block";
  chatBox.value = '';
  MathJax.typesetPromise();
}

function showCorrectAnswer(message, gifUrl) {
  question.innerHTML = message;
  gif.src = gifUrl;
  resetUI();
}

function showWrongAnswer() {
  question.style.color = "red";
  question.innerHTML = "WRONG";
  setTimeout(() => {
    question.style.color = "#e94d58";
    question.innerHTML = currentQuestionType === 'yes' ? YES_QUESTION : NO_QUESTION;
    MathJax.typesetPromise();
  }, 1000);
}

function hideButtons(...buttons) {
  buttons.forEach(button => button.style.display = "none");
}

function showButtons(...buttons) {
  buttons.forEach(button => button.style.display = "inline-block");
}

function hideAllButtons() {
  hideButtons(yesBtn, noBtn, newYesBtn, neoBtn);
}

function moveButtonRandomly(button) {
  const rect = button.getBoundingClientRect();
  button.style.transform = `translate(
    ${Math.random() * (screenWidth - rect.width)}px,
    ${Math.random() * (screenHeight - rect.height)}px
  )`;
}

function resetToPhase2() {
  resetUI();
  question.innerHTML = "Liar, I know you do";
  gif.src = "https://media.giphy.com/media/9pDxWePiOBexqOs72z/giphy.gif";
  showButtons(newYesBtn, neoBtn);
  MathJax.typesetPromise();
}
