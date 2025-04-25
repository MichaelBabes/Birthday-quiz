
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

const themeMusic = {
  "": "https://www.chosic.com/wp-content/uploads/2020/05/Raindrops.mp3",
  "dark-theme": "https://www.chosic.com/wp-content/uploads/2020/05/The-Ethereal-World.mp3",
  "bubbly-theme": "https://www.chosic.com/wp-content/uploads/2020/05/Sweet-Love.mp3"
};

function toggleNote(id) {
  const element = document.getElementById(id);
  element.classList.toggle('visible');
}

function checkPassword() {
  const input = document.getElementById('secret-password');
  if (input.value.toLowerCase() === 'ares') {
    document.getElementById('lukas-wishes').classList.add('visible');
    document.getElementById('password-prompt').classList.remove('visible');
  } else {
    alert('Wrong answer! Try again.');
  }
}

function showPasswordPrompt() {
  document.getElementById('password-prompt').classList.add('visible');
}

function updateThemeMusic() {
  const theme = document.body.className || "";
  const musicUrl = themeMusic[theme];
  const musicContainer = document.getElementById('theme-music');
  if (musicContainer) {
    musicContainer.innerHTML = `
      <audio controls autoplay loop>
        <source src="${musicUrl}" type="audio/mp3">
      </audio>
    `;
  }
}

const themeRemarks = {
  "": "Back to vanilla? How... predictably bland 🙄",
  "dark-theme": "Ooh, someone's channeling their inner Victorian poet 📚",
  "bubbly-theme": "Pink overload! My eyes! MY EYES! 🎀"
};

const correctAnswerRemarks = [
  "Look who actually got one right! 🎉",
  "Well, well, well... somebody's been paying attention! 👏",
  "Correct! Want a cookie? 🍪",
  "*slow clap* Bravo! 👏",
  "Ding ding ding! We have a winner! 🏆",
  "Not bad... for a human 😏",
  "Correct! Your thesis advisor would be proud! 📚"
];

function setTheme(theme) {
  document.body.className = theme;
  const remarkElement = document.getElementById("theme-remark");
  if (remarkElement) {
    remarkElement.textContent = themeRemarks[theme] || "";
    setTimeout(() => remarkElement.textContent = "", 3000);
  }
  updateThemeMusic();
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
    const randomRemark = correctAnswerRemarks[Math.floor(Math.random() * correctAnswerRemarks.length)];
    feedback.textContent = randomRemark;
    score++;
    setTimeout(nextQuestion, 2000);
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
    document.getElementById("quiz-container").innerHTML = `
      <h2>Quiz Complete! 🎉</h2>
      <p>You scored ${score} out of ${questions.length}!</p>
      <div class="completion-area">
        <h3>✨ Welcome to Ece's Lounge! 🎈</h3>
        <div id="theme-music"></div>
        
        <div class="note" onclick="toggleNote('birthday-note')">
          💝 Click to open: Happy Birthday Note!
        </div>
        <div id="birthday-note" class="note-container">
          Dearest Ece,<br><br>
          On this special day, we celebrate not just another year of your amazing existence, but your incredible journey through academia! May your thesis writing be as brilliant as your smile, and your research as impactful as your presence in our lives. Remember: you're not just writing a thesis, you're making history! 🌟<br><br>
          With love and admiration,<br>
          Your biggest fan 🎉
        </div>

        <div class="note" onclick="this.nextElementSibling.classList.toggle('hidden')">
          🍳 Click to open: Emergency Comfort Food Recipes
        </div>
        <div class="hidden">
          <strong>5-min Thesis Crisis Chocolate Mug Cake:</strong><br>
          4 tbsp flour, 4 tbsp sugar, 2 tbsp cocoa<br>
          1 egg, 3 tbsp milk, 3 tbsp oil<br>
          Mix & microwave for 1.5 mins. Add ice cream for extra comfort! 🍫<br><br>
          <strong>Instant Mood Lifter Hot Chocolate:</strong><br>
          2 tbsp cocoa, 2 tbsp sugar, dash of cinnamon<br>
          Hot milk, marshmallows<br>
          Mix & enjoy while editing that tough chapter! ☕
        </div>

        <div class="note" onclick="this.nextElementSibling.classList.toggle('hidden')">
          📚 Click to open: The Ultimate Thesis Survival Pack
        </div>
        <div class="hidden">
          <strong>Your Academic Survival Kit:</strong><br>
          🎯 1. Emergency coffee stash coordinates: Check the secret drawer!<br>
          🧘‍♀️ 2. Mandatory meditation breaks (every 2 hours of writing)<br>
          😴 3. Official permission slip for power naps<br>
          🧠 4. "My brain needs a reboot" free pass (valid anytime)<br>
          🤗 5. Unlimited virtual hugs subscription<br>
          📝 6. "You've got this!" reminder (use as needed)<br>
          🌈 7. Instant stress-relief dance party protocol
        </div>

        <div id="secret-area">
          <div class="note" onclick="showPasswordPrompt()">
            🔒 Luka's Wishes (Password Protected)
          </div>
          <div id="password-prompt" class="password-prompt">
            <p>Hint: What's my favourite labrador's name? 🐕</p>
            <input type="password" id="secret-password">
            <button onclick="checkPassword()">Submit</button>
          </div>
          <div id="lukas-wishes" class="note-container">
            <strong>Dear Ece,</strong><br>
            My wishes for you are as golden as a labrador's heart...<br>
            May your thesis flow as smoothly as Ares' fur,<br>
            Your ideas shine as bright as his eyes,<br>
            And your determination be as strong as his spirit.<br>
            Happy Birthday! 🎉🐕
          </div>
        </div>
      </div>`;
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
