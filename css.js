const questions = [
  {
    text: "What's Mal's favorite drink?",
    options: ["Tea", "Coffee", "Matcha"],
    correct: "Matcha",
    snarks: {
      "Tea": "Good guess, but she's not *that* British.",
      "Coffee": "Too chaotic. Try again."
    }
  },
  {
    text: "What's her thesis about?",
    options: ["AI", "Linguistics", "Witchcraft"],
    correct: "Linguistics",
    snarks: {
      "AI": "She's smart, but that's not it.",
      "Witchcraft": "Tempting... but no. Probably."
    }
  }
];

let currentQ = 0;

function setTheme(theme) {
  document.body.className = theme;
}

function loadQuestion() {
  const q = questions[currentQ];
  document.getElementById("question").textContent = `Question ${currentQ + 1}: ${q.text}`;

  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(opt);
    answersDiv.appendChild(btn);
  });

  document.getElementById("feedback").textContent = "";
  document.getElementById("next-btn").style.display = "none";
}

function checkAnswer(answer) {
  const q = questions[currentQ];
  const feedback = document.getElementById("feedback");

  if (answer === q.correct) {
    feedback.textContent = "Correct! 🎉";
    document.getElementById("next-btn").style.display = "inline";
  } else {
    feedback.textContent = q.snarks[answer] || "Nope. Try again!";
  }
}

function nextQuestion() {
  currentQ++;
  if (currentQ >= questions.length) {
    document.getElementById("quiz-container").innerHTML = "<h2>You did it! 🎁</h2><p>Your surprise is at the end... or is it?</p>";
  } else {
    loadQuestion();
  }
}

loadQuestion();
