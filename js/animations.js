/**
 * FreshMarket UI Animations & Utility Helpers
 */

const animations = {
  /**
   * Display a temporary toast notification in the bottom right corner
   * @param {string} message 
   * @param {string} type 'success' | 'info' | 'error'
   */
  showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = '🔔';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'info') icon = '💡';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    // Auto fade out and remove
    setTimeout(() => {
      toast.classList.add('removing');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
      // Safety backup removal
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  },

  /**
   * Render placeholders in grid while fetching new items
   * @param {HTMLElement} gridElement 
   */
  renderSkeletons(gridElement) {
    if (!gridElement) return;
    gridElement.innerHTML = '';
    
    for (let i = 0; i < 6; i++) {
      const skeleton = document.createElement('div');
      skeleton.className = 'skeleton-card';
      skeleton.innerHTML = `
        <div class="skeleton-image"></div>
        <div class="skeleton-text title"></div>
        <div class="skeleton-text desc"></div>
        <div class="skeleton-text desc" style="width: 50%;"></div>
        <div class="skeleton-price"></div>
        <div class="skeleton-btn"></div>
      `;
      gridElement.appendChild(skeleton);
    }
  },

  /**
   * Apply smooth entrance animations to grid products
   * @param {HTMLElement} gridElement 
   */
  animateGridEntrance(gridElement) {
    if (!gridElement) return;
    gridElement.classList.add('fade-out');
    
    // Trigger transition Reflow
    void gridElement.offsetWidth;
    
    gridElement.classList.remove('fade-out');
    gridElement.classList.add('fade-in');
    
    setTimeout(() => {
      gridElement.classList.remove('fade-in');
    }, 400);
  }
};

// Export to window
window.UIAnimations = animations;
