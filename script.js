
const quotes = {
  easy:[
    "The sun rises every morning with new hope.",
    "Typing fast takes practice and patience.",
    "Music makes every moment feel magical."
  ],
  medium:[
    "JavaScript allows developers to build interactive websites with smooth animations and dynamic features.",
    "A good user interface should feel simple playful responsive and enjoyable for everyone."
  ],
  hard:[
    "Programming challenges improve logical thinking, debugging skills, problem-solving abilities, and coding confidence dramatically.",
    "Creative developers combine animations, responsive layouts, accessibility, and optimized performance into beautiful experiences."
  ]
};

const quoteElement = document.getElementById("quote");
const inputElement = document.getElementById("input");
const timerElement = document.getElementById("time");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const mistakesElement = document.getElementById("mistakes");
const historyElement = document.getElementById("history");

const difficultySelect = document.getElementById("difficulty");
const timerSelect = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");

let currentQuote = "";
let mistakes = 0;
let timer = null;
let timeLeft = 60;
let totalTyped = 0;
let started = false;

function getRandomQuote(){
  const level = difficultySelect.value;
  const arr = quotes[level];
  return arr[Math.floor(Math.random()*arr.length)];
}

function renderQuote(){
  currentQuote = getRandomQuote();
  quoteElement.innerHTML = "";

  currentQuote.split("").forEach(char=>{
    const span = document.createElement("span");
    span.innerText = char;
    quoteElement.appendChild(span);
  });
}

function startTimer(){
  timer = setInterval(()=>{
    timeLeft--;
    timerElement.innerText = timeLeft;

    calculateStats();

    if(timeLeft <= 0){
      clearInterval(timer);
      inputElement.disabled = true;
      saveHistory();
      alert("⏰ Time's up!");
    }
  },1000);
}

function calculateStats(){
  const words = inputElement.value.trim().split(/\s+/).length;
  const minutes = (parseInt(timerSelect.value) - timeLeft) / 60;

  let wpm = 0;

  if(minutes > 0){
    wpm = Math.round(words / minutes);
  }

  let accuracy = 100;

  if(totalTyped > 0){
    accuracy = Math.round(((totalTyped - mistakes)/totalTyped)*100);
  }

  wpmElement.innerText = wpm;
  accuracyElement.innerText = accuracy + "%";
  mistakesElement.innerText = mistakes;
}

inputElement.addEventListener("input", ()=>{

  if(!started){
    started = true;
    startTimer();
  }

  const quoteChars = quoteElement.querySelectorAll("span");
  const typedChars = inputElement.value.split("");

  mistakes = 0;
  totalTyped = typedChars.length;

  quoteChars.forEach((char,index)=>{
    const typedChar = typedChars[index];

    char.classList.remove("correct","incorrect","current");

    if(typedChar == null){
      char.classList.add("current");
    }
    else if(typedChar === char.innerText){
      char.classList.add("correct");
    }
    else{
      char.classList.add("incorrect");
      mistakes++;
    }
  });

  calculateStats();
});

function restartGame(){
  clearInterval(timer);

  started = false;
  mistakes = 0;
  totalTyped = 0;

  timeLeft = parseInt(timerSelect.value);

  timerElement.innerText = timeLeft;
  wpmElement.innerText = "0";
  accuracyElement.innerText = "100%";
  mistakesElement.innerText = "0";

  inputElement.value = "";
  inputElement.disabled = false;

  renderQuote();
}

function saveHistory(){
  const score = {
    wpm:wpmElement.innerText,
    accuracy:accuracyElement.innerText,
    difficulty:difficultySelect.value,
    date:new Date().toLocaleDateString()
  };

  let history = JSON.parse(localStorage.getItem("typerushHistory")) || [];
  history.unshift(score);

  history = history.slice(0,5);

  localStorage.setItem("typerushHistory",JSON.stringify(history));

  loadHistory();
}

function loadHistory(){
  let history = JSON.parse(localStorage.getItem("typerushHistory")) || [];

  historyElement.innerHTML = "";

  history.forEach(item=>{
    const li = document.createElement("li");

    li.innerHTML = `
      ⚡ ${item.wpm} WPM |
      🎯 ${item.accuracy} |
      🧠 ${item.difficulty} |
      📅 ${item.date}
    `;

    historyElement.appendChild(li);
  });
}

restartBtn.addEventListener("click", restartGame);
timerSelect.addEventListener("change", restartGame);
difficultySelect.addEventListener("change", restartGame);

restartGame();
loadHistory();
