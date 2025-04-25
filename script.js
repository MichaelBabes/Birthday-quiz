
const questions = [
  {
    text: "Rate hitting glutes from 1 to 10",
    options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    correct: "10",
    snarks: {
      "1": "Really? But that's the only thing you're good for smh.",
      "2": "More like your GPA if you dont hit glutes more often.",
      "3": "I'm not your gym buddy after this.",
      "4": "C'mon give yourself more credit.",
      "5": "I mean, you're still sad.",
      "6": "My wittle goomba.",
      "7": "You gotta hit them glutes more often.",
      "8": "Are we still doing this.?",
      "9": "Almost 7 levels below my level of glute confidence."
    }
  },
  {
    text: "Rate these games in order from best to worst:",
    type: "sequence",
    items: ["Lethal Company", "Cult of the Lamb", "R.E.P.O", "CS2"],
    correct: ["Lethal Company", "CS2", "R.E.P.O", "Cult of the Lamb"],
    snark: "KKhm, this answer does not have enough ME in it :c."
  },
  {
    text: "Who would you share tiramisu with?",
    options: ["Mom", "Luka", "That one hot bartender","Your thesis advisor"],
    correct: "Luka",
    snarks: {
      "Mom": "I mean who's more important c'mon..",
      "That one hot bartender": "Can't argue with you there, but still wrong :D.",
      "Your thesis advisor": "Really? Over me?? Smh"
    }
  },
  {
    text: "What is Luka's most iconic trait?",
    options: ["His humility", "His overwhelming handsomeness", "His overbearing charm","His massive glutes"],
    correct: "His humility",
    snarks: {
      "His overwhelming handsomeness": "Won't argue with you there.",
      "His overbearing charm": "Aww thanks babe!",
      "His massive glutes":"You view me as a piece of meat smh.."
    }
  },
  {
    text: "Choose an emotional support item:",
    options: ["Weighted blanket", "Luka’s voice messages", "A big mug of tea"],
    correct: "Luka’s voice messages",
    snarks: {
      "Weighted blanket": "You're 24.",
      "A big mug of tea": "You'll drown."
    }
  }
];

let currentQ = 0;
let score = 0;

const backgroundAudio = new Audio("https://cdn.pixabay.com/download/audio/2024/01/02/audio_abcdef1234567890abcdef.mp3?filename=smooth-jazz-a-girl-from-near-approximately-ipanema-178711.mp3");
backgroundAudio.loop = true;
backgroundAudio.volume = 0.2; // nice and quiet

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

  if (themeAudio.src !== musicUrl) {
    themeAudio.pause();               // Stop the old song
    themeAudio.src = musicUrl;        // Update to new song
    themeAudio.volume = 0.2;          // Set volume lower
    themeAudio.play().catch(() => {
      console.log("Autoplay blocked until user interacts.");
    });
  }
}

const themeRemarks = {
  "": "Back to vanilla? How... predictably bland 🙄",
  "dark-theme": "Another sad birthday huh?",
  "bubbly-theme": "Pink overload! My eyes! MY EYES! 🎀"
};

const correctAnswerRemarks = [
  "Look who actually got one right! 🎉",
  "Well, well, well... somebody's been paying attention! 👏",
  "Correct! Want a cookie? 🍪",
  "*slow clap* Bravo! 👏",
  "Ding ding ding! We have a winner! 🏆",
  "Not bad...",
  "Correct! Your thesis advisor would be proud! 📚"
];

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

let themeAudio = new Audio();
themeAudio.loop = true;

function checkAnswer(answer) {
  const q = questions[currentQ];
  const feedback = document.getElementById("feedback");
  
  if (answer === q.correct) {
    const randomRemark = correctAnswerRemarks[Math.floor(Math.random() * correctAnswerRemarks.length)];
    feedback.textContent = randomRemark;
    feedback.classList.add('correct-answer');
    setTimeout(() => feedback.classList.remove('correct-answer'), 500);
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
            <strong>Dear Ece,</strong><br><br>
            Here's a special birthday surprise just for you: <a href="YOUR_SPECIAL_LINK_HERE" target="_blank">🎁 Click to see your special surprise! 🎁</a><br><br>
            My wishes for you shine brighter than the stars...<br>
            Each thought carefully crafted with love,<br>
            Like golden threads weaving through time.<br><br>
            Through every challenge and triumph,<br>
            Your strength never ceases to amaze.<br>
            Your laughter lights up the darkest rooms,<br>
            And your determination moves mountains.<br><br>
            [ADD YOUR PERSONAL MESSAGE HERE]<br><br>
            P.S. Remember that time when... [ADD SPECIAL MEMORY HERE]<br>
            Keep being amazing!<br><br>
            With love,<br>
            Luka 🎉🐕
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

window.addEventListener("load", () => {
  backgroundAudio.play().catch(() => {
    // If autoplay is blocked, you could show a play button or leave it muted
    console.log("Autoplay blocked. User interaction required.");
  });
});
loadQuestion();

