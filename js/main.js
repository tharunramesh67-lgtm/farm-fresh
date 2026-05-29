/**
 * Farm Fresh Application Main Entrypoint
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
    this.renderCategoriesMenu();
    this.renderCategoryCards();
    this.renderBestsellers();
    this.renderFeaturedProducts('all');
    this.initHeroSlider();
    this.initBestsellerCarousel();
  },

  cacheElements() {
    // New premium elements
    this.navCategoriesMenu = document.getElementById('navCategoriesMenu');
    this.categoriesGridCards = document.getElementById('categoriesGridCards');
    this.bestsellerGrid = document.getElementById('bestsellerGrid');
    this.featuredGrid = document.getElementById('featuredGrid');
    this.featuredTabs = document.getElementById('featuredTabs');
    this.searchCategorySelect = document.getElementById('searchCategorySelect');
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
    // Logo click reset
    const logoLink = document.getElementById('logoLink');
    if (logoLink) {
      logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.ProductFilters.clearFilters();
      });
    }

    // Search Category dropdown sync
    if (this.searchCategorySelect) {
      this.searchCategorySelect.addEventListener('change', (e) => {
        window.ProductFilters.setCategory(e.target.value);
      });
    }

    // Featured Tabs filtering
    if (this.featuredTabs) {
      this.featuredTabs.querySelectorAll('.featured-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          this.featuredTabs.querySelectorAll('.featured-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          window.ProductFilters.setCategory(tab.dataset.category);
        });
      });
    }
  },

  renderCategoriesMenu() {
    if (!this.navCategoriesMenu) return;
    this.navCategoriesMenu.innerHTML = '';
    
    this.categories.forEach(cat => {
      if (cat.id === 'all') return;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#featuredGrid';
      a.innerHTML = `${cat.emoji || '📦'} ${cat.name}`;
      a.addEventListener('click', (e) => {
        window.ProductFilters.setCategory(cat.id);
      });
      li.appendChild(a);
      this.navCategoriesMenu.appendChild(li);
    });
  },

  renderCategoryCards() {
    if (!this.categoriesGridCards) return;
    this.categoriesGridCards.innerHTML = '';

    this.categories.forEach(cat => {
      const card = document.createElement('div');
      card.className = `category-card-item ${cat.id === 'all' ? 'active' : ''}`;
      card.dataset.id = cat.id;
      card.innerHTML = `
        <span class="category-card-emoji">${cat.emoji || '🥬'}</span>
        <span class="category-card-name">${cat.name}</span>
      `;

      card.addEventListener('click', () => {
        document.querySelectorAll('.category-card-item').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        window.ProductFilters.setCategory(cat.id);
        
        // Scroll smoothly to featured grid
        const featured = document.getElementById('featuredGrid');
        if (featured) featured.scrollIntoView({ behavior: 'smooth' });
      });

      this.categoriesGridCards.appendChild(card);
    });
  },

  renderBestsellers() {
    if (!this.bestsellerGrid) return;
    this.bestsellerGrid.innerHTML = '';

    const bestsellers = this.products.filter(p => p.featured || p.originalPrice);
    const listToRender = bestsellers.length > 0 ? bestsellers : this.products.slice(0, 4);

    listToRender.forEach(product => {
      const card = this.createProductCard(product);
      this.bestsellerGrid.appendChild(card);
    });
  },

  renderFeaturedProducts(category = 'all') {
    if (!this.featuredGrid) return;
    const featured = category === 'all' 
      ? this.products.slice(0, 4) 
      : this.products.filter(p => p.category === category).slice(0, 4);

    this.renderProductsToGrid(featured, this.featuredGrid);
  },

  renderProductsToGrid(productsToRender, grid) {
    if (!grid) return;
    grid.innerHTML = '';

    if (productsToRender.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: #64748B;">
          <span style="font-size: 3.5rem; display: block; margin-bottom: 1rem;">🥬</span>
          <h3>No Products Found</h3>
          <p>We couldn't find any products matching those criteria.</p>
        </div>
      `;
      return;
    }

    productsToRender.forEach(product => {
      const card = this.createProductCard(product);
      grid.appendChild(card);
    });

    window.UIAnimations.animateGridEntrance(grid);
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

    card.querySelector('img').style.cursor = 'pointer';
    card.querySelector('img').addEventListener('click', () => {
      this.showProductModal(product);
    });
    card.querySelector('.product-card-name').style.cursor = 'pointer';
    card.querySelector('.product-card-name').addEventListener('click', () => {
      this.showProductModal(product);
    });

    return card;
  },

  initHeroSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.slide');
    const prevBtn = document.getElementById('heroPrevBtn');
    const nextBtn = document.getElementById('heroNextBtn');
    let activeIndex = 0;

    const showSlide = (index) => {
      slides.forEach(s => s.classList.remove('active'));
      slides[index].classList.add('active');
    };

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        activeIndex = (activeIndex - 1 + slides.length) % slides.length;
        showSlide(activeIndex);
      });

      nextBtn.addEventListener('click', () => {
        activeIndex = (activeIndex + 1) % slides.length;
        showSlide(activeIndex);
      });
    }

    // Auto rotate every 8 seconds
    setInterval(() => {
      activeIndex = (activeIndex + 1) % slides.length;
      showSlide(activeIndex);
    }, 8000);
  },

  initBestsellerCarousel() {
    const prevBtn = document.getElementById('bestPrevBtn');
    const nextBtn = document.getElementById('bestNextBtn');
    const grid = this.bestsellerGrid;

    if (prevBtn && nextBtn && grid) {
      prevBtn.addEventListener('click', () => {
        grid.scrollBy({ left: -300, behavior: 'smooth' });
      });

      nextBtn.addEventListener('click', () => {
        grid.scrollBy({ left: 300, behavior: 'smooth' });
      });
    }
  },

  updateProductList(filteredProducts) {
    this.renderFeaturedProducts('all');
  },

  showProductModal(product) {
    const backdrop = document.getElementById('productModalBackdrop');
    if (!backdrop) return;

    document.getElementById('modalProductImage').src = product.image;
    document.getElementById('modalProductImage').alt = product.image_alt || product.name;
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductScore').textContent = product.rating;
    document.getElementById('modalProductStars').textContent = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    document.getElementById('modalProductOrigin').textContent = `📍 ${product.origin || 'Local Farm'}`;
    document.getElementById('modalProductPrice').textContent = `₹${product.price.toFixed(2)}`;
    document.getElementById('modalProductUnit').textContent = product.unit || '';
    document.getElementById('modalProductDescription').textContent = product.longDescription || product.description;

    const badge = document.getElementById('modalProductBadge');
    if (product.organic) {
      badge.textContent = '🌱 Organic Certified';
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }

    const grid = document.getElementById('modalProductNutritionGrid');
    const section = document.getElementById('modalProductNutritionSection');
    grid.innerHTML = '';
    if (product.nutrition) {
      section.style.display = 'block';
      for (const [key, val] of Object.entries(product.nutrition)) {
        const item = document.createElement('div');
        item.className = 'nutrition-item';
        item.innerHTML = `<span>${key.charAt(0).toUpperCase() + key.slice(1)}</span><strong>${val}</strong>`;
        grid.appendChild(item);
      }
    } else {
      section.style.display = 'none';
    }

    const addBtn = document.getElementById('modalAddToCartBtn');
    // Remove old event listener
    const newBtn = addBtn.cloneNode(true);
    addBtn.parentNode.replaceChild(newBtn, addBtn);
    newBtn.disabled = !product.inStock;
    newBtn.addEventListener('click', (e) => {
      window.CartManager.addToCart(product.id, 1, e.target);
    });

    backdrop.classList.add('active');
    
    // Bind close
    const closeBtn = document.getElementById('closeProductModalBtn');
    closeBtn.onclick = () => backdrop.classList.remove('active');
    backdrop.onclick = (e) => {
      if (e.target === backdrop) backdrop.classList.remove('active');
    };
  }
};

// Bind to window
window.FreshMarketApp = FreshMarketApp;

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.FreshMarketApp.init();
});
