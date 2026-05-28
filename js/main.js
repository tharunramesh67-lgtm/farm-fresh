/**
 * FreshMarket Application Main Entrypoint
 */

const FreshMarketApp = {
  products: [],
  categories: [],
  currency: '₹',

  init() {
    this.cacheElements();
    this.loadBootstrapData();
    this.bindEvents();
    
    // Initialize Submodules
    window.ProductFilters.init();
    window.CartManager.init();

    // Initial render
    this.renderCategories();
    this.renderProducts();
  },

  cacheElements() {
    this.categoryTabs = document.getElementById('categoryTabs');
    this.productsGrid = document.getElementById('productsGrid');
    this.resultsCount = document.getElementById('resultsCount');
    this.totalCount = document.getElementById('totalCount');
    
    // Mobile Filters
    this.mobileFilterBtn = document.getElementById('mobileFilterBtn');
    this.closeFiltersBtn = document.getElementById('closeFiltersBtn');
    this.filterSidebar = document.getElementById('filterSidebar');
  },

  loadBootstrapData() {
    if (window.STORE_DATA) {
      this.products = window.STORE_DATA.products || [];
      this.categories = window.STORE_DATA.categories || [];
      this.currency = window.STORE_DATA.currency || '₹';
    } else {
      console.warn("Bootstrap data not found, app may run on dynamic fallback mode.");
    }
  },

  bindEvents() {
    // Mobile filters drawer open/close
    this.mobileFilterBtn.addEventListener('click', () => {
      this.filterSidebar.classList.add('open');
    });

    this.closeFiltersBtn.addEventListener('click', () => {
      this.filterSidebar.classList.remove('open');
    });

    // Reset filters action close sidebar on mobile
    document.getElementById('resetFiltersBtn').addEventListener('click', () => {
      this.filterSidebar.classList.remove('open');
    });

    // Logo click reset
    document.getElementById('logoLink').addEventListener('click', (e) => {
      e.preventDefault();
      window.ProductFilters.clearFilters();
    });
  },

  renderCategories() {
    this.categoryTabs.innerHTML = '';
    
    this.categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `category-btn ${cat.id === 'all' ? 'active' : ''}`;
      btn.dataset.id = cat.id;
      
      const emojiSpan = cat.emoji ? `<span>${cat.emoji}</span>` : '';
      btn.innerHTML = `${emojiSpan} ${cat.name}`;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        window.ProductFilters.setCategory(cat.id);
        
        // Close sidebar if mobile
        this.filterSidebar.classList.remove('open');
      });

      this.categoryTabs.appendChild(btn);
    });
  },

  /**
   * Renders the product catalog based on state list
   */
  renderProducts(productsToRender = this.products) {
    this.productsGrid.innerHTML = '';
    
    // Update counters
    this.resultsCount.textContent = productsToRender.length;
    this.totalCount.textContent = this.products.length;

    if (productsToRender.length === 0) {
      this.productsGrid.innerHTML = `
        <div class="empty-shop-state">
          <span class="empty-icon">🥬</span>
          <h3>No Groceries Found</h3>
          <p>We couldn't find any products matching your current filters. Try resetting them or adjusting parameters.</p>
          <button class="continue-shopping-btn" style="max-width: 200px;" onclick="window.ProductFilters.clearFilters()">Clear Filters</button>
        </div>
      `;
      return;
    }

    productsToRender.forEach(product => {
      const card = this.createProductCard(product);
      this.productsGrid.appendChild(card);
    });

    window.UIAnimations.animateGridEntrance(this.productsGrid);
  },

  createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';

    const discountBadge = product.originalPrice 
      ? `<span class="card-badge red">Sale -${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>` 
      : (product.badge ? `<span class="card-badge ${product.badgeColor || 'green'}">${product.badge}</span>` : '');

    const isFav = window.CartManager.wishlist.includes(product.id);
    const hasLowStock = product.inStock && product.stockCount < 10;
    
    let stockHtml = `<span class="stock-status">✓ In Stock</span>`;
    if (!product.inStock) {
      stockHtml = `<span class="stock-status out">✗ Out of Stock</span>`;
    } else if (hasLowStock) {
      stockHtml = `<span class="stock-status low">⏳ Only ${product.stockCount} left</span>`;
    }

    card.innerHTML = `
      <div class="product-card-image">
        ${discountBadge}
        <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${product.id}" title="Save to Wishlist">
          ${isFav ? '❤️' : '🤍'}
        </button>
        <img src="${product.image}" alt="${product.image_alt || product.name}" loading="lazy">
      </div>
      
      <div class="product-card-rating">
        <span class="rating-stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
        <span class="rating-score">${product.rating}</span>
        <span>(${product.reviewCount || 0})</span>
      </div>
      
      <h3 class="product-card-name">${product.name}</h3>
      <p class="product-card-description">${product.description}</p>
      
      <div class="product-card-origin">
        📍 <span>${product.origin || 'Local Farm'}</span>
      </div>
      
      <div class="product-card-price-row">
        <div class="price-container">
          <span class="current-price">₹${product.price.toFixed(2)}</span>
          ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice.toFixed(2)}</span>` : ''}
        </div>
        <span class="unit-label">${product.unit}</span>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.25rem;">
        ${stockHtml}
      </div>
      
      <button class="add-to-cart-btn" data-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
        🛒 Add to Basket
      </button>
    `;

    // Connect Events
    card.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
      window.CartManager.addToCart(product.id, 1, e.target);
    });

    card.querySelector('.fav-btn').addEventListener('click', (e) => {
      window.CartManager.toggleWishlist(product.id, e.target);
    });

    return card;
  },

  /**
   * Called by filter submodule to refresh rendering
   */
  updateProductList(filteredProducts) {
    this.renderProducts(filteredProducts);
  }
};

// Bind to window
window.FreshMarketApp = FreshMarketApp;

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.FreshMarketApp.init();
});
