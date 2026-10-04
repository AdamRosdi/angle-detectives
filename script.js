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
 * Quiz Questions Data Set designed for Year 4 Pupils
 */
const quizQuestions = [
  {
    id: 1,
    title: "Case #1: What type of angle is this?",
    degrees: 90,
    options: ["Acute Angle", "Right Angle", "Obtuse Angle"],
    correctAnswer: "Right Angle",
    explanation: "Spot on! An angle of exactly 90° with a square corner is a Right Angle!"
  },
  {
    id: 2,
    title: "Case #2: Identify this sharp angle!",
    degrees: 45,
    options: ["Right Angle", "Acute Angle", "Obtuse Angle"],
    correctAnswer: "Acute Angle",
    explanation: "Great job! 45° is smaller than 90°, so it is an Acute Angle!"
  },
  {
    id: 3,
    title: "Case #3: Look at this wide angle!",
    degrees: 135,
    options: ["Obtuse Angle", "Acute Angle", "Right Angle"],
    correctAnswer: "Obtuse Angle",
    explanation: "Awesome detective work! 135° is wider than 90°, making it an Obtuse Angle!"
  },
  {
    id: 4,
    title: "Case #4: What type of angle is 70°?",
    degrees: 70,
    options: ["Right Angle", "Obtuse Angle", "Acute Angle"],
    correctAnswer: "Acute Angle",
    explanation: "Correct! Any angle smaller than 90° is an Acute Angle!"
  },
  {
    id: 5,
    title: "Case #5: What type of angle is 110°?",
    degrees: 110,
    options: ["Obtuse Angle", "Right Angle", "Acute Angle"],
    correctAnswer: "Obtuse Angle",
    explanation: "You solved it! 110° is larger than 90°, so it is an Obtuse Angle!"
  }
];

function initAngleQuiz() {
  let currentQuestionIndex = 0;
  let score = 0;

  const progressDisplay = document.getElementById('quiz-progress');
  const scoreDisplay = document.getElementById('quiz-score');
  const questionTitle = document.getElementById('question-title');
  const quizVisualBox = document.getElementById('quiz-visual-box');
  const optionsGrid = document.getElementById('options-grid');
  const feedbackBox = document.getElementById('quiz-feedback');
  const feedbackText = document.getElementById('feedback-text');
  const nextBtn = document.getElementById('next-btn');

  const questionContainer = document.getElementById('question-container');
  const quizCompleteContainer = document.getElementById('quiz-complete');
  const finalScoreText = document.getElementById('final-score-text');
  const finalBadgeText = document.getElementById('final-badge-text');
  const restartBtn = document.getElementById('restart-quiz-btn');

  /**
   * Generates SVG graphic string for a question based on its degrees.
   * @param {number} degrees
   * @returns {string} SVG HTML string
   */
  function renderQuestionSVG(degrees) {
    const cx = 100, cy = 150, armLen = 70;
    const radians = (degrees * Math.PI) / 180;
    const armX = cx + armLen * Math.cos(radians);
    const armY = cy - armLen * Math.sin(radians);

    let strokeColor = '#3498db'; // Acute Blue
    let indicatorD = '';

    if (degrees === 90) {
      strokeColor = '#2ecc71'; // Right Green
      indicatorD = `<rect x="100" y="130" width="20" height="20" class="square-marker green-stroke" />`;
    } else if (degrees < 90) {
      strokeColor = '#3498db';
      const arcR = 25;
      const arcX = cx + arcR * Math.cos(radians);
      const arcY = cy - arcR * Math.sin(radians);
      indicatorD = `<path d="M ${cx + arcR},${cy} A ${arcR} ${arcR} 0 0 0 ${arcX.toFixed(2)} ${arcY.toFixed(2)}" class="arc-marker blue-stroke" />`;
    } else {
      strokeColor = '#f39c12'; // Obtuse Orange
      const arcR = 25;
      const arcX = cx + arcR * Math.cos(radians);
      const arcY = cy - arcR * Math.sin(radians);
      indicatorD = `<path d="M ${cx + arcR},${cy} A ${arcR} ${arcR} 0 0 0 ${arcX.toFixed(2)} ${arcY.toFixed(2)}" class="arc-marker orange-stroke" />`;
    }

    return `
      <svg viewBox="0 0 200 180" class="angle-svg">
        <line x1="100" y1="150" x2="170" y2="150" stroke="${strokeColor}" stroke-width="6" stroke-linecap="round" />
        <line x1="100" y1="150" x2="${armX.toFixed(2)}" y2="${armY.toFixed(2)}" stroke="${strokeColor}" stroke-width="6" stroke-linecap="round" />
        ${indicatorD}
        <circle cx="100" cy="150" r="5" class="vertex-dot" />
      </svg>
    `;
  }

  /**
   * Loads the question at currentQuestionIndex into UI.
   */
  function loadQuestion() {
    const q = quizQuestions[currentQuestionIndex];

    // Reset feedback UI
    feedbackBox.classList.add('hidden');

    // Update progress top bar
    progressDisplay.textContent = `${currentQuestionIndex + 1} / ${quizQuestions.length}`;
    scoreDisplay.textContent = `${score * 10} pts`;

    // Render title and visual
    questionTitle.textContent = q.title;
    quizVisualBox.innerHTML = renderQuestionSVG(q.degrees);

    // Populate option buttons
    optionsGrid.innerHTML = '';
    q.options.forEach((optText) => {
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
      feedbackText.textContent = `🎉 ${question.explanation}`;
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
      feedbackText.textContent = `💡 Almost! The correct answer was ${question.correctAnswer}. ${question.explanation}`;
      feedbackBox.style.backgroundColor = '#fee2e2';
      feedbackText.style.color = '#991b1b';
    }

    // Update score
    scoreDisplay.textContent = `${score * 10} pts`;

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

    finalScoreText.textContent = `${score} / ${quizQuestions.length}`;

    if (score === 5) {
      finalBadgeText.textContent = "🏆 Master Angle Detective Badge!";
    } else if (score >= 3) {
      finalBadgeText.textContent = "⭐ Senior Detective Badge!";
    } else {
      finalBadgeText.textContent = "🔍 Junior Detective Badge! Keep Practising!";
    }
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
