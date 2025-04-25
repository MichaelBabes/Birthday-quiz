const questions = [
  {
    text: "What's 2+2?",
    options: ["3", "4", "5"],
    correct: "4",
    snarks: {
      "3": "Math isn't your strong suit, huh?",
      "5": "Getting ahead of yourself there!"
    }
  },
  {
    text: "Which came first?",
    type: "sequence",
    items: ["Dinosaurs", "Pyramids", "Internet"],
    correct: ["Dinosaurs", "Pyramids", "Internet"],
    snark: "Time isn't that complicated... or is it?"
  },
  {
    text: "What's the capital of France?",
    options: ["London", "Berlin", "Paris"],
    correct: "Paris",
    snarks: {
      "London": "Wrong country, but A for effort!",
      "Berlin": "Geography isn't your thing, is it?"
    }
  },
  {
    text: "Complete the sequence: 2, 4, 8, __",
    options: ["10", "16", "12"],
    correct: "16",
    snarks: {
      "10": "Think exponentially!",
      "12": "Close, but no cigar!"
    }
  },
  {
    text: "Which planet is closest to the Sun?",
    options: ["Venus", "Mercury", "Mars"],
    correct: "Mercury",
    snarks: {
      "Venus": "Hot take, but wrong!",
      "Mars": "Not even close!"
    }
  }
];

let currentQ = 0;
let score = 0;

const themeRemarks = {
  "": "Back to boring, I see...",
  "dark-theme": "Ah, feeling edgy today?",
  "bubbly-theme": "Really? I guess it's a sad birthday all over again..."
};

function setTheme(theme) {
  document.body.className = theme;
  const remarkElement = document.getElementById("theme-remark");
  if (remarkElement) {
    remarkElement.textContent = themeRemarks[theme] || "";
    setTimeout(() => remarkElement.textContent = "", 3000);
  }
}

function loadQuestion() {
  const q = questions[currentQ];
  const container = document.getElementById("quiz-container");
  
  if (q.type === "sequence") {
    container.innerHTML = `
      <h2>Question ${currentQ + 1}: ${q.text}</h2>
      <div id="sequence-items"></div>
      <button onclick="checkSequence()">Check Order</button>
      <p id="feedback"></p>
    `;
    
    const itemsDiv = document.getElementById("sequence-items");
    const shuffled = [...q.items].sort(() => Math.random() - 0.5);
    shuffled.forEach(item => {
      const div = document.createElement("div");
      div.className = "sequence-item";
      div.draggable = true;
      div.textContent = item;
      itemsDiv.appendChild(div);
    });
    
    setupDragAndDrop();
  } else {
    container.innerHTML = `
      <h2>Question ${currentQ + 1}: ${q.text}</h2>
      <div id="answers"></div>
      <p id="feedback"></p>
    `;
    
    const answersDiv = document.getElementById("answers");
    q.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.onclick = () => checkAnswer(opt);
      answersDiv.appendChild(btn);
    });
  }
}

function checkAnswer(answer) {
  const q = questions[currentQ];
  const feedback = document.getElementById("feedback");
  
  if (answer === q.correct) {
    feedback.textContent = "Correct! 🎉";
    score++;
    setTimeout(nextQuestion, 1000);
  } else {
    feedback.textContent = q.snarks[answer] || "Nope, try again!";
  }
}

function checkSequence() {
  const items = Array.from(document.querySelectorAll('.sequence-item')).map(i => i.textContent);
  const q = questions[currentQ];
  const feedback = document.getElementById("feedback");
  
  if (JSON.stringify(items) === JSON.stringify(q.correct)) {
    feedback.textContent = "Perfect sequence! 🎉";
    score++;
    setTimeout(nextQuestion, 1000);
  } else {
    feedback.textContent = q.snark;
  }
}

function nextQuestion() {
  currentQ++;
  if (currentQ >= questions.length) {
    document.getElementById("quiz-container").innerHTML = 
      `<h2>Quiz Complete! 🎉</h2>
       <p>You scored ${score} out of ${questions.length}!</p>`;
  } else {
    loadQuestion();
  }
}

function setupDragAndDrop() {
  const items = document.querySelectorAll('.sequence-item');
  items.forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('drop', handleDrop);
  });
}

function handleDragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.textContent);
  e.target.classList.add('dragging');
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  const dragged = document.querySelector('.dragging');
  const target = e.target;
  
  if (dragged && target.classList.contains('sequence-item')) {
    const temp = target.textContent;
    target.textContent = dragged.textContent;
    dragged.textContent = temp;
  }
  
  dragged.classList.remove('dragging');
}

loadQuestion();
