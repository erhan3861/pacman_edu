class AnswerPickup {
  constructor(optionIndex, label, scaledTileSize, column, row, pacman, mazeDiv) {
    this.type = 'answer';
    this.optionIndex = optionIndex;
    this.label = label; // 'A', 'B', 'C', 'D'
    this.pacman = pacman;
    this.mazeDiv = mazeDiv;
    this.nearPacman = false;
    this.scaledTileSize = scaledTileSize;
    this.column = column;
    this.row = row;

    // Make the choice pellet slightly larger than a pacdot but smaller than fruit
    this.size = scaledTileSize * 1.5;
    this.x = (column * scaledTileSize) - (scaledTileSize * 0.25);
    this.y = (row * scaledTileSize) - (scaledTileSize * 0.25);

    this.center = {
      x: column * scaledTileSize,
      y: row * scaledTileSize,
    };

    this.animationTarget = document.createElement('div');
    this.animationTarget.style.position = 'absolute';
    this.animationTarget.style.height = `${this.size}px`;
    this.animationTarget.style.width = `${this.size}px`;
    this.animationTarget.style.top = `${this.y}px`;
    this.animationTarget.style.left = `${this.x}px`;
    this.animationTarget.style.borderRadius = '50%';
    this.animationTarget.style.display = 'flex';
    this.animationTarget.style.justifyContent = 'center';
    this.animationTarget.style.alignItems = 'center';
    this.animationTarget.style.fontFamily = '"Press Start 2P", monospace';
    this.animationTarget.style.fontSize = `${scaledTileSize * 0.9}px`;
    this.animationTarget.style.fontWeight = 'bold';
    this.animationTarget.style.color = '#000000';
    
    // Visual indicators: A (cyan), B (green), C (yellow), D (pink)
    const colors = ['#55FFFF', '#55FF55', '#FFFF55', '#FF55FF'];
    const color = colors[optionIndex % colors.length];
    this.animationTarget.style.backgroundColor = color;
    this.animationTarget.style.boxShadow = `0 0 10px ${color}, inset 0 0 5px #ffffff`;
    this.animationTarget.style.border = '1px solid #ffffff';
    this.animationTarget.innerText = label;
    this.animationTarget.style.zIndex = 5;

    this.mazeDiv.appendChild(this.animationTarget);
    this.reset();
  }

  /**
   * Resets visibility of the answer choice
   */
  reset() {
    this.animationTarget.style.visibility = 'visible';
  }

  /**
   * Removes element from DOM when no longer needed
   */
  destroy() {
    if (this.animationTarget && this.animationTarget.parentNode) {
      this.animationTarget.parentNode.removeChild(this.animationTarget);
    }
  }

  /**
   * Collision detection helper
   */
  checkForCollision(pickup, originalPacman) {
    const pacman = { ...originalPacman };
    pacman.x += (pacman.size * 0.25);
    pacman.y += (pacman.size * 0.25);
    pacman.size /= 2;

    return (pickup.x < pacman.x + pacman.size
      && pickup.x + pickup.size > pacman.x
      && pickup.y < pacman.y + pacman.size
      && pickup.y + pickup.size > pacman.y);
  }

  /**
   * Check if Pacman is close enough to check collisions
   */
  checkPacmanProximity(maxDistance, pacmanCenter) {
    if (this.animationTarget.style.visibility !== 'hidden') {
      const distance = Math.sqrt(
        ((this.center.x - pacmanCenter.x) ** 2)
        + ((this.center.y - pacmanCenter.y) ** 2),
      );
      this.nearPacman = (distance <= maxDistance);
    }
  }

  /**
   * Check if collision detection is active
   */
  shouldCheckForCollision() {
    return this.animationTarget.style.visibility !== 'hidden' && this.nearPacman;
  }

  /**
   * Update loops and checks collision with Pacman
   */
  update() {
    if (this.shouldCheckForCollision()) {
      if (this.checkForCollision({
        x: this.x,
        y: this.y,
        size: this.size,
      }, {
        x: this.pacman.position.left,
        y: this.pacman.position.top,
        size: this.pacman.measurement,
      })) {
        this.animationTarget.style.visibility = 'hidden';
        
        // Dispatch event indicating this answer choice was collected
        window.dispatchEvent(new CustomEvent('answerSelected', {
          detail: {
            optionIndex: this.optionIndex,
            label: this.label
          }
        }));
      }
    }
  }
}

// removeIf(production)
module.exports = AnswerPickup;
// endRemoveIf(production)
