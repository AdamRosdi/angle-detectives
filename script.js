/**
 * ============================================================================
 * ANGLE DETECTIVES - JAVASCRIPT CONTROLLER
 * Fully commented script for interactivity across Lab and Quiz pages.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lab logic if on lab.html page
  if (document.getElementById('angle-range')) {
    initAngleLab();
  }

  // Initialize Quiz logic if on quiz.html page
  if (document.getElementById('options-grid')) {
    initAngleQuiz();
  }
});

/* ============================================================================
   SECTION 1: ANGLE LAB INTERACTION
   ============================================================================ */

/**
 * Sets up event listeners and SVG math calculations for the Angle Lab slider.
 */
function initAngleLab() {
  const slider = document.getElementById('angle-range');
  const degDisplay = document.getElementById('angle-deg-display');
  const rotatingArm = document.getElementById('lab-rotating-arm');
  const indicatorPath = document.getElementById('lab-angle-indicator');
  const typeBadge = document.getElementById('lab-type-badge');
  const infoTitle = document.getElementById('lab-info-title');
  const infoDesc = document.getElementById('lab-info-desc');
  const presetBtns = document.querySelectorAll('.preset-btn');

  // SVG Geometry Constants
  const cx = 100; // Vertex X coordinate
  const cy = 150; // Vertex Y coordinate
  const armLength = 80;

  /**
   * Updates the lab UI according to the target angle in degrees.
   * @param {number} degrees - Angle in degrees (10 to 170)
   */
  function updateLab(degrees) {
    degDisplay.textContent = `${degrees}°`;

    // Convert angle to radians for trigonometric arm calculation
    // Base line goes from (100,150) to (180,150) -> 0 degrees is facing East (Right)
    const radians = (degrees * Math.PI) / 180;
    const armX = cx + armLength * Math.cos(radians);
    const armY = cy - armLength * Math.sin(radians); // Y axis inverted in SVG

    // Update dynamic rotating arm position
    rotatingArm.setAttribute('x2', armX.toFixed(2));
    rotatingArm.setAttribute('y2', armY.toFixed(2));

    // Determine Angle Type & Color Palette
    let angleType = '';
    let strokeColor = '';
    let badgeClass = '';
    let titleText = '';
    let descText = '';

    if (degrees === 90) {
      angleType = 'Right Angle (90°)';
      strokeColor = '#2ecc71'; // Green
      badgeClass = 'badge-green';
      titleText = '🟩 Right Angle';
      descText = 'A right angle is exactly 90 degrees. It forms a perfect square L-shape corner!';

      // Draw square indicator for Right Angle
      const sqSize = 20;
      indicatorPath.setAttribute(
        'd',
        `M ${cx + sqSize},${cy} L ${cx + sqSize},${cy - sqSize} L ${cx},${cy - sqSize}`
      );
    } else if (degrees < 90) {
      angleType = `Acute Angle (${degrees}°)`;
      strokeColor = '#3498db'; // Blue
      badgeClass = 'badge-blue';
      titleText = '🟦 Acute Angle';
      descText = 'An acute angle is smaller than 90 degrees. It is sharp and cute!';

      // Draw arc indicator for Acute Angle
      const arcR = 30;
      const arcX = cx + arcR * Math.cos(radians);
      const arcY = cy - arcR * Math.sin(radians);
      indicatorPath.setAttribute(
        'd',
        `M ${cx + arcR},${cy} A ${arcR} ${arcR} 0 0 0 ${arcX.toFixed(2)} ${arcY.toFixed(2)}`
      );
    } else {
      angleType = `Obtuse Angle (${degrees}°)`;
      strokeColor = '#f39c12'; // Orange
      badgeClass = 'badge-orange';
      titleText = '🟧 Obtuse Angle';
      descText = 'An obtuse angle is greater than 90 degrees but less than 180 degrees. It opens up wide!';

      // Draw arc indicator for Obtuse Angle
      const arcR = 30;
      const arcX = cx + arcR * Math.cos(radians);
      const arcY = cy - arcR * Math.sin(radians);
      indicatorPath.setAttribute(
        'd',
        `M ${cx + arcR},${cy} A ${arcR} ${arcR} 0 0 0 ${arcX.toFixed(2)} ${arcY.toFixed(2)}`
      );
    }

    // Update SVG elements styling
    rotatingArm.style.stroke = strokeColor;
    indicatorPath.style.stroke = strokeColor;

    // Update Badge & Explanatory Text
    typeBadge.textContent = angleType;
    typeBadge.className = `type-badge ${badgeClass}`;
    infoTitle.textContent = titleText;
    infoDesc.textContent = descText;
  }

  // Handle Range Slider Input
  slider.addEventListener('input', (e) => {
    updateLab(parseInt(e.target.value, 10));
  });

  // Handle Preset Quick Buttons
  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.getAttribute('data-angle'), 10);
      slider.value = val;
      updateLab(val);
    });
  });

  // Initial render at default 90 degrees
  updateLab(90);
}

/* ============================================================================
   SECTION 2: ANGLE QUIZ INTERACTION
   ============================================================================ */

/**
 * Helper function to shuffle an array (Fisher-Yates Shuffle).
 */
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Quiz Questions Data Set designed for Year 4 Pupils (10 questions in exact order)
 * Color Coding:
 * - Green (#2ecc71): Right Angle
 * - Blue (#3498db): Acute Angle
 * - Orange (#f39c12): Obtuse Angle
 *
 * NOTE: NO degree numbers are displayed to pupils!
 */
const quizQuestions = [
  {
    id: 1,
    title: "What type of angle is this?",
    svg: `
      <svg viewBox="0 0 200 180" class="angle-svg" aria-label="An angle diagram">
        <line x1="40" y1="140" x2="160" y2="140" stroke="#2ecc71" stroke-width="6" stroke-linecap="round" />
        <line x1="40" y1="140" x2="40" y2="20" stroke="#2ecc71" stroke-width="6" stroke-linecap="round" />
        <rect x="40" y="115" width="25" height="25" class="square-marker green-stroke" />
        <circle cx="40" cy="140" r="5" class="vertex-dot" />
      </svg>
    `,
    options: ["Right angle", "Acute angle", "Obtuse angle"],
    correctAnswer: "Right angle",
    explanation: "A right angle forms a square corner like the letter L."
  },
  {
    id: 2,
    title: "What type of angle is this?",
    svg: `
      <svg viewBox="0 0 200 180" class="angle-svg" aria-label="An angle diagram">
        <line x1="30" y1="140" x2="170" y2="140" stroke="#3498db" stroke-width="6" stroke-linecap="round" />
        <line x1="30" y1="140" x2="150" y2="20" stroke="#3498db" stroke-width="6" stroke-linecap="round" />
        <path d="M 70,140 A 40 40 0 0 0 58.28,111.72" class="arc-marker blue-stroke" />
        <circle cx="30" cy="140" r="5" class="vertex-dot" />
      </svg>
    `,
    options: ["Right angle", "Acute angle", "Obtuse angle"],
    correctAnswer: "Acute angle",
    explanation: "An acute angle is smaller than a right angle and has a sharp point."
  },
  {
    id: 3,
    title: "What type of angle is this?",
    svg: `
      <svg viewBox="0 0 200 180" class="angle-svg" aria-label="An angle diagram">
        <line x1="120" y1="140" x2="185" y2="140" stroke="#f39c12" stroke-width="6" stroke-linecap="round" />
        <line x1="120" y1="140" x2="55" y2="27.42" stroke="#f39c12" stroke-width="6" stroke-linecap="round" />
        <path d="M 160,140 A 40 40 0 0 0 100,105.36" class="arc-marker orange-stroke" />
        <circle cx="120" cy="140" r="5" class="vertex-dot" />
      </svg>
    `,
    options: ["Right angle", "Acute angle", "Obtuse angle"],
    correctAnswer: "Obtuse angle",
    explanation: "An obtuse angle is wider than a right angle."
  },
  {
    id: 4,
    title: "How many right angles does a square have?",
    svg: `
      <svg viewBox="0 0 200 180" class="angle-svg" aria-label="A square shape">
        <rect x="45" y="35" width="110" height="110" fill="rgba(46, 204, 113, 0.08)" stroke="#2c3e50" stroke-width="4" rx="2" />
        <rect x="45" y="125" width="20" height="20" class="square-marker green-stroke" />
        <rect x="135" y="125" width="20" height="20" class="square-marker green-stroke" />
        <rect x="135" y="35" width="20" height="20" class="square-marker green-stroke" />
        <rect x="45" y="35" width="20" height="20" class="square-marker green-stroke" />
      </svg>
    `,
    options: ["2", "3", "4"],
    correctAnswer: "4",
    explanation: "A square has 4 square right angles at its corners."
  },
  {
    id: 5,
    title: "True or False: A rectangle has 4 right angles.",
    svg: `
      <svg viewBox="0 0 200 180" class="angle-svg" aria-label="A rectangle shape">
        <rect x="30" y="45" width="140" height="90" fill="rgba(46, 204, 113, 0.08)" stroke="#2c3e50" stroke-width="4" rx="2" />
        <rect x="30" y="115" width="20" height="20" class="square-marker green-stroke" />
        <rect x="150" y="115" width="20" height="20" class="square-marker green-stroke" />
        <rect x="150" y="45" width="20" height="20" class="square-marker green-stroke" />
        <rect x="30" y="45" width="20" height="20" class="square-marker green-stroke" />
      </svg>
    `,
    options: ["True", "False"],
    correctAnswer: "True",
    explanation: "A rectangle has 4 square right angles at its corners."
  },
  {
    id: 6,
    title: "True or False: A triangle can have two obtuse angles.",
    svg: `
      <svg viewBox="0 0 200 180" class="angle-svg" aria-label="A triangle shape">
        <polygon points="30,140 170,140 110,40" fill="rgba(243, 156, 18, 0.08)" stroke="#2c3e50" stroke-width="4" stroke-linejoin="round" />
        <path d="M 85,140 A 25 25 0 0 0 95,115" class="arc-marker orange-stroke" />
        <path d="M 55,140 A 25 25 0 0 0 45,118" class="arc-marker blue-stroke" />
        <path d="M 145,140 A 25 25 0 0 1 156,118" class="arc-marker blue-stroke" />
      </svg>
    `,
    options: ["True", "False"],
    correctAnswer: "False",
    explanation: "A triangle can have only one obtuse angle."
  },
  {
    id: 7,
    title: "Which angles does this triangle have?",
    svg: `
      <svg viewBox="0 0 200 180" class="angle-svg" aria-label="A right-angled triangle">
        <polygon points="35,145 165,145 35,35" fill="rgba(46, 204, 113, 0.08)" stroke="#2c3e50" stroke-width="4" stroke-linejoin="round" />
        <rect x="35" y="123" width="22" height="22" class="square-marker green-stroke" />
        <path d="M 135,145 A 30 30 0 0 0 142,122" class="arc-marker blue-stroke" />
        <path d="M 35,65 A 30 30 0 0 0 53,54" class="arc-marker blue-stroke" />
      </svg>
    `,
    options: ["3 acute angles", "1 right angle and 2 acute angles", "1 obtuse angle and 2 right angles"],
    correctAnswer: "1 right angle and 2 acute angles",
    explanation: "A right-angled triangle has 1 square right angle and 2 sharp acute angles."
  },
  {
    id: 8,
    title: "What is this triangle called?",
    svg: `
      <svg viewBox="0 0 200 180" class="angle-svg" aria-label="An equilateral triangle">
        <polygon points="30,145 170,145 100,23.8" fill="rgba(52, 152, 219, 0.08)" stroke="#2c3e50" stroke-width="4" stroke-linejoin="round" />
        <path d="M 60,145 A 30 30 0 0 0 45,119" class="arc-marker blue-stroke" />
        <path d="M 140,145 A 30 30 0 0 1 155,119" class="arc-marker blue-stroke" />
        <path d="M 85,49.8 A 30 30 0 0 0 115,49.8" class="arc-marker blue-stroke" />
        <line x1="100" y1="140" x2="100" y2="150" stroke="#e74c3c" stroke-width="3" />
        <line x1="62" y1="82" x2="70" y2="90" stroke="#e74c3c" stroke-width="3" />
        <line x1="138" y1="82" x2="130" y2="90" stroke="#e74c3c" stroke-width="3" />
      </svg>
    `,
    options: ["Scalene", "Isosceles", "Equilateral"],
    correctAnswer: "Equilateral",
    explanation: "An equilateral triangle has 3 sides of equal length."
  },
  {
    id: 9,
    title: "What is this triangle called?",
    svg: `
      <svg viewBox="0 0 200 180" class="angle-svg" aria-label="An isosceles triangle">
        <polygon points="45,145 155,145 100,25" fill="rgba(52, 152, 219, 0.08)" stroke="#2c3e50" stroke-width="4" stroke-linejoin="round" />
        <path d="M 70,145 A 25 25 0 0 0 56,122" class="arc-marker blue-stroke" />
        <path d="M 130,145 A 25 25 0 0 1 144,122" class="arc-marker blue-stroke" />
        <path d="M 89,49 A 25 25 0 0 0 111,49" class="arc-marker blue-stroke" />
        <line x1="68" y1="82" x2="77" y2="88" stroke="#e74c3c" stroke-width="3" />
        <line x1="132" y1="82" x2="123" y2="88" stroke="#e74c3c" stroke-width="3" />
      </svg>
    `,
    options: ["Scalene", "Isosceles", "Equilateral"],
    correctAnswer: "Isosceles",
    explanation: "An isosceles triangle has exactly 2 sides of equal length."
  },
  {
    id: 10,
    title: "What is this triangle called?",
    svg: `
      <svg viewBox="0 0 200 180" class="angle-svg" aria-label="A scalene triangle">
        <polygon points="25,145 175,145 75,35" fill="rgba(52, 152, 219, 0.08)" stroke="#2c3e50" stroke-width="4" stroke-linejoin="round" />
        <path d="M 55,145 A 30 30 0 0 0 39,116" class="arc-marker blue-stroke" />
        <path d="M 148,145 A 30 30 0 0 1 155,122" class="arc-marker blue-stroke" />
        <path d="M 61,61 A 30 30 0 0 0 98,59" class="arc-marker blue-stroke" />
        <line x1="46" y1="86" x2="54" y2="94" stroke="#e74c3c" stroke-width="3" />
        <line x1="120" y1="86" x2="128" y2="94" stroke="#e74c3c" stroke-width="3" />
        <line x1="125" y1="81" x2="133" y2="89" stroke="#e74c3c" stroke-width="3" />
        <line x1="95" y1="140" x2="95" y2="150" stroke="#e74c3c" stroke-width="3" />
        <line x1="100" y1="140" x2="100" y2="150" stroke="#e74c3c" stroke-width="3" />
        <line x1="105" y1="140" x2="105" y2="150" stroke="#e74c3c" stroke-width="3" />
      </svg>
    `,
    options: ["Scalene", "Isosceles", "Equilateral"],
    correctAnswer: "Scalene",
    explanation: "A scalene triangle has 3 sides of different lengths."
  }
];

function initAngleQuiz() {
  let currentQuestionIndex = 0;
  let score = 0;

  const progressDisplay = document.getElementById('quiz-progress');
  const scoreDisplay = document.getElementById('quiz-score');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const questionTitle = document.getElementById('question-title');
  const quizVisualBox = document.getElementById('quiz-visual-box');
  const optionsGrid = document.getElementById('options-grid');
  const feedbackBox = document.getElementById('quiz-feedback');
  const feedbackText = document.getElementById('feedback-text');
  const nextBtn = document.getElementById('next-btn');

  const questionContainer = document.getElementById('question-container');
  const quizCompleteContainer = document.getElementById('quiz-complete');
  const finalScoreText = document.getElementById('final-score-text');
  const starRatingDisplay = document.getElementById('star-rating');
  const finalBadgeText = document.getElementById('final-badge-text');
  const restartBtn = document.getElementById('restart-quiz-btn');

  /**
   * Loads the question at currentQuestionIndex into UI.
   */
  function loadQuestion() {
    const q = quizQuestions[currentQuestionIndex];

    // Reset feedback UI
    feedbackBox.classList.add('hidden');

    // Update progress top bar & progress bar fill
    progressDisplay.textContent = `${currentQuestionIndex + 1} / ${quizQuestions.length}`;
    scoreDisplay.textContent = `${score}`;

    if (progressBarFill) {
      const percentage = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
      progressBarFill.style.width = `${percentage}%`;
    }

    // Render title and SVG visual
    questionTitle.textContent = q.title;

    if (q.svg) {
      quizVisualBox.classList.remove('hidden');
      quizVisualBox.innerHTML = q.svg;
    } else {
      quizVisualBox.classList.add('hidden');
      quizVisualBox.innerHTML = '';
    }

    // Populate option buttons (shuffled for each question)
    optionsGrid.innerHTML = '';
    const shuffledOptions = shuffleArray(q.options);

    shuffledOptions.forEach((optText) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = optText;
      btn.addEventListener('click', () => handleOptionSelect(optText, q, btn));
      optionsGrid.appendChild(btn);
    });
  }

  /**
   * Handles user option selection.
   */
  function handleOptionSelect(selectedOption, question, clickedBtn) {
    // Disable all options once answered
    const allBtns = optionsGrid.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);

    const isCorrect = (selectedOption === question.correctAnswer);

    if (isCorrect) {
      score++;
      clickedBtn.classList.add('correct');
      feedbackText.textContent = `🎉 Correct! ${question.explanation}`;
      feedbackBox.style.backgroundColor = '#dcfce7';
      feedbackText.style.color = '#166534';
    } else {
      clickedBtn.classList.add('wrong');
      // Highlight the correct answer button
      allBtns.forEach(b => {
        if (b.textContent === question.correctAnswer) {
          b.classList.add('correct');
        }
      });
      feedbackText.textContent = `💡 Not quite! ${question.explanation}`;
      feedbackBox.style.backgroundColor = '#fee2e2';
      feedbackText.style.color = '#991b1b';
    }

    // Update score
    scoreDisplay.textContent = `${score}`;

    // Show Next Button
    feedbackBox.classList.remove('hidden');
  }

  // Handle Next Question Click
  nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      loadQuestion();
    } else {
      showQuizComplete();
    }
  });

  /**
   * Displays the final results screen upon completing the quiz.
   */
  function showQuizComplete() {
    questionContainer.classList.add('hidden');
    quizCompleteContainer.classList.remove('hidden');

    finalScoreText.textContent = `${score}`;

    // Calculate star rating (out of 5 stars)
    let stars = '⭐';
    let badgeText = '🔍 Keep Practising, Junior Detective!';

    if (score === 10) {
      stars = '⭐⭐⭐⭐⭐';
      badgeText = '🏆 Master Angle Detective Badge Earned!';
    } else if (score >= 8) {
      stars = '⭐⭐⭐⭐';
      badgeText = '🌟 Senior Angle Detective Badge Earned!';
    } else if (score >= 6) {
      stars = '⭐⭐⭐';
      badgeText = '⭐ Super Detective Badge Earned!';
    } else if (score >= 4) {
      stars = '⭐⭐';
      badgeText = '🔎 Detective-in-Training Badge Earned!';
    } else {
      stars = '⭐';
      badgeText = '🔍 Junior Detective Badge! Keep Practising!';
    }

    starRatingDisplay.textContent = stars;
    finalBadgeText.textContent = badgeText;
  }

  // Restart Quiz Event
  restartBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    quizCompleteContainer.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    loadQuestion();
  });

  // Initial Quiz Load
  loadQuestion();
}
