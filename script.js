/**
 * ============================================================================
 * ANGLE DETECTIVES - JAVASCRIPT CONTROLLER
 * Fully commented script for interactivity across Lab, Quiz, and Real-Life pages.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lab logic if on lab.html page
  if (document.getElementById('lab-svg')) {
    initAngleLab();
  }

  // Initialize Sort Angles logic if on lab.html page
  if (document.getElementById('sort-section')) {
    initSortAngles();
  }

  // Initialize Triangle Builder logic if on lab.html page
  if (document.getElementById('triangle-section')) {
    initTriangleBuilder();
  }

  // Initialize Quiz logic if on quiz.html page
  if (document.getElementById('options-grid')) {
    initAngleQuiz();
  }

  // Initialize Angles Around Us logic if on real-life.html page
  if (document.getElementById('reallife-svg')) {
    initAnglesAroundUs();
  }
});

/* ============================================================================
   SECTION 1: ANGLE LAB INTERACTION
   ============================================================================ */

/**
 * Sets up event listeners and SVG math calculations for the Angle Lab slider.
 */
function initAngleLab() {
  const svg = document.getElementById('lab-svg');
  const rotatingArm = document.getElementById('lab-rotating-arm');
  const dragHandle = document.getElementById('drag-handle');
  const indicatorPath = document.getElementById('lab-angle-indicator');
  const typeBadge = document.getElementById('lab-type-badge');
  const infoTitle = document.getElementById('lab-info-title');
  const infoDesc = document.getElementById('lab-info-desc');

  if (!svg || !dragHandle) return;

  // SVG Geometry Constants
  const cx = 150; // Vertex X coordinate
  const cy = 210; // Vertex Y coordinate
  const armLength = 110; // Length of the rotating arm

  let currentAngle = 90; // Default angle in degrees
  let isDragging = false;

  /**
   * Updates the lab UI according to the target angle in degrees.
   * @param {number} degrees - Angle in degrees (10 to 170)
   */
  function updateLab(degrees) {
    currentAngle = degrees;

    // Convert angle to radians for trigonometric arm calculation
    // Base line goes from (150,210) to (260,210) -> 0 degrees is facing East (Right)
    const radians = (degrees * Math.PI) / 180;
    const armX = cx + armLength * Math.cos(radians);
    const armY = cy - armLength * Math.sin(radians); // Y axis inverted in SVG

    // Update dynamic rotating arm position and red drag handle
    rotatingArm.setAttribute('x2', armX.toFixed(2));
    rotatingArm.setAttribute('y2', armY.toFixed(2));
    dragHandle.setAttribute('cx', armX.toFixed(2));
    dragHandle.setAttribute('cy', armY.toFixed(2));

    // Determine Angle Type & Color Palette
    let angleType = '';
    let strokeColor = '';
    let badgeClass = '';
    let titleText = '';
    let descText = '';

    if (degrees === 90) {
      angleType = 'Right angle';
      strokeColor = '#2ecc71'; // Green
      badgeClass = 'badge-green';
      titleText = '🟩 Right angle';
      descText = 'A right angle forms a perfect square L-shape corner!';

      // Draw square indicator symbol at the vertex for Right Angle
      const sqSize = 25;
      indicatorPath.setAttribute(
        'd',
        `M ${cx + sqSize},${cy} L ${cx + sqSize},${cy - sqSize} L ${cx},${cy - sqSize}`
      );
      indicatorPath.setAttribute('class', 'lab-indicator-path square-marker-lab');
    } else if (degrees < 90) {
      angleType = 'Acute angle';
      strokeColor = '#3498db'; // Blue
      badgeClass = 'badge-blue';
      titleText = '🟦 Acute angle';
      descText = 'An acute angle is smaller than a right angle. It is sharp and small!';

      // Draw arc indicator for Acute Angle
      const arcR = 35;
      const arcX = cx + arcR * Math.cos(radians);
      const arcY = cy - arcR * Math.sin(radians);
      indicatorPath.setAttribute(
        'd',
        `M ${cx + arcR},${cy} A ${arcR} ${arcR} 0 0 0 ${arcX.toFixed(2)} ${arcY.toFixed(2)}`
      );
      indicatorPath.setAttribute('class', 'lab-indicator-path');
    } else {
      angleType = 'Obtuse angle';
      strokeColor = '#f39c12'; // Orange
      badgeClass = 'badge-orange';
      titleText = '🟧 Obtuse angle';
      descText = 'An obtuse angle is wider than a right angle!';

      // Draw arc indicator for Obtuse Angle
      const arcR = 35;
      const arcX = cx + arcR * Math.cos(radians);
      const arcY = cy - arcR * Math.sin(radians);
      indicatorPath.setAttribute(
        'd',
        `M ${cx + arcR},${cy} A ${arcR} ${arcR} 0 0 0 ${arcX.toFixed(2)} ${arcY.toFixed(2)}`
      );
      indicatorPath.setAttribute('class', 'lab-indicator-path');
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

  /**
   * Calculates angle from pointer event coordinates relative to SVG vertex.
   */
  function calculateAngleFromPointer(e) {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse());

    const dx = svgPt.x - cx;
    const dy = cy - svgPt.y; // Invert dy so upwards is positive

    let deg = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
    if (deg < 0) deg += 360;

    // Snap to 90 degrees if close (between 87° and 93°)
    if (deg >= 87 && deg <= 93) {
      deg = 90;
    } else {
      // Clamp between 10° and 170°
      deg = Math.max(10, Math.min(170, deg));
    }

    return deg;
  }

  function handlePointerDown(e) {
    isDragging = true;
    dragHandle.setPointerCapture(e.pointerId);
    const newAngle = calculateAngleFromPointer(e);
    updateLab(newAngle);
  }

  function handlePointerMove(e) {
    if (!isDragging) return;
    const newAngle = calculateAngleFromPointer(e);
    updateLab(newAngle);
  }

  function handlePointerUp(e) {
    if (isDragging) {
      isDragging = false;
      try {
        dragHandle.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  }

  // Pointer Event Listeners for smooth touch and mouse interaction
  dragHandle.addEventListener('pointerdown', handlePointerDown);
  svg.addEventListener('pointerdown', handlePointerDown);
  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', handlePointerUp);
  window.addEventListener('pointercancel', handlePointerUp);

  // Initial render at 90 degrees
  updateLab(90);
}

/* ============================================================================
   SECTION 1b: SORT THE ANGLES INTERACTION
   ============================================================================ */

/**
 * 9 Angle SVG Cards (3 Right, 3 Acute, 3 Obtuse)
 * All cards differ in arm lengths, orientation / angle, and scale.
 * NO degree numbers are displayed!
 */
const sortCardData = [
  // 3 Right Angles (Green stroke)
  {
    id: 'right-1',
    type: 'right',
    svg: `
      <svg viewBox="0 0 100 100" aria-label="Right angle card 1">
        <line x1="20" y1="80" x2="80" y2="80" stroke="#2ecc71" stroke-width="5" stroke-linecap="round" />
        <line x1="20" y1="80" x2="20" y2="20" stroke="#2ecc71" stroke-width="5" stroke-linecap="round" />
        <rect x="20" y="65" width="15" height="15" class="square-marker green-stroke" />
        <circle cx="20" cy="80" r="4" class="vertex-dot" />
      </svg>
    `
  },
  {
    id: 'right-2',
    type: 'right',
    svg: `
      <svg viewBox="0 0 100 100" aria-label="Right angle card 2">
        <line x1="80" y1="80" x2="20" y2="80" stroke="#2ecc71" stroke-width="5" stroke-linecap="round" />
        <line x1="80" y1="80" x2="80" y2="20" stroke="#2ecc71" stroke-width="5" stroke-linecap="round" />
        <rect x="65" y="65" width="15" height="15" class="square-marker green-stroke" />
        <circle cx="80" cy="80" r="4" class="vertex-dot" />
      </svg>
    `
  },
  {
    id: 'right-3',
    type: 'right',
    svg: `
      <svg viewBox="0 0 100 100" aria-label="Right angle card 3">
        <line x1="20" y1="20" x2="80" y2="20" stroke="#2ecc71" stroke-width="5" stroke-linecap="round" />
        <line x1="20" y1="20" x2="20" y2="80" stroke="#2ecc71" stroke-width="5" stroke-linecap="round" />
        <rect x="20" y="20" width="15" height="15" class="square-marker green-stroke" />
        <circle cx="20" cy="20" r="4" class="vertex-dot" />
      </svg>
    `
  },

  // 3 Acute Angles (Blue stroke)
  {
    id: 'acute-1',
    type: 'acute',
    svg: `
      <svg viewBox="0 0 100 100" aria-label="Acute angle card 1">
        <line x1="15" y1="80" x2="85" y2="80" stroke="#3498db" stroke-width="5" stroke-linecap="round" />
        <line x1="15" y1="80" x2="70" y2="25" stroke="#3498db" stroke-width="5" stroke-linecap="round" />
        <path d="M 40,80 A 25 25 0 0 0 32.6,62.3" class="arc-marker blue-stroke" />
        <circle cx="15" cy="80" r="4" class="vertex-dot" />
      </svg>
    `
  },
  {
    id: 'acute-2',
    type: 'acute',
    svg: `
      <svg viewBox="0 0 100 100" aria-label="Acute angle card 2">
        <line x1="85" y1="80" x2="15" y2="80" stroke="#3498db" stroke-width="5" stroke-linecap="round" />
        <line x1="85" y1="80" x2="40" y2="20" stroke="#3498db" stroke-width="5" stroke-linecap="round" />
        <path d="M 60,80 A 25 25 0 0 1 66.4,63.2" class="arc-marker blue-stroke" />
        <circle cx="85" cy="80" r="4" class="vertex-dot" />
      </svg>
    `
  },
  {
    id: 'acute-3',
    type: 'acute',
    svg: `
      <svg viewBox="0 0 100 100" aria-label="Acute angle card 3">
        <line x1="20" y1="70" x2="80" y2="70" stroke="#3498db" stroke-width="5" stroke-linecap="round" />
        <line x1="20" y1="70" x2="80" y2="40" stroke="#3498db" stroke-width="5" stroke-linecap="round" />
        <path d="M 45,70 A 25 25 0 0 0 43.7,60.5" class="arc-marker blue-stroke" />
        <circle cx="20" cy="70" r="4" class="vertex-dot" />
      </svg>
    `
  },

  // 3 Obtuse Angles (Orange stroke)
  {
    id: 'obtuse-1',
    type: 'obtuse',
    svg: `
      <svg viewBox="0 0 100 100" aria-label="Obtuse angle card 1">
        <line x1="60" y1="80" x2="95" y2="80" stroke="#f39c12" stroke-width="5" stroke-linecap="round" />
        <line x1="60" y1="80" x2="10" y2="30" stroke="#f39c12" stroke-width="5" stroke-linecap="round" />
        <path d="M 85,80 A 25 25 0 0 0 42.3,62.3" class="arc-marker orange-stroke" />
        <circle cx="60" cy="80" r="4" class="vertex-dot" />
      </svg>
    `
  },
  {
    id: 'obtuse-2',
    type: 'obtuse',
    svg: `
      <svg viewBox="0 0 100 100" aria-label="Obtuse angle card 2">
        <line x1="40" y1="80" x2="5" y2="80" stroke="#f39c12" stroke-width="5" stroke-linecap="round" />
        <line x1="40" y1="80" x2="90" y2="30" stroke="#f39c12" stroke-width="5" stroke-linecap="round" />
        <path d="M 15,80 A 25 25 0 0 1 57.7,62.3" class="arc-marker orange-stroke" />
        <circle cx="40" cy="80" r="4" class="vertex-dot" />
      </svg>
    `
  },
  {
    id: 'obtuse-3',
    type: 'obtuse',
    svg: `
      <svg viewBox="0 0 100 100" aria-label="Obtuse angle card 3">
        <line x1="55" y1="85" x2="95" y2="85" stroke="#f39c12" stroke-width="5" stroke-linecap="round" />
        <line x1="55" y1="85" x2="10" y2="45" stroke="#f39c12" stroke-width="5" stroke-linecap="round" />
        <path d="M 80,85 A 25 25 0 0 0 36.3,68.4" class="arc-marker orange-stroke" />
        <circle cx="55" cy="85" r="4" class="vertex-dot" />
      </svg>
    `
  }
];

function initSortAngles() {
  const cardsContainer = document.getElementById('sort-cards-container');
  const scoreDisplay = document.getElementById('sort-score');
  const messageBox = document.getElementById('sort-message');
  const completionBanner = document.getElementById('sort-completion');
  const resetBtn = document.getElementById('sort-reset-btn');

  const dropBoxes = {
    right: document.getElementById('drop-box-right'),
    acute: document.getElementById('drop-box-acute'),
    obtuse: document.getElementById('drop-box-obtuse')
  };

  const dropBoxElements = document.querySelectorAll('.drop-box');

  let score = 0;
  let activeCard = null;
  let startX = 0;
  let startY = 0;
  let initialCardX = 0;
  let initialCardY = 0;

  /**
   * Shows a gentle message to the pupil.
   */
  function showMessage(text, isError = false) {
    messageBox.textContent = text;
    messageBox.className = `sort-message ${isError ? 'error' : 'success'}`;
    messageBox.classList.remove('hidden');
  }

  function hideMessage() {
    messageBox.classList.add('hidden');
  }

  /**
   * Initializes or resets the sorting game.
   */
  function setupGame() {
    score = 0;
    scoreDisplay.textContent = '0';
    hideMessage();
    completionBanner.classList.add('hidden');

    // Clear drop boxes
    Object.values(dropBoxes).forEach(box => box.innerHTML = '');

    // Clear cards container
    cardsContainer.innerHTML = '';

    // Shuffle cards
    const shuffledCards = shuffleArray(sortCardData);

    shuffledCards.forEach(data => {
      const card = document.createElement('div');
      card.className = 'angle-card';
      card.id = `card-${data.id}`;
      card.dataset.id = data.id;
      card.dataset.type = data.type;
      card.innerHTML = data.svg;

      // Attach Pointer Event listener for drag & drop
      card.addEventListener('pointerdown', handlePointerDown);

      cardsContainer.appendChild(card);
    });
  }

  /**
   * Pointer Down Event Handler
   */
  function handlePointerDown(e) {
    const card = e.currentTarget;
    if (card.classList.contains('placed')) return; // Ignore already placed cards

    activeCard = card;
    card.setPointerCapture(e.pointerId);

    const rect = card.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;

    // Get current transform offsets if any
    const style = window.getComputedStyle(card);
    const matrix = new WebKitCSSMatrix(style.transform);
    initialCardX = matrix.m41;
    initialCardY = matrix.m42;

    card.classList.add('dragging');
    hideMessage();

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  }

  /**
   * Pointer Move Event Handler
   */
  function handlePointerMove(e) {
    if (!activeCard) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const newX = initialCardX + dx;
    const newY = initialCardY + dy;

    activeCard.style.transform = `translate(${newX}px, ${newY}px)`;

    // Highlight drop box under current pointer position
    const cardRect = activeCard.getBoundingClientRect();
    const centerX = cardRect.left + cardRect.width / 2;
    const centerY = cardRect.top + cardRect.height / 2;

    dropBoxElements.forEach(box => {
      const boxRect = box.getBoundingClientRect();
      if (
        centerX >= boxRect.left &&
        centerX <= boxRect.right &&
        centerY >= boxRect.top &&
        centerY <= boxRect.bottom
      ) {
        box.classList.add('drag-over');
      } else {
        box.classList.remove('drag-over');
      }
    });
  }

  /**
   * Pointer Up / Release Event Handler
   */
  function handlePointerUp(e) {
    if (!activeCard) return;

    const card = activeCard;
    activeCard = null;

    try {
      card.releasePointerCapture(e.pointerId);
    } catch (err) {}

    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('pointercancel', handlePointerUp);

    card.classList.remove('dragging');

    // Clear hover drag-over styling from drop boxes
    dropBoxElements.forEach(box => box.classList.remove('drag-over'));

    // Check which drop box (if any) the center of the card was dropped in
    const cardRect = card.getBoundingClientRect();
    const centerX = cardRect.left + cardRect.width / 2;
    const centerY = cardRect.top + cardRect.height / 2;

    let targetBox = null;
    dropBoxElements.forEach(box => {
      const boxRect = box.getBoundingClientRect();
      if (
        centerX >= boxRect.left &&
        centerX <= boxRect.right &&
        centerY >= boxRect.top &&
        centerY <= boxRect.bottom
      ) {
        targetBox = box;
      }
    });

    if (targetBox) {
      const targetType = targetBox.dataset.target;
      const cardType = card.dataset.type;

      if (cardType === targetType) {
        // CORRECT DROP!
        handleCorrectDrop(card, targetBox, cardType);
      } else {
        // WRONG DROP!
        handleWrongDrop(card);
      }
    } else {
      // Dropped outside any box - smoothly bounce back
      bounceBack(card);
    }
  }

  /**
   * Handles correct placement of card in target drop box.
   */
  function handleCorrectDrop(card, targetBox, cardType) {
    card.removeEventListener('pointerdown', handlePointerDown);
    card.style.transform = '';
    card.classList.add('placed', `placed-${cardType}`);

    const targetContent = dropBoxes[cardType];
    targetContent.appendChild(card);

    score++;
    scoreDisplay.textContent = score;

    showMessage("✨ Great job! That's correct!", false);

    // Check if all 9 cards are sorted
    if (score === sortCardData.length) {
      setTimeout(() => {
        hideMessage();
        completionBanner.classList.remove('hidden');
      }, 500);
    }
  }

  /**
   * Handles wrong placement with gentle feedback and bounce back animation.
   */
  function handleWrongDrop(card) {
    const cardTypeNames = {
      right: 'a right angle (square corner)',
      acute: 'an acute angle (small & sharp)',
      obtuse: 'an obtuse angle (wide)'
    };

    showMessage(`Oops! Try looking closer at the corner shape. That's not quite right!`, true);
    bounceBack(card);
  }

  /**
   * Smoothly animates card back to its original slot.
   */
  function bounceBack(card) {
    card.classList.add('bouncing');
    card.style.transform = 'translate(0px, 0px)';

    setTimeout(() => {
      card.classList.remove('bouncing');
    }, 400);
  }

  // Play Again Button Listener
  resetBtn.addEventListener('click', setupGame);

  // Initial Game Setup
  setupGame();
}

/* ============================================================================
   SECTION 1c: TRIANGLE BUILDER INTERACTION
   ============================================================================ */

/**
 * Interactive Triangle Builder with draggable vertices, coloured angle arcs,
 * and live labels for angle types and triangle name.
 */
function initTriangleBuilder() {
  const svg = document.getElementById('triangle-svg');
  const polygon = document.getElementById('triangle-polygon');
  const anglesLabel = document.getElementById('triangle-angles-label');
  const nameLabel = document.getElementById('triangle-name-label');

  if (!svg || !polygon) return;

  const handles = [
    document.getElementById('triangle-handle-0'),
    document.getElementById('triangle-handle-1'),
    document.getElementById('triangle-handle-2')
  ];

  const arcs = [
    document.getElementById('triangle-arc-0'),
    document.getElementById('triangle-arc-1'),
    document.getElementById('triangle-arc-2')
  ];

  // Initial vertex coordinates
  let pts = [
    { x: 150, y: 50 },
    { x: 60, y: 250 },
    { x: 240, y: 250 }
  ];

  let activeHandleIndex = null;

  const RIGHT_ANGLE_TOLERANCE = 3.5; // degrees tolerance for 90°

  function distance(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function updateTriangle() {
    // 1. Update Polygon points
    polygon.setAttribute(
      'points',
      pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
    );

    // 2. Update Handle positions
    handles.forEach((h, i) => {
      h.setAttribute('cx', pts[i].x.toFixed(1));
      h.setAttribute('cy', pts[i].y.toFixed(1));
    });

    // Side lengths:
    // s0 opposite vertex 0 (between pts[1] and pts[2])
    // s1 opposite vertex 1 (between pts[0] and pts[2])
    // s2 opposite vertex 2 (between pts[0] and pts[1])
    const s0 = distance(pts[1], pts[2]);
    const s1 = distance(pts[0], pts[2]);
    const s2 = distance(pts[0], pts[1]);

    const anglesDeg = [];

    // 3. Draw interior arcs and calculate interior angles
    for (let i = 0; i < 3; i++) {
      const V = pts[i];
      const U = pts[(i + 2) % 3]; // previous vertex
      const W = pts[(i + 1) % 3]; // next vertex

      const vuX = U.x - V.x;
      const vuY = U.y - V.y;
      const l1 = Math.sqrt(vuX * vuX + vuY * vuY);

      const vwX = W.x - V.x;
      const vwY = W.y - V.y;
      const l2 = Math.sqrt(vwX * vwX + vwY * vwY);

      const theta1 = Math.atan2(vuY, vuX);
      const theta2 = Math.atan2(vwY, vwX);

      // Angle calculation via dot product
      let cosVal = (vuX * vwX + vuY * vwY) / (l1 * l2);
      cosVal = Math.max(-1, Math.min(1, cosVal));
      const deg = (Math.acos(cosVal) * 180) / Math.PI;
      anglesDeg.push(deg);

      // Arc radius capped by side lengths
      const R = Math.max(12, Math.min(32, l1 * 0.3, l2 * 0.3));

      const ax = V.x + R * Math.cos(theta1);
      const ay = V.y + R * Math.sin(theta1);

      const bx = V.x + R * Math.cos(theta2);
      const by = V.y + R * Math.sin(theta2);

      // Determine sweep flag via 2D cross product
      const crossZ = vuX * vwY - vuY * vwX;
      const sweepFlag = crossZ > 0 ? 1 : 0;

      arcs[i].setAttribute(
        'd',
        `M ${ax.toFixed(1)},${ay.toFixed(1)} A ${R.toFixed(1)} ${R.toFixed(1)} 0 0 ${sweepFlag} ${bx.toFixed(1)},${by.toFixed(1)}`
      );

      // Set Arc stroke color based on angle type
      let strokeColor = '';
      if (Math.abs(deg - 90) <= RIGHT_ANGLE_TOLERANCE) {
        strokeColor = '#2ecc71'; // Green for Right angle
      } else if (deg < 90) {
        strokeColor = '#3498db'; // Blue for Acute angle
      } else {
        strokeColor = '#f39c12'; // Orange for Obtuse angle
      }
      arcs[i].style.stroke = strokeColor;
    }

    // 4. Calculate Angle Types count
    let numRight = 0;
    let numAcute = 0;
    let numObtuse = 0;

    anglesDeg.forEach(deg => {
      if (Math.abs(deg - 90) <= RIGHT_ANGLE_TOLERANCE) {
        numRight++;
      } else if (deg < 90) {
        numAcute++;
      } else {
        numObtuse++;
      }
    });

    // Format Angle Types Label
    const angleParts = [];
    if (numRight > 0) angleParts.push(`${numRight} right angle${numRight > 1 ? 's' : ''}`);
    if (numObtuse > 0) angleParts.push(`${numObtuse} obtuse angle${numObtuse > 1 ? 's' : ''}`);
    if (numAcute > 0) angleParts.push(`${numAcute} acute angle${numAcute > 1 ? 's' : ''}`);

    anglesLabel.textContent = angleParts.join(', ');

    // Color code angle badge according to dominant/special angle type
    if (numRight > 0) {
      anglesLabel.className = 'type-badge badge-green';
    } else if (numObtuse > 0) {
      anglesLabel.className = 'type-badge badge-orange';
    } else {
      anglesLabel.className = 'type-badge badge-blue';
    }

    // 5. Calculate Triangle Name based on side lengths & right angles
    const maxSide = Math.max(s0, s1, s2);
    const sideTolerance = Math.max(8, maxSide * 0.05);

    function sidesEqual(lenA, lenB) {
      return Math.abs(lenA - lenB) <= sideTolerance;
    }

    const eq01 = sidesEqual(s0, s1);
    const eq12 = sidesEqual(s1, s2);
    const eq02 = sidesEqual(s0, s2);

    const isEquilateral = eq01 && eq12 && eq02;
    const isIsosceles = eq01 || eq12 || eq02;
    const hasRightAngle = numRight > 0;

    let triName = '';
    if (isEquilateral) {
      triName = 'Equilateral';
    } else if (hasRightAngle) {
      triName = 'Right-angled';
    } else if (isIsosceles) {
      triName = 'Isosceles';
    } else {
      triName = 'Scalene';
    }

    nameLabel.textContent = triName;
    nameLabel.className = hasRightAngle ? 'type-badge badge-green' : 'type-badge badge-blue';
  }

  // Pointer interaction for dragging handles
  function getSVGPoint(e) {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  handles.forEach((handle, idx) => {
    handle.addEventListener('pointerdown', e => {
      activeHandleIndex = idx;
      handle.setPointerCapture(e.pointerId);
    });

    handle.addEventListener('pointermove', e => {
      if (activeHandleIndex !== idx) return;

      const svgPt = getSVGPoint(e);

      // Keep handles strictly inside SVG area [16, 284]
      let newX = Math.max(16, Math.min(284, svgPt.x));
      let newY = Math.max(16, Math.min(284, svgPt.y));

      // Prevent handles from getting closer than 25px to each other
      const otherIndices = [0, 1, 2].filter(i => i !== idx);
      const minDistance = 25;

      let valid = true;
      for (const oIdx of otherIndices) {
        const d = Math.sqrt(
          (newX - pts[oIdx].x) ** 2 + (newY - pts[oIdx].y) ** 2
        );
        if (d < minDistance) {
          valid = false;
          break;
        }
      }

      if (valid) {
        pts[idx] = { x: newX, y: newY };
        updateTriangle();
      }
    });

    const handlePointerEnd = e => {
      if (activeHandleIndex === idx) {
        activeHandleIndex = null;
        try {
          handle.releasePointerCapture(e.pointerId);
        } catch (err) {}
      }
    };

    handle.addEventListener('pointerup', handlePointerEnd);
    handle.addEventListener('pointercancel', handlePointerEnd);
  });

  // Initial draw
  updateTriangle();
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

/* ============================================================================
   SECTION 3: ANGLES AROUND US INTERACTION
   ============================================================================ */

/**
 * Data for 6 hidden everyday objects with clear, non-degree angles.
 */
const realLifeSpotData = {
  window: {
    title: 'Window Frame Corner',
    icon: '🪟',
    correctType: 'right',
    explanation: 'A window corner forms a square right angle like the letter L.',
    closeUpSvg: `
      <svg viewBox="0 0 120 120" class="angle-svg" aria-label="Window corner right angle diagram">
        <path d="M 20,20 L 20,100 L 100,100" class="angle-line green-stroke" />
        <rect x="20" y="80" width="20" height="20" class="square-marker green-stroke" />
        <circle cx="20" cy="100" r="5" class="vertex-dot" />
      </svg>
    `
  },
  book: {
    title: 'Book Corner',
    icon: '📖',
    correctType: 'right',
    explanation: 'The corner of a book forms a perfect square right angle.',
    closeUpSvg: `
      <svg viewBox="0 0 120 120" class="angle-svg" aria-label="Book corner right angle diagram">
        <path d="M 20,20 L 20,100 L 100,100" class="angle-line green-stroke" />
        <rect x="20" y="80" width="20" height="20" class="square-marker green-stroke" />
        <circle cx="20" cy="100" r="5" class="vertex-dot" />
      </svg>
    `
  },
  pizza: {
    title: 'Pizza Slice Tip',
    icon: '🍕',
    correctType: 'acute',
    explanation: 'The tip of a pizza slice is small and sharp, making an acute angle.',
    closeUpSvg: `
      <svg viewBox="0 0 120 120" class="angle-svg" aria-label="Pizza slice acute angle diagram">
        <path d="M 90,20 L 20,100 L 100,85" class="angle-line blue-stroke" />
        <path d="M 40,100 A 20 20 0 0 0 38,82" class="arc-marker blue-stroke" />
        <circle cx="20" cy="100" r="5" class="vertex-dot" />
      </svg>
    `
  },
  scissors: {
    title: 'Open Scissors',
    icon: '✂️',
    correctType: 'acute',
    explanation: 'The open blades of scissors form a sharp acute angle.',
    closeUpSvg: `
      <svg viewBox="0 0 120 120" class="angle-svg" aria-label="Open scissors acute angle diagram">
        <path d="M 95,25 L 20,100 L 105,75" class="angle-line blue-stroke" />
        <path d="M 40,100 A 20 20 0 0 0 38,82" class="arc-marker blue-stroke" />
        <circle cx="20" cy="100" r="5" class="vertex-dot" />
      </svg>
    `
  },
  roof: {
    title: 'Playhouse Roof Peak',
    icon: '🏠',
    correctType: 'obtuse',
    explanation: 'The roof slants wide to let rain slide off, forming an obtuse angle.',
    closeUpSvg: `
      <svg viewBox="0 0 120 120" class="angle-svg" aria-label="Roof peak obtuse angle diagram">
        <path d="M 15,80 L 60,30 L 105,80" class="angle-line orange-stroke" />
        <path d="M 72,43 A 20 20 0 0 1 48,43" class="arc-marker orange-stroke" />
        <circle cx="60" cy="30" r="5" class="vertex-dot" />
      </svg>
    `
  },
  ladder: {
    title: 'Ladder Base',
    icon: '🪜',
    correctType: 'acute',
    explanation: 'The ladder leans steeply against the wall, creating a sharp acute angle with the ground.',
    closeUpSvg: `
      <svg viewBox="0 0 120 120" class="angle-svg" aria-label="Ladder base acute angle diagram">
        <path d="M 30,20 L 100,100 L 20,100" class="angle-line blue-stroke" />
        <path d="M 80,100 A 20 20 0 0 0 85,82" class="arc-marker blue-stroke" />
        <circle cx="100" cy="100" r="5" class="vertex-dot" />
      </svg>
    `
  }
};

/**
 * Controller for Angles Around Us game.
 */
function initAnglesAroundUs() {
  const spots = document.querySelectorAll('.pulse-spot-group');
  const foundCountDisplay = document.getElementById('angles-found-count');
  const totalCountDisplay = document.getElementById('angles-total-count');

  // Question Modal Elements
  const angleModal = document.getElementById('angle-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalIcon = document.getElementById('modal-object-icon');
  const modalVisualBox = document.getElementById('modal-visual-box');
  const modalOptBtns = document.querySelectorAll('.modal-opt-btn');
  const modalFeedback = document.getElementById('modal-feedback');
  const feedbackExplanation = document.getElementById('feedback-explanation');
  const modalNextBtn = document.getElementById('modal-next-btn');

  // Completion Modal Elements
  const completionModal = document.getElementById('completion-modal');
  const playAgainBtn = document.getElementById('play-again-btn');
  const reflectionInput = document.getElementById('reflection-input');

  const totalSpots = Object.keys(realLifeSpotData).length;
  let foundSpots = new Set();
  let currentActiveSpotKey = null;

  if (totalCountDisplay) {
    totalCountDisplay.textContent = totalSpots;
  }

  /**
   * Resets and closes the question modal.
   */
  function closeModal() {
    angleModal.classList.add('hidden');
    currentActiveSpotKey = null;
  }

  /**
   * Opens question modal for target spot key.
   */
  function openModal(spotKey) {
    const spot = realLifeSpotData[spotKey];
    if (!spot) return;

    currentActiveSpotKey = spotKey;

    modalTitle.textContent = spot.title;
    modalIcon.textContent = spot.icon;
    modalVisualBox.innerHTML = spot.closeUpSvg;

    // Reset option buttons
    modalOptBtns.forEach(btn => {
      btn.disabled = false;
      btn.style.opacity = '1';
    });

    // Hide feedback section initially
    modalFeedback.classList.add('hidden');

    angleModal.classList.remove('hidden');
  }

  /**
   * Handles user tapping an angle type button inside the modal.
   */
  function handleOptionClick(selectedType) {
    if (!currentActiveSpotKey) return;
    const spot = realLifeSpotData[currentActiveSpotKey];

    // Disable buttons to lock answer
    modalOptBtns.forEach(btn => btn.disabled = true);

    const isCorrect = (selectedType === spot.correctType);

    if (isCorrect) {
      feedbackExplanation.textContent = `🎉 Correct! ${spot.explanation}`;
      modalFeedback.style.backgroundColor = '#dcfce7';
      feedbackExplanation.style.color = '#166534';

      // Mark spot as found if not already
      if (!foundSpots.has(currentActiveSpotKey)) {
        foundSpots.add(currentActiveSpotKey);
        const spotEl = document.querySelector(`.pulse-spot-group[data-spot="${currentActiveSpotKey}"]`);
        if (spotEl) {
          spotEl.classList.add('found');
        }
        foundCountDisplay.textContent = foundSpots.size;
      }
    } else {
      feedbackExplanation.textContent = `💡 Not quite! ${spot.explanation}`;
      modalFeedback.style.backgroundColor = '#fee2e2';
      feedbackExplanation.style.color = '#991b1b';
    }

    modalFeedback.classList.remove('hidden');
  }

  // Attach event listeners to pulsing spots
  spots.forEach(spotEl => {
    spotEl.addEventListener('click', () => {
      const spotKey = spotEl.dataset.spot;
      openModal(spotKey);
    });
  });

  // Attach event listeners to answer buttons
  modalOptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.dataset.answer;
      handleOptionClick(answer);
    });
  });

  // Modal Next / Continue button
  modalNextBtn.addEventListener('click', () => {
    closeModal();
    // Check if all spots found
    if (foundSpots.size === totalSpots) {
      setTimeout(() => {
        completionModal.classList.remove('hidden');
      }, 300);
    }
  });

  // Modal Close X button
  modalCloseBtn.addEventListener('click', closeModal);

  // Play Again / Reset button
  playAgainBtn.addEventListener('click', () => {
    foundSpots.clear();
    foundCountDisplay.textContent = '0';
    if (reflectionInput) reflectionInput.value = '';

    spots.forEach(spotEl => spotEl.classList.remove('found'));

    completionModal.classList.add('hidden');
    closeModal();
  });
}
