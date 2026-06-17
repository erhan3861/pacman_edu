class GameCoordinator {
  constructor() {
    this.gameUi = document.getElementById('game-ui');
    this.rowTop = document.getElementById('row-top');
    this.mazeDiv = document.getElementById('maze');
    this.mazeImg = document.getElementById('maze-img');
    this.mazeCover = document.getElementById('maze-cover');
    this.pointsDisplay = document.getElementById('points-display');
    this.highScoreDisplay = document.getElementById('high-score-display');
    this.extraLivesDisplay = document.getElementById('extra-lives');
    this.fruitDisplay = document.getElementById('fruit-display');
    this.mainMenu = document.getElementById('main-menu-container');
    this.gameStartButton = document.getElementById('game-start');
    this.pauseButton = document.getElementById('pause-button');
    this.soundButton = document.getElementById('sound-button');
    this.leftCover = document.getElementById('left-cover');
    this.rightCover = document.getElementById('right-cover');
    this.pausedText = document.getElementById('paused-text');
    this.bottomRow = document.getElementById('bottom-row');

    this.educationalPanel = document.getElementById('educational-panel');
    this.questionText = document.getElementById('question-text');
    this.choicesContainer = document.getElementById('choices-container');
    this.feedbackBanner = document.getElementById('feedback-banner');
    this.gameContainerSplit = document.getElementById('game-container-split');
    this.educationalQuestions = [];
    this.currentQuestionIndex = 0;
    this.activeAnswerPickups = [];

    this.mazeArray = [
      ['XXXXXXXXXXXXXXXXXXXXXXXXXXXX'],
      ['XooooooooooooXXooooooooooooX'],
      ['XoXXXXoXXXXXoXXoXXXXXoXXXXoX'],
      ['XOXXXXoXXXXXoXXoXXXXXoXXXXOX'],
      ['XoXXXXoXXXXXoXXoXXXXXoXXXXoX'],
      ['XooooooooooooooooooooooooooX'],
      ['XoXXXXoXXoXXXXXXXXoXXoXXXXoX'],
      ['XoXXXXoXXoXXXXXXXXoXXoXXXXoX'],
      ['XooooooXXooooXXooooXXooooooX'],
      ['XXXXXXoXXXXX XX XXXXXoXXXXXX'],
      ['XXXXXXoXXXXX XX XXXXXoXXXXXX'],
      ['XXXXXXoXX          XXoXXXXXX'],
      ['XXXXXXoXX XXXXXXXX XXoXXXXXX'],
      ['XXXXXXoXX X      X XXoXXXXXX'],
      ['      o   X      X   o      '],
      ['XXXXXXoXX X      X XXoXXXXXX'],
      ['XXXXXXoXX XXXXXXXX XXoXXXXXX'],
      ['XXXXXXoXX          XXoXXXXXX'],
      ['XXXXXXoXX XXXXXXXX XXoXXXXXX'],
      ['XXXXXXoXX XXXXXXXX XXoXXXXXX'],
      ['XooooooooooooXXooooooooooooX'],
      ['XoXXXXoXXXXXoXXoXXXXXoXXXXoX'],
      ['XoXXXXoXXXXXoXXoXXXXXoXXXXoX'],
      ['XOooXXooooooo  oooooooXXooOX'],
      ['XXXoXXoXXoXXXXXXXXoXXoXXoXXX'],
      ['XXXoXXoXXoXXXXXXXXoXXoXXoXXX'],
      ['XooooooXXooooXXooooXXooooooX'],
      ['XoXXXXXXXXXXoXXoXXXXXXXXXXoX'],
      ['XoXXXXXXXXXXoXXoXXXXXXXXXXoX'],
      ['XooooooooooooooooooooooooooX'],
      ['XXXXXXXXXXXXXXXXXXXXXXXXXXXX'],
    ];

    this.maxFps = 120;
    this.tileSize = 8;
    this.scale = this.determineScale(1);
    this.scaledTileSize = this.tileSize * this.scale;
    this.firstGame = true;

    this.movementKeys = {
      // WASD
      87: 'up',
      83: 'down',
      65: 'left',
      68: 'right',

      // Arrow Keys
      38: 'up',
      40: 'down',
      37: 'left',
      39: 'right',
    };

    // Mobile touch trackers
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;

    this.fruitPoints = {
      1: 100,
      2: 300,
      3: 500,
      4: 700,
      5: 1000,
      6: 2000,
      7: 3000,
      8: 5000,
    };

    this.mazeArray.forEach((row, rowIndex) => {
      this.mazeArray[rowIndex] = row[0].split('');
    });

    this.gameStartButton.addEventListener(
      'click',
      this.startButtonClick.bind(this),
    );
    this.pauseButton.addEventListener('click', this.handlePauseKey.bind(this));
    this.soundButton.addEventListener(
      'click',
      this.soundButtonClick.bind(this),
    );

    this.setupEditModal();
    this.preloadAssets();
  }

  setupEditModal() {
    this.editModal = document.getElementById('education-edit-modal');
    this.editQuestionsList = document.getElementById('edit-questions-list');
    this.addNewQuestionBtn = document.getElementById('add-new-question-btn');
    this.saveModalBtn = document.getElementById('save-modal-btn');
    this.closeModalBtn = document.querySelector('.close-modal-btn');
    this.gameEditBtn = document.getElementById('game-edit');
    this.currentQuestions = [];

    if (this.gameEditBtn) {
      this.gameEditBtn.addEventListener('click', () => {
        this.currentQuestions = JSON.parse(JSON.stringify(this.educationalQuestions));
        this.renderEditQuestions();
        if (this.editModal) {
          this.editModal.style.display = 'flex';
        }
      });
    }

    if (this.closeModalBtn) {
      this.closeModalBtn.addEventListener('click', () => {
        if (this.editModal) {
          this.editModal.style.display = 'none';
        }
      });
    }

    if (this.addNewQuestionBtn) {
      this.addNewQuestionBtn.addEventListener('click', () => {
        this.currentQuestions.push({
          question: "Yeni Soru?",
          choices: ["Seçenek A", "Seçenek B", "Seçenek C", "Seçenek D"],
          correctIndex: 0
        });
        this.renderEditQuestions();
      });
    }

    if (this.saveModalBtn) {
      this.saveModalBtn.addEventListener('click', () => {
        this.educationalQuestions = this.currentQuestions;
        window.educationalQuestions = this.currentQuestions;
        if (this.editModal) {
          this.editModal.style.display = 'none';
        }
        this.currentQuestionIndex = 0;
        this.loadCurrentQuestion();
      });
    }

    window.deleteQuestion = (idx) => {
      this.currentQuestions.splice(idx, 1);
      this.renderEditQuestions();
    };

    window.updateQuestionText = (idx, val) => {
      this.currentQuestions[idx].question = val;
    };

    window.updateChoiceText = (qIdx, cIdx, val) => {
      this.currentQuestions[qIdx].choices[cIdx] = val;
    };

    window.updateCorrectIndex = (qIdx, cIdx) => {
      this.currentQuestions[qIdx].correctIndex = cIdx;
      this.renderEditQuestions();
    };
  }

  renderEditQuestions() {
    if (!this.editQuestionsList) return;
    this.editQuestionsList.innerHTML = '';
    
    this.currentQuestions.forEach((q, qIdx) => {
      const card = document.createElement('div');
      card.className = 'question-edit-card';
      
      let choicesHtml = '';
      q.choices.forEach((choice, cIdx) => {
        const isCorrect = q.correctIndex === cIdx;
        choicesHtml += `
          <div class="choice-edit-item ${isCorrect ? 'correct' : ''}" style="display:flex; align-items:center; background:#111; border:1px solid ${isCorrect ? '#00ff55' : '#444'}; border-radius:4px; padding:4px 6px;">
            <input type="radio" name="correct-${qIdx}" ${isCorrect ? 'checked' : ''} onchange="updateCorrectIndex(${qIdx}, ${cIdx})" style="margin-right:6px; cursor:pointer;">
            <input type="text" value="${choice.replace(/"/g, '&quot;')}" onchange="updateChoiceText(${qIdx}, ${cIdx}, this.value)" style="background:transparent; border:none; color:#fff; font-family:inherit; font-size:8px; width:100%; outline:none;">
          </div>
        `;
      });

      card.innerHTML = `
        <div class="question-edit-header">
          <span>SORU #${qIdx + 1}</span>
          <button class="delete-question-btn" onclick="deleteQuestion(${qIdx})">SİL</button>
        </div>
        <div class="input-row">
          <label style="display:block; font-size:7px; margin-bottom:5px; color:#aaa;">Soru Metni</label>
          <textarea class="q-text-input" style="width:100%; height:40px; background:#000; border:1px solid #444; color:#fff; padding:6px; box-sizing:border-box; font-family:inherit; font-size:8px; border-radius:4px;" onchange="updateQuestionText(${qIdx}, this.value)">${q.question}</textarea>
        </div>
        <div class="choices-edit-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:8px;">
          ${choicesHtml}
        </div>
      `;
      this.editQuestionsList.appendChild(card);
    });
  }

  /**
   * Recursive method which determines the largest possible scale the game's graphics can use
   * @param {Number} scale
   */
  determineScale(scale) {
    const availableScreenHeight = Math.min(
      document.documentElement.clientHeight,
      window.innerHeight || 0,
    );
    let availableScreenWidth = Math.min(
      document.documentElement.clientWidth,
      window.innerWidth || 0,
    );

    // If educational mode is active and viewport is wide (split screen), subtract panel width from available width
    if (availableScreenWidth > 900 && window.educationalQuestions && window.educationalQuestions.length > 0) {
      availableScreenWidth -= 480; // panel width (440px) + gap/margins (40px)
    }

    const scaledTileSize = this.tileSize * scale;

    // The original Pac-Man game leaves 5 tiles of height (3 above, 2 below) surrounding the
    // maze for the UI. See app\style\graphics\spriteSheets\references\mazeGridSystemReference.png
    // for reference.
    const mazeTileHeight = this.mazeArray.length + 5;
    const mazeTileWidth = this.mazeArray[0][0].split('').length;

    if (
      scaledTileSize * mazeTileHeight < availableScreenHeight
      && scaledTileSize * mazeTileWidth < availableScreenWidth
    ) {
      return this.determineScale(scale + 1);
    }

    return Math.max(1, scale - 1);
  }

  /**
   * Reveals the game underneath the loading covers and starts gameplay
   */
  startButtonClick() {
    this.leftCover.style.left = '-50%';
    this.rightCover.style.right = '-50%';
    this.mainMenu.style.opacity = 0;
    this.gameStartButton.disabled = true;

    setTimeout(() => {
      this.mainMenu.style.visibility = 'hidden';
    }, 1000);

    this.reset();

    if (this.gameContainerSplit) {
      this.gameContainerSplit.style.display = 'flex';
    }

    if (this.educationalQuestions && this.educationalQuestions.length > 0) {
      this.educationalPanel.style.display = 'flex';
    } else {
      this.educationalPanel.style.display = 'none';
    }

    if (this.firstGame) {
      this.firstGame = false;
      this.init();
    }
    this.startGameplay(true);
  }

  /**
   * Toggles the master volume for the soundManager, and saves the preference to storage
   */
  soundButtonClick() {
    const newVolume = this.soundManager.masterVolume === 1 ? 0 : 1;
    this.soundManager.setMasterVolume(newVolume);
    localStorage.setItem('volumePreference', newVolume);
    this.setSoundButtonIcon(newVolume);
  }

  /**
   * Sets the icon for the sound button
   */
  setSoundButtonIcon(newVolume) {
    this.soundButton.innerHTML = newVolume === 0 ? 'volume_off' : 'volume_up';
  }

  /**
   * Displays an error message in the event assets are unable to download
   */
  displayErrorMessage() {
    const loadingContainer = document.getElementById('loading-container');
    const errorMessage = document.getElementById('error-message');
    loadingContainer.style.opacity = 0;
    setTimeout(() => {
      loadingContainer.remove();
      errorMessage.style.opacity = 1;
      errorMessage.style.visibility = 'visible';
    }, 1500);
  }

  /**
   * Load all assets into a hidden Div to pre-load them into memory.
   * There is probably a better way to read all of these file names.
   */
  preloadAssets() {
    return new Promise((resolve) => {
      const loadingContainer = document.getElementById('loading-container');
      const loadingPacman = document.getElementById('loading-pacman');
      const loadingDotMask = document.getElementById('loading-dot-mask');

      const imgBase = 'app/style/graphics/spriteSheets/';
      const imgSources = [
        // Pacman
        `${imgBase}characters/pacman/arrow_down.svg`,
        `${imgBase}characters/pacman/arrow_left.svg`,
        `${imgBase}characters/pacman/arrow_right.svg`,
        `${imgBase}characters/pacman/arrow_up.svg`,
        `${imgBase}characters/pacman/pacman_death.svg`,
        `${imgBase}characters/pacman/pacman_error.svg`,
        `${imgBase}characters/pacman/pacman_down.svg`,
        `${imgBase}characters/pacman/pacman_left.svg`,
        `${imgBase}characters/pacman/pacman_right.svg`,
        `${imgBase}characters/pacman/pacman_up.svg`,

        // Blinky
        `${imgBase}characters/ghosts/blinky/blinky_down_angry.svg`,
        `${imgBase}characters/ghosts/blinky/blinky_down_annoyed.svg`,
        `${imgBase}characters/ghosts/blinky/blinky_down.svg`,
        `${imgBase}characters/ghosts/blinky/blinky_left_angry.svg`,
        `${imgBase}characters/ghosts/blinky/blinky_left_annoyed.svg`,
        `${imgBase}characters/ghosts/blinky/blinky_left.svg`,
        `${imgBase}characters/ghosts/blinky/blinky_right_angry.svg`,
        `${imgBase}characters/ghosts/blinky/blinky_right_annoyed.svg`,
        `${imgBase}characters/ghosts/blinky/blinky_right.svg`,
        `${imgBase}characters/ghosts/blinky/blinky_up_angry.svg`,
        `${imgBase}characters/ghosts/blinky/blinky_up_annoyed.svg`,
        `${imgBase}characters/ghosts/blinky/blinky_up.svg`,

        // Clyde
        `${imgBase}characters/ghosts/clyde/clyde_down.svg`,
        `${imgBase}characters/ghosts/clyde/clyde_left.svg`,
        `${imgBase}characters/ghosts/clyde/clyde_right.svg`,
        `${imgBase}characters/ghosts/clyde/clyde_up.svg`,

        // Inky
        `${imgBase}characters/ghosts/inky/inky_down.svg`,
        `${imgBase}characters/ghosts/inky/inky_left.svg`,
        `${imgBase}characters/ghosts/inky/inky_right.svg`,
        `${imgBase}characters/ghosts/inky/inky_up.svg`,

        // Pinky
        `${imgBase}characters/ghosts/pinky/pinky_down.svg`,
        `${imgBase}characters/ghosts/pinky/pinky_left.svg`,
        `${imgBase}characters/ghosts/pinky/pinky_right.svg`,
        `${imgBase}characters/ghosts/pinky/pinky_up.svg`,

        // Ghosts Common
        `${imgBase}characters/ghosts/eyes_down.svg`,
        `${imgBase}characters/ghosts/eyes_left.svg`,
        `${imgBase}characters/ghosts/eyes_right.svg`,
        `${imgBase}characters/ghosts/eyes_up.svg`,
        `${imgBase}characters/ghosts/scared_blue.svg`,
        `${imgBase}characters/ghosts/scared_white.svg`,

        // Dots
        `${imgBase}pickups/pacdot.svg`,
        `${imgBase}pickups/powerPellet.svg`,

        // Fruit
        `${imgBase}pickups/apple.svg`,
        `${imgBase}pickups/bell.svg`,
        `${imgBase}pickups/cherry.svg`,
        `${imgBase}pickups/galaxian.svg`,
        `${imgBase}pickups/key.svg`,
        `${imgBase}pickups/melon.svg`,
        `${imgBase}pickups/orange.svg`,
        `${imgBase}pickups/strawberry.svg`,

        // Text
        `${imgBase}text/ready.svg`,

        // Points
        `${imgBase}text/100.svg`,
        `${imgBase}text/200.svg`,
        `${imgBase}text/300.svg`,
        `${imgBase}text/400.svg`,
        `${imgBase}text/500.svg`,
        `${imgBase}text/700.svg`,
        `${imgBase}text/800.svg`,
        `${imgBase}text/1000.svg`,
        `${imgBase}text/1600.svg`,
        `${imgBase}text/2000.svg`,
        `${imgBase}text/3000.svg`,
        `${imgBase}text/5000.svg`,

        // Maze
        `${imgBase}maze/maze_blue.svg`,

        // Misc
        'app/style/graphics/extra_life.svg',
      ];

      const audioBase = 'app/style/audio/';
      const audioSources = [
        `${audioBase}game_start.mp3`,
        `${audioBase}pause.mp3`,
        `${audioBase}pause_beat.mp3`,
        `${audioBase}siren_1.mp3`,
        `${audioBase}siren_2.mp3`,
        `${audioBase}siren_3.mp3`,
        `${audioBase}power_up.mp3`,
        `${audioBase}extra_life.mp3`,
        `${audioBase}eyes.mp3`,
        `${audioBase}eat_ghost.mp3`,
        `${audioBase}death.mp3`,
        `${audioBase}fruit.mp3`,
        `${audioBase}dot_1.mp3`,
        `${audioBase}dot_2.mp3`,
      ];

      const totalSources = imgSources.length + audioSources.length;
      this.remainingSources = totalSources;

      loadingPacman.style.left = '0';
      loadingDotMask.style.width = '0';

      Promise.all([
        this.createElements(imgSources, 'img', totalSources, this),
        this.createElements(audioSources, 'audio', totalSources, this),
      ])
        .then(() => {
          loadingContainer.style.opacity = 0;
          resolve();

          setTimeout(() => {
            loadingContainer.remove();
            this.mainMenu.style.opacity = 1;
            this.mainMenu.style.visibility = 'visible';
          }, 1500);
        })
        .catch(this.displayErrorMessage);
    });
  }

  /**
   * Iterates through a list of sources and updates the loading bar as the assets load in
   * @param {String[]} sources
   * @param {('img'|'audio')} type
   * @param {Number} totalSources
   * @param {Object} gameCoord
   * @returns {Promise}
   */
  createElements(sources, type, totalSources, gameCoord) {
    const loadingContainer = document.getElementById('loading-container');
    const preloadDiv = document.getElementById('preload-div');
    const loadingPacman = document.getElementById('loading-pacman');
    const containerWidth = loadingContainer.scrollWidth
      - loadingPacman.scrollWidth;
    const loadingDotMask = document.getElementById('loading-dot-mask');

    const gameCoordRef = gameCoord;

    return new Promise((resolve, reject) => {
      let loadedSources = 0;

      sources.forEach((source) => {
        const element = type === 'img' ? new Image() : new Audio();
        preloadDiv.appendChild(element);

        const elementReady = () => {
          gameCoordRef.remainingSources -= 1;
          loadedSources += 1;
          const percent = 1 - gameCoordRef.remainingSources / totalSources;
          loadingPacman.style.left = `${percent * containerWidth}px`;
          loadingDotMask.style.width = loadingPacman.style.left;

          if (loadedSources === sources.length) {
            resolve();
          }
        };

        if (type === 'img') {
          element.onload = elementReady;
          element.onerror = reject;
        } else {
          element.addEventListener('canplaythrough', elementReady);
          element.onerror = reject;
        }

        element.src = source;

        if (type === 'audio') {
          element.load();
        }
      });
    });
  }

  /**
   * Resets gameCoordinator values to their default states
   */
  reset() {
    this.activeTimers = [];
    this.points = 0;
    this.level = 1;
    this.lives = 2;
    this.extraLifeGiven = false;
    this.remainingDots = 0;
    this.allowKeyPresses = true;
    this.allowPacmanMovement = false;
    this.allowPause = false;
    this.cutscene = true;
    this.highScore = localStorage.getItem('highScore');

    this.educationalQuestions = window.educationalQuestions || [];
    this.currentQuestionIndex = 0;
    if (this.activeAnswerPickups) {
      this.activeAnswerPickups.forEach(p => p.destroy());
    }
    this.activeAnswerPickups = [];

    if (this.firstGame) {
      setInterval(() => {
        this.collisionDetectionLoop();
      }, 500);

      this.pacman = new Pacman(
        this.scaledTileSize,
        this.mazeArray,
        new CharacterUtil(this.scaledTileSize),
      );
      this.blinky = new Ghost(
        this.scaledTileSize,
        this.mazeArray,
        this.pacman,
        'blinky',
        this.level,
        new CharacterUtil(this.scaledTileSize),
      );
      this.pinky = new Ghost(
        this.scaledTileSize,
        this.mazeArray,
        this.pacman,
        'pinky',
        this.level,
        new CharacterUtil(this.scaledTileSize),
      );
      this.inky = new Ghost(
        this.scaledTileSize,
        this.mazeArray,
        this.pacman,
        'inky',
        this.level,
        new CharacterUtil(this.scaledTileSize),
        this.blinky,
      );
      this.clyde = new Ghost(
        this.scaledTileSize,
        this.mazeArray,
        this.pacman,
        'clyde',
        this.level,
        new CharacterUtil(this.scaledTileSize),
      );
      this.fruit = new Pickup(
        'fruit',
        this.scaledTileSize,
        13.5,
        17,
        this.pacman,
        this.mazeDiv,
        100,
      );
    }

    this.entityList = [
      this.pacman,
      this.blinky,
      this.pinky,
      this.inky,
      this.clyde,
      this.fruit,
    ];

    this.ghosts = [this.blinky, this.pinky, this.inky, this.clyde];

    this.scaredGhosts = [];
    this.eyeGhosts = 0;

    if (this.firstGame) {
      this.drawMaze(this.mazeArray, this.entityList);
      this.soundManager = new SoundManager();
      this.setUiDimensions();
    } else {
      this.pacman.reset();
      this.ghosts.forEach((ghost) => {
        ghost.reset(true);
      });
      this.pickups.forEach((pickup) => {
        if (pickup.type !== 'fruit') {
          this.remainingDots += 1;
          pickup.reset();
          this.entityList.push(pickup);
        }
      });
    }

    this.pointsDisplay.innerHTML = '00';
    this.highScoreDisplay.innerHTML = this.highScore || '00';
    this.clearDisplay(this.fruitDisplay);

    const volumePreference = parseInt(
      localStorage.getItem('volumePreference') || 1,
      10,
    );
    this.setSoundButtonIcon(volumePreference);
    this.soundManager.setMasterVolume(volumePreference);
  }

  /**
   * Calls necessary setup functions to start the game
   */
  init() {
    this.registerEventListeners();
    this.registerTouchListeners();

    this.gameEngine = new GameEngine(this.maxFps, this.entityList);
    this.gameEngine.start();
  }

  /**
   * Adds HTML elements to draw on the webpage by iterating through the 2D maze array
   * @param {Array} mazeArray - 2D array representing the game board
   * @param {Array} entityList - List of entities to be used throughout the game
   */
  drawMaze(mazeArray, entityList) {
    this.pickups = [this.fruit];

    this.mazeDiv.style.height = `${this.scaledTileSize * 31}px`;
    this.mazeDiv.style.width = `${this.scaledTileSize * 28}px`;
    this.gameUi.style.width = `${this.scaledTileSize * 28}px`;
    this.bottomRow.style.minHeight = `${this.scaledTileSize * 2}px`;
    this.dotContainer = document.getElementById('dot-container');

    mazeArray.forEach((row, rowIndex) => {
      row.forEach((block, columnIndex) => {
        if (block === 'o' || block === 'O') {
          const type = block === 'o' ? 'pacdot' : 'powerPellet';
          const points = block === 'o' ? 10 : 50;
          const dot = new Pickup(
            type,
            this.scaledTileSize,
            columnIndex,
            rowIndex,
            this.pacman,
            this.dotContainer,
            points,
          );

          entityList.push(dot);
          this.pickups.push(dot);
          this.remainingDots += 1;
        }
      });
    });
  }

  setUiDimensions() {
    this.gameUi.style.fontSize = `${this.scaledTileSize}px`;
    this.rowTop.style.marginBottom = `${this.scaledTileSize}px`;
  }

  /**
   * Loop which periodically checks which pickups are nearby Pacman.
   * Pickups which are far away will not be considered for collision detection.
   */
  collisionDetectionLoop() {
    if (this.pacman.position) {
      const maxDistance = this.pacman.velocityPerMs * 750;
      const pacmanCenter = {
        x: this.pacman.position.left + this.scaledTileSize,
        y: this.pacman.position.top + this.scaledTileSize,
      };

      // Set this flag to TRUE to see how two-phase collision detection works!
      const debugging = false;

      this.pickups.forEach((pickup) => {
        pickup.checkPacmanProximity(maxDistance, pacmanCenter, debugging);
      });
    }
  }

  /**
   * Displays "Ready!" and allows Pacman to move after a brief delay
   * @param {Boolean} initialStart - Special condition for the game's beginning
   */
  startGameplay(initialStart) {
    this.loadCurrentQuestion();

    if (initialStart) {
      this.soundManager.play('game_start');
    }

    this.scaredGhosts = [];
    this.eyeGhosts = 0;
    this.allowPacmanMovement = false;

    const left = this.scaledTileSize * 11;
    const top = this.scaledTileSize * 16.5;
    const duration = initialStart ? 4500 : 2000;
    const width = this.scaledTileSize * 6;
    const height = this.scaledTileSize * 2;

    this.displayText({ left, top }, 'ready', duration, width, height);
    this.updateExtraLivesDisplay();

    new Timer(() => {
      this.allowPause = true;
      this.cutscene = false;
      this.soundManager.setCutscene(this.cutscene);
      this.soundManager.setAmbience(this.determineSiren(this.remainingDots));

      this.allowPacmanMovement = true;
      this.pacman.moving = true;

      this.ghosts.forEach((ghost) => {
        const ghostRef = ghost;
        ghostRef.moving = true;
      });

      this.ghostCycle('scatter');

      this.idleGhosts = [this.pinky, this.inky, this.clyde];
      this.releaseGhost();
    }, duration);
  }

  /**
   * Clears out all children nodes from a given display element
   * @param {String} display
   */
  clearDisplay(display) {
    while (display.firstChild) {
      display.removeChild(display.firstChild);
    }
  }

  /**
   * Displays extra life images equal to the number of remaining lives
   */
  updateExtraLivesDisplay() {
    this.clearDisplay(this.extraLivesDisplay);

    for (let i = 0; i < this.lives; i += 1) {
      const extraLifePic = document.createElement('img');
      extraLifePic.setAttribute('src', 'app/style/graphics/extra_life.svg');
      extraLifePic.style.height = `${this.scaledTileSize * 2}px`;
      this.extraLivesDisplay.appendChild(extraLifePic);
    }
  }

  /**
   * Displays a rolling log of the seven most-recently eaten fruit
   * @param {String} rawImageSource
   */
  updateFruitDisplay(rawImageSource) {
    const parsedSource = rawImageSource.slice(
      rawImageSource.indexOf('(') + 1,
      rawImageSource.indexOf(')'),
    );

    if (this.fruitDisplay.children.length === 7) {
      this.fruitDisplay.removeChild(this.fruitDisplay.firstChild);
    }

    const fruitPic = document.createElement('img');
    fruitPic.setAttribute('src', parsedSource);
    fruitPic.style.height = `${this.scaledTileSize * 2}px`;
    this.fruitDisplay.appendChild(fruitPic);
  }

  /**
   * Cycles the ghosts between 'chase' and 'scatter' mode
   * @param {('chase'|'scatter')} mode
   */
  ghostCycle(mode) {
    const delay = mode === 'scatter' ? 7000 : 20000;
    const nextMode = mode === 'scatter' ? 'chase' : 'scatter';

    this.ghostCycleTimer = new Timer(() => {
      this.ghosts.forEach((ghost) => {
        ghost.changeMode(nextMode);
      });

      this.ghostCycle(nextMode);
    }, delay);
  }

  /**
   * Releases a ghost from the Ghost House after a delay
   */
  releaseGhost() {
    if (this.idleGhosts.length > 0) {
      const delay = Math.max((8 - (this.level - 1) * 4) * 1000, 0);

      this.endIdleTimer = new Timer(() => {
        this.idleGhosts[0].endIdleMode();
        this.idleGhosts.shift();
      }, delay);
    }
  }

  /**
   * Register listeners for various game sequences
   */
  registerEventListeners() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('swipe', this.handleSwipe.bind(this));
    window.addEventListener('awardPoints', this.awardPoints.bind(this));
    window.addEventListener('deathSequence', this.deathSequence.bind(this));
    window.addEventListener('dotEaten', this.dotEaten.bind(this));
    window.addEventListener('powerUp', this.powerUp.bind(this));
    window.addEventListener('eatGhost', this.eatGhost.bind(this));
    window.addEventListener('restoreGhost', this.restoreGhost.bind(this));
    window.addEventListener('addTimer', this.addTimer.bind(this));
    window.addEventListener('removeTimer', this.removeTimer.bind(this));
    window.addEventListener('releaseGhost', this.releaseGhost.bind(this));
    window.addEventListener('answerSelected', this.answerSelected.bind(this));
  }

  /**
   * Register listeners for touchstart and touchend to handle mobile device swipes
   */
  registerTouchListeners() {
    document.addEventListener('touchstart', this.handleTouchStart.bind(this));
    document.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  /**
   * Sets touch values where the user's touch begins
   * @param {Event} event
   */
  handleTouchStart(event) {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  /**
   * Sets touch values where the user's touch ends and attempts to change Pac-Man's direction
   * @param {*} event
   */
  handleTouchEnd(event) {
    this.touchEndX = event.changedTouches[0].clientX;
    this.touchEndY = event.changedTouches[0].clientY;
    const diffX = this.touchEndX - this.touchStartX;
    const diffY = this.touchEndY - this.touchStartY;
    let direction;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      direction = diffX > 0 ? 'right' : 'left';
    } else {
      direction = diffY > 0 ? 'down' : 'up';
    }

    window.dispatchEvent(new CustomEvent('swipe', {
      detail: {
        direction,
      },
    }));
  }

  /**
   * Calls Pacman's changeDirection event if certain conditions are met
   * @param {({'up'|'down'|'left'|'right'})} direction
   */
  changeDirection(direction) {
    if (this.allowKeyPresses && this.gameEngine.running) {
      this.pacman.changeDirection(direction, this.allowPacmanMovement);
    }
  }

  /**
   * Calls various class functions depending upon the pressed key
   * @param {Event} e - The keydown event to evaluate
   */
  handleKeyDown(e) {
    if (e.keyCode === 27) {
      // ESC key
      this.handlePauseKey();
    } else if (e.keyCode === 81) {
      // Q
      this.soundButtonClick();
    } else if (this.movementKeys[e.keyCode]) {
      this.changeDirection(this.movementKeys[e.keyCode]);
    }
  }

  /**
   * Calls changeDirection with the direction of the user's swipe
   * @param {Event} e - The direction of the swipe
   */
  handleSwipe(e) {
    const { direction } = e.detail;
    this.changeDirection(direction);
  }

  /**
   * Handle behavior for the pause key
   */
  handlePauseKey() {
    if (this.allowPause) {
      this.allowPause = false;

      setTimeout(() => {
        if (!this.cutscene) {
          this.allowPause = true;
        }
      }, 500);

      this.gameEngine.changePausedState(this.gameEngine.running);
      this.soundManager.play('pause');

      if (this.gameEngine.started) {
        this.soundManager.resumeAmbience();
        this.gameUi.style.filter = 'unset';
        this.pausedText.style.visibility = 'hidden';
        this.pauseButton.innerHTML = 'pause';
        this.activeTimers.forEach((timer) => {
          timer.resume();
        });
      } else {
        this.soundManager.stopAmbience();
        this.soundManager.setAmbience('pause_beat', true);
        this.gameUi.style.filter = 'blur(5px)';
        this.pausedText.style.visibility = 'visible';
        this.pauseButton.innerHTML = 'play_arrow';
        this.activeTimers.forEach((timer) => {
          timer.pause();
        });
      }
    }
  }

  /**
   * Adds points to the player's total
   * @param {({ detail: { points: Number }})} e - Contains a quantity of points to add
   */
  awardPoints(e) {
    this.points += e.detail.points;
    this.pointsDisplay.innerText = this.points;
    if (this.points > (this.highScore || 0)) {
      this.highScore = this.points;
      this.highScoreDisplay.innerText = this.points;
      localStorage.setItem('highScore', this.highScore);
    }

    if (this.points >= 10000 && !this.extraLifeGiven) {
      this.extraLifeGiven = true;
      this.soundManager.play('extra_life');
      this.lives += 1;
      this.updateExtraLivesDisplay();
    }

    if (e.detail.type === 'fruit') {
      const left = e.detail.points >= 1000
        ? this.scaledTileSize * 12.5
        : this.scaledTileSize * 13;
      const top = this.scaledTileSize * 16.5;
      const width = e.detail.points >= 1000
        ? this.scaledTileSize * 3
        : this.scaledTileSize * 2;
      const height = this.scaledTileSize * 2;

      this.displayText({ left, top }, e.detail.points, 2000, width, height);
      this.soundManager.play('fruit');
      this.updateFruitDisplay(
        this.fruit.determineImage('fruit', e.detail.points),
      );
    }
  }

  /**
   * Animates Pacman's death, subtracts a life, and resets character positions if
   * the player has remaining lives.
   */
  deathSequence() {
    this.allowPause = false;
    this.cutscene = true;
    this.soundManager.setCutscene(this.cutscene);
    this.soundManager.stopAmbience();
    this.clearAnswerPickups();
    this.removeTimer({ detail: { timer: this.fruitTimer } });
    this.removeTimer({ detail: { timer: this.ghostCycleTimer } });
    this.removeTimer({ detail: { timer: this.endIdleTimer } });
    this.removeTimer({ detail: { timer: this.ghostFlashTimer } });

    this.allowKeyPresses = false;
    this.pacman.moving = false;
    this.ghosts.forEach((ghost) => {
      const ghostRef = ghost;
      ghostRef.moving = false;
    });

    new Timer(() => {
      this.ghosts.forEach((ghost) => {
        const ghostRef = ghost;
        ghostRef.display = false;
      });
      this.pacman.prepDeathAnimation();
      this.soundManager.play('death');

      if (this.lives > 0) {
        this.lives -= 1;

        new Timer(() => {
          this.mazeCover.style.visibility = 'visible';
          new Timer(() => {
            this.allowKeyPresses = true;
            this.mazeCover.style.visibility = 'hidden';
            this.pacman.reset();
            this.ghosts.forEach((ghost) => {
              ghost.reset();
            });
            this.fruit.hideFruit();

            this.startGameplay();
          }, 500);
        }, 2250);
      } else {
        this.gameOver();
      }
    }, 750);
  }

  /**
   * Displays GAME OVER text and displays the menu so players can play again
   */
  gameOver() {
    localStorage.setItem('highScore', this.highScore);
    if (this.gameContainerSplit) {
      this.gameContainerSplit.style.display = 'none';
    }
    if (this.educationalPanel) {
      this.educationalPanel.style.display = 'none';
    }
    this.clearAnswerPickups();

    new Timer(() => {
      this.displayText(
        {
          left: this.scaledTileSize * 9,
          top: this.scaledTileSize * 16.5,
        },
        'game_over',
        4000,
        this.scaledTileSize * 10,
        this.scaledTileSize * 2,
      );
      this.fruit.hideFruit();

      new Timer(() => {
        this.leftCover.style.left = '0';
        this.rightCover.style.right = '0';

        setTimeout(() => {
          this.mainMenu.style.opacity = 1;
          this.gameStartButton.disabled = false;
          this.mainMenu.style.visibility = 'visible';
        }, 1000);
      }, 2500);
    }, 2250);
  }

  /**
   * Handle events related to the number of remaining dots
   */
  dotEaten() {
    this.remainingDots -= 1;

    this.soundManager.playDotSound();

    if (this.remainingDots === 174 || this.remainingDots === 74) {
      this.createFruit();
    }

    if (this.remainingDots === 40 || this.remainingDots === 20) {
      this.speedUpBlinky();
    }

    if (this.remainingDots === 0) {
      this.advanceLevel();
    }
  }

  /**
   * Creates a bonus fruit for ten seconds
   */
  createFruit() {
    this.removeTimer({ detail: { timer: this.fruitTimer } });
    this.fruit.showFruit(this.fruitPoints[this.level] || 5000);
    this.fruitTimer = new Timer(() => {
      this.fruit.hideFruit();
    }, 10000);
  }

  /**
   * Speeds up Blinky and raises the background noise pitch
   */
  speedUpBlinky() {
    this.blinky.speedUp();

    if (this.scaredGhosts.length === 0 && this.eyeGhosts === 0) {
      this.soundManager.setAmbience(this.determineSiren(this.remainingDots));
    }
  }

  /**
   * Determines the correct siren ambience
   * @param {Number} remainingDots
   * @returns {String}
   */
  determineSiren(remainingDots) {
    let sirenNum;

    if (remainingDots > 40) {
      sirenNum = 1;
    } else if (remainingDots > 20) {
      sirenNum = 2;
    } else {
      sirenNum = 3;
    }

    return `siren_${sirenNum}`;
  }

  /**
   * Resets the gameboard and prepares the next level
   */
  advanceLevel() {
    this.allowPause = false;
    this.cutscene = true;
    this.soundManager.setCutscene(this.cutscene);
    this.allowKeyPresses = false;
    this.soundManager.stopAmbience();

    this.entityList.forEach((entity) => {
      const entityRef = entity;
      entityRef.moving = false;
    });

    this.removeTimer({ detail: { timer: this.fruitTimer } });
    this.removeTimer({ detail: { timer: this.ghostCycleTimer } });
    this.removeTimer({ detail: { timer: this.endIdleTimer } });
    this.removeTimer({ detail: { timer: this.ghostFlashTimer } });

    const imgBase = 'app/style//graphics/spriteSheets/maze/';

    new Timer(() => {
      this.ghosts.forEach((ghost) => {
        const ghostRef = ghost;
        ghostRef.display = false;
      });

      this.mazeImg.src = `${imgBase}maze_white.svg`;
      new Timer(() => {
        this.mazeImg.src = `${imgBase}maze_blue.svg`;
        new Timer(() => {
          this.mazeImg.src = `${imgBase}maze_white.svg`;
          new Timer(() => {
            this.mazeImg.src = `${imgBase}maze_blue.svg`;
            new Timer(() => {
              this.mazeImg.src = `${imgBase}maze_white.svg`;
              new Timer(() => {
                this.mazeImg.src = `${imgBase}maze_blue.svg`;
                new Timer(() => {
                  this.mazeCover.style.visibility = 'visible';
                  new Timer(() => {
                    this.mazeCover.style.visibility = 'hidden';
                    this.level += 1;
                    this.allowKeyPresses = true;
                    this.entityList.forEach((entity) => {
                      const entityRef = entity;
                      if (entityRef.level) {
                        entityRef.level = this.level;
                      }
                      entityRef.reset();
                      if (entityRef instanceof Ghost) {
                        entityRef.resetDefaultSpeed();
                      }
                      if (
                        entityRef instanceof Pickup
                        && entityRef.type !== 'fruit'
                      ) {
                        this.remainingDots += 1;
                      }
                    });
                    this.startGameplay();
                  }, 500);
                }, 250);
              }, 250);
            }, 250);
          }, 250);
        }, 250);
      }, 250);
    }, 2000);
  }

  /**
   * Flashes ghosts blue and white to indicate the end of the powerup
   * @param {Number} flashes - Total number of elapsed flashes
   * @param {Number} maxFlashes - Total flashes to show
   */
  flashGhosts(flashes, maxFlashes) {
    if (flashes === maxFlashes) {
      this.scaredGhosts.forEach((ghost) => {
        ghost.endScared();
      });
      this.scaredGhosts = [];
      if (this.eyeGhosts === 0) {
        this.soundManager.setAmbience(this.determineSiren(this.remainingDots));
      }
    } else if (this.scaredGhosts.length > 0) {
      this.scaredGhosts.forEach((ghost) => {
        ghost.toggleScaredColor();
      });

      this.ghostFlashTimer = new Timer(() => {
        this.flashGhosts(flashes + 1, maxFlashes);
      }, 250);
    }
  }

  /**
   * Upon eating a power pellet, sets the ghosts to 'scared' mode
   */
  powerUp() {
    if (this.remainingDots !== 0) {
      this.soundManager.setAmbience('power_up');
    }

    this.removeTimer({ detail: { timer: this.ghostFlashTimer } });

    this.ghostCombo = 0;
    this.scaredGhosts = [];

    this.ghosts.forEach((ghost) => {
      if (ghost.mode !== 'eyes') {
        this.scaredGhosts.push(ghost);
      }
    });

    this.scaredGhosts.forEach((ghost) => {
      ghost.becomeScared();
    });

    const powerDuration = Math.max((7 - this.level) * 1000, 0);
    this.ghostFlashTimer = new Timer(() => {
      this.flashGhosts(0, 9);
    }, powerDuration);
  }

  /**
   * Determines the quantity of points to give based on the current combo
   */
  determineComboPoints() {
    return 100 * (2 ** this.ghostCombo);
  }

  /**
   * Upon eating a ghost, award points and temporarily pause movement
   * @param {CustomEvent} e - Contains a target ghost object
   */
  eatGhost(e) {
    const pauseDuration = 1000;
    const { position, measurement } = e.detail.ghost;

    this.pauseTimer({ detail: { timer: this.ghostFlashTimer } });
    this.pauseTimer({ detail: { timer: this.ghostCycleTimer } });
    this.pauseTimer({ detail: { timer: this.fruitTimer } });
    this.soundManager.play('eat_ghost');

    this.scaredGhosts = this.scaredGhosts.filter(
      (ghost) => ghost.name !== e.detail.ghost.name,
    );
    this.eyeGhosts += 1;

    this.ghostCombo += 1;
    const comboPoints = this.determineComboPoints();
    window.dispatchEvent(
      new CustomEvent('awardPoints', {
        detail: {
          points: comboPoints,
        },
      }),
    );
    this.displayText(position, comboPoints, pauseDuration, measurement);

    this.allowPacmanMovement = false;
    this.pacman.display = false;
    this.pacman.moving = false;
    e.detail.ghost.display = false;
    e.detail.ghost.moving = false;

    this.ghosts.forEach((ghost) => {
      const ghostRef = ghost;
      ghostRef.animate = false;
      ghostRef.pause(true);
      ghostRef.allowCollision = false;
    });

    new Timer(() => {
      this.soundManager.setAmbience('eyes');

      this.resumeTimer({ detail: { timer: this.ghostFlashTimer } });
      this.resumeTimer({ detail: { timer: this.ghostCycleTimer } });
      this.resumeTimer({ detail: { timer: this.fruitTimer } });
      this.allowPacmanMovement = true;
      this.pacman.display = true;
      this.pacman.moving = true;
      e.detail.ghost.display = true;
      e.detail.ghost.moving = true;
      this.ghosts.forEach((ghost) => {
        const ghostRef = ghost;
        ghostRef.animate = true;
        ghostRef.pause(false);
        ghostRef.allowCollision = true;
      });
    }, pauseDuration);
  }

  /**
   * Decrements the count of "eye" ghosts and updates the ambience
   */
  restoreGhost() {
    this.eyeGhosts -= 1;

    if (this.eyeGhosts === 0) {
      const sound = this.scaredGhosts.length > 0
        ? 'power_up'
        : this.determineSiren(this.remainingDots);
      this.soundManager.setAmbience(sound);
    }
  }

  /**
   * Creates a temporary div to display points on screen
   * @param {({ left: number, top: number })} position - CSS coordinates to display the points at
   * @param {Number} amount - Amount of points to display
   * @param {Number} duration - Milliseconds to display the points before disappearing
   * @param {Number} width - Image width in pixels
   * @param {Number} height - Image height in pixels
   */
  displayText(position, amount, duration, width, height) {
    const pointsDiv = document.createElement('div');

    pointsDiv.style.position = 'absolute';
    pointsDiv.style.backgroundSize = `${width}px`;
    pointsDiv.style.backgroundImage = 'url(app/style/graphics/'
        + `spriteSheets/text/${amount}.svg`;
    pointsDiv.style.width = `${width}px`;
    pointsDiv.style.height = `${height || width}px`;
    pointsDiv.style.top = `${position.top}px`;
    pointsDiv.style.left = `${position.left}px`;
    pointsDiv.style.zIndex = 2;

    this.mazeDiv.appendChild(pointsDiv);

    new Timer(() => {
      this.mazeDiv.removeChild(pointsDiv);
    }, duration);
  }

  /**
   * Pushes a Timer to the activeTimers array
   * @param {({ detail: { timer: Object }})} e
   */
  addTimer(e) {
    this.activeTimers.push(e.detail.timer);
  }

  /**
   * Checks if a Timer with a matching ID exists
   * @param {({ detail: { timer: Object }})} e
   * @returns {Boolean}
   */
  timerExists(e) {
    return !!(e.detail.timer || {}).timerId;
  }

  /**
   * Pauses a timer
   * @param {({ detail: { timer: Object }})} e
   */
  pauseTimer(e) {
    if (this.timerExists(e)) {
      e.detail.timer.pause(true);
    }
  }

  /**
   * Resumes a timer
   * @param {({ detail: { timer: Object }})} e
   */
  resumeTimer(e) {
    if (this.timerExists(e)) {
      e.detail.timer.resume(true);
    }
  }

  /**
   * Removes a Timer from activeTimers
   * @param {({ detail: { timer: Object }})} e
   */
  removeTimer(e) {
    if (this.timerExists(e)) {
      window.clearTimeout(e.detail.timer.timerId);
      this.activeTimers = this.activeTimers.filter(
        (timer) => timer.timerId !== e.detail.timer.timerId,
      );
    }
  }

  loadCurrentQuestion() {
    this.clearAnswerPickups();

    if (!this.educationalQuestions || this.educationalQuestions.length === 0) {
      return;
    }

    const question = this.educationalQuestions[this.currentQuestionIndex];
    if (!question) return;

    // Update Progress Bar
    const progressFill = document.getElementById('progress-bar-fill');
    const progressText = document.getElementById('progress-text');
    if (progressText) {
      progressText.innerText = `Soru ${this.currentQuestionIndex + 1} / ${this.educationalQuestions.length}`;
    }
    if (progressFill) {
      const percent = (this.currentQuestionIndex / this.educationalQuestions.length) * 100;
      progressFill.style.width = `${percent}%`;
    }

    this.questionText.innerText = question.question;
    
    this.choicesContainer.innerHTML = '';
    const badges = ['A', 'B', 'C', 'D'];
    question.choices.forEach((choice, idx) => {
      const card = document.createElement('div');
      card.className = `choice-card choice-card-${idx}`;
      card.innerHTML = `<span class="choice-badge badge-${badges[idx].toLowerCase()}">${badges[idx]}</span><span class="choice-text">${choice}</span>`;
      this.choicesContainer.appendChild(card);
    });

    this.spawnAnswerChoices();
  }

  spawnAnswerChoices() {
    const pathCoordinates = [];
    this.mazeArray.forEach((row, rowIndex) => {
      row.forEach((block, columnIndex) => {
        const isGhostHouse = (columnIndex > 9 && columnIndex < 18) && (rowIndex > 11 && rowIndex < 17);
        if (block !== 'X' && !isGhostHouse && block !== ' ') {
          pathCoordinates.push({ x: columnIndex, y: rowIndex });
        }
      });
    });

    const pacmanGrid = this.pacman && this.pacman.position
      ? this.pacman.characterUtil.determineGridPosition(this.pacman.position, this.scaledTileSize)
      : { x: 13, y: 23 };

    let safeCoords = pathCoordinates.filter((coord) => {
      const dist = Math.sqrt(((coord.x - pacmanGrid.x) ** 2) + ((coord.y - pacmanGrid.y) ** 2));
      return dist >= 6;
    });

    if (safeCoords.length < 4) {
      safeCoords = pathCoordinates;
    }

    const selectedCoords = [];
    let attempts = 0;
    while (selectedCoords.length < 4 && safeCoords.length > 0 && attempts < 100) {
      attempts++;
      const randIdx = Math.floor(Math.random() * safeCoords.length);
      const candidate = safeCoords[randIdx];
      
      const isSpaced = selectedCoords.every((c) => {
        const dist = Math.sqrt(((c.x - candidate.x) ** 2) + ((c.y - candidate.y) ** 2));
        return dist >= 4;
      });

      if (isSpaced || selectedCoords.length === 0 || attempts > 50) {
        selectedCoords.push(candidate);
        safeCoords.splice(randIdx, 1);
      }
    }

    while (selectedCoords.length < 4 && pathCoordinates.length > 0) {
      const randIdx = Math.floor(Math.random() * pathCoordinates.length);
      selectedCoords.push(pathCoordinates[randIdx]);
      pathCoordinates.splice(randIdx, 1);
    }

    const labels = ['A', 'B', 'C', 'D'];
    for (let i = 0; i < 4; i++) {
      const coord = selectedCoords[i];
      if (!coord) continue;
      const answerPickup = new AnswerPickup(
        i,
        labels[i],
        this.scaledTileSize,
        coord.x,
        coord.y,
        this.pacman,
        this.mazeDiv
      );
      this.activeAnswerPickups.push(answerPickup);
      this.entityList.push(answerPickup);
      this.pickups.push(answerPickup);
    }
  }

  clearAnswerPickups() {
    if (this.activeAnswerPickups) {
      this.activeAnswerPickups.forEach((pickup) => {
        pickup.destroy();
        this.entityList = this.entityList.filter((item) => item !== pickup);
        this.pickups = this.pickups.filter((item) => item !== pickup);
      });
      this.activeAnswerPickups = [];
    }
  }

  answerSelected(e) {
    if (this.feedbackBanner.style.display === 'block') {
      return;
    }

    const { optionIndex } = e.detail;
    const currentQuestion = this.educationalQuestions[this.currentQuestionIndex];
    if (!currentQuestion) return;

    if (optionIndex === currentQuestion.correctIndex) {
      this.feedbackBanner.innerText = "DOĞRU!";
      this.feedbackBanner.className = "feedback-banner feedback-correct";
      this.feedbackBanner.style.display = "block";
      this.soundManager.play('extra_life');

      window.dispatchEvent(new CustomEvent('awardPoints', {
        detail: { points: 500 }
      }));

      if (Math.random() < 0.5) {
        this.lives += 1;
        this.updateExtraLivesDisplay();
      } else {
        this.powerUp();
      }

      this.clearAnswerPickups();

      new Timer(() => {
        this.feedbackBanner.style.display = "none";
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.educationalQuestions.length) {
          this.loadCurrentQuestion();
        } else {
          const progressFill = document.getElementById('progress-bar-fill');
          if (progressFill) {
            progressFill.style.width = '100%';
          }
          this.educationalPanel.innerHTML = '<div class="question-text" style="color: #55ff55;">TEBRİKLER! TÜM SORULARI BİLDİNİZ!</div>';
          this.powerUp();
          new Timer(() => {
            this.advanceLevel();
          }, 3000);
        }
      }, 2000);

    } else {
      this.feedbackBanner.innerText = "YANLIŞ!";
      this.feedbackBanner.className = "feedback-banner feedback-wrong";
      this.feedbackBanner.style.display = "block";
      
      this.clearAnswerPickups();

      new Timer(() => {
        this.feedbackBanner.style.display = "none";
        this.deathSequence();
      }, 1500);
    }
  }
}

// removeIf(production)
module.exports = GameCoordinator;
// endRemoveIf(production)
