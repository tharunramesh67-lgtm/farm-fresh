// App State
let state = {
  products: [],
  categories: [],
  cart: [],
  wishlist: [],
  filters: {
    category: 'All',
    search: ''
  }
};

// UI Animations Module Helper
const UIAnimations = {
  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '🌱';
    if (type === 'error') icon = '❌';
    else if (type === 'info') icon = 'ℹ️';

    toast.innerHTML = `
      <span>${icon}</span>
      <span>${message}</span>
    `;

    const container = document.getElementById('toastContainer');
    if (container) {
      container.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  },

  renderSkeletons(grid) {
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 0; i < 4; i++) {
      const skeleton = document.createElement('div');
      skeleton.className = 'skeleton-card';
      skeleton.innerHTML = `
        <div class="skeleton-image"></div>
        <div class="skeleton-text title"></div>
        <div class="skeleton-text desc"></div>
        <div class="skeleton-price"></div>
      `;
      grid.appendChild(skeleton);
    }
  },

  animateGridEntrance(grid) {
    if (!grid) return;
    const cards = grid.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.4s ease';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 80);
    });
  }
};

// Main App Module
const FarmFreshApp = {
  init() {
    this.cacheElements();
    this.loadBootstrapData();
    this.bindEvents();

    // Initial render
    this.renderCategoriesMenu();
    this.renderCategoryCards();
    this.renderBestsellers();
    this.renderFeaturedProducts('All');
    
    // Load local storage items
    this.loadCartFromLocalStorage();
    this.loadWishlistFromLocalStorage();

    // Animations
    this.initHeroSlider();
    this.initBestsellerCarousel();
  },

  cacheElements() {
    this.searchInput = document.getElementById('searchInput');
    this.searchBtn = document.getElementById('searchBtn');
    this.searchCategorySelect = document.getElementById('searchCategorySelect');
    
    this.navCategoriesMenu = document.getElementById('navCategoriesMenu');
    this.categoriesGridCards = document.getElementById('categoriesGridCards');
    this.bestsellerGrid = document.getElementById('bestsellerGrid');
    this.featuredGrid = document.getElementById('featuredGrid');
    this.featuredTabs = document.getElementById('featuredTabs');

    // Cart / Wishlist elements
    this.cartToggleBtn = document.getElementById('cartToggleBtn');
    this.wishlistToggleBtn = document.getElementById('wishlistToggleBtn');
    this.closeCartBtn = document.getElementById('closeCartBtn');
    this.cartBackdrop = document.getElementById('cartBackdrop');
    this.cartDrawer = document.getElementById('cartDrawer');
    this.cartCountBadge = document.getElementById('cartCountBadge');
    this.wishlistCountBadge = document.getElementById('wishlistCountBadge');
    this.cartBody = document.getElementById('cartBody');
    this.cartFooter = document.getElementById('cartFooter');

    this.subtotalVal = document.getElementById('subtotalVal');
    this.taxVal = document.getElementById('taxVal');
    this.shippingVal = document.getElementById('shippingVal');
    this.totalVal = document.getElementById('totalVal');
    this.checkoutBtn = document.getElementById('checkoutBtn');
    this.continueBtn = document.getElementById('continueBtn');

    // Wishlist Drawer elements
    this.wishlistBackdrop = document.getElementById('wishlistBackdrop');
    this.wishlistBody = document.getElementById('wishlistBody');
    this.closeWishlistBtn = document.getElementById('closeWishlistBtn');
  },

  loadBootstrapData() {
    if (window.STORE_DATA) {
      state.products = window.STORE_DATA.products || [];
      state.categories = window.STORE_DATA.categories || [];
    }
  },

  bindEvents() {
    // Search event
    let searchTimeout;
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          state.filters.search = e.target.value.trim().toLowerCase();
          this.applyFilters();
        }, 250);
      });

      // Press Enter to search immediately
      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          clearTimeout(searchTimeout);
          state.filters.search = this.searchInput.value.trim().toLowerCase();
          this.applyFilters();
          const grid = document.getElementById('featuredGrid');
          if (grid) grid.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    if (this.searchBtn) {
      this.searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.searchInput) state.filters.search = this.searchInput.value.trim().toLowerCase();
        this.applyFilters();
        const grid = document.getElementById('featuredGrid');
        if (grid) grid.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (this.searchCategorySelect) {
      this.searchCategorySelect.addEventListener('change', (e) => {
        state.filters.category = e.target.value;
        this.applyFilters();
      });
    }

    // Logo Click Reset
    const logoLink = document.getElementById('logoLink');
    if (logoLink) {
      logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.clearFilters();
      });
    }

    // Featured Tabs filtering
    if (this.featuredTabs) {
      this.featuredTabs.querySelectorAll('.featured-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          this.featuredTabs.querySelectorAll('.featured-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          this.setCategory(tab.dataset.category);
        });
      });
    }

    // Drawers toggle events
    if (this.cartToggleBtn) this.cartToggleBtn.addEventListener('click', () => this.toggleCart(true));
    if (this.closeCartBtn) this.closeCartBtn.addEventListener('click', () => this.toggleCart(false));
    if (this.continueBtn) this.continueBtn.addEventListener('click', () => this.toggleCart(false));
    if (this.cartBackdrop) {
      this.cartBackdrop.addEventListener('click', (e) => {
        if (e.target === this.cartBackdrop) this.toggleCart(false);
      });
    }

    if (this.wishlistToggleBtn) this.wishlistToggleBtn.addEventListener('click', () => this.toggleWishlistDrawer(true));
    if (this.closeWishlistBtn) this.closeWishlistBtn.addEventListener('click', () => this.toggleWishlistDrawer(false));
    if (this.wishlistBackdrop) {
      this.wishlistBackdrop.addEventListener('click', (e) => {
        if (e.target === this.wishlistBackdrop) this.toggleWishlistDrawer(false);
      });
    }

    // Checkout trigger
    if (this.checkoutBtn) {
      this.checkoutBtn.addEventListener('click', () => {
        if (state.cart.length === 0) return;
        UIAnimations.showToast("Secure checkout in progress...", "info");
        setTimeout(() => {
          UIAnimations.showToast("Order placed successfully!", "success");
          state.cart = [];
          this.saveCartToLocalStorage();
          this.updateCartUI();
          this.toggleCart(false);
        }, 1500);
      });
    }
  },

  renderCategoriesMenu() {
    if (!this.navCategoriesMenu) return;
    this.navCategoriesMenu.innerHTML = '';
    
    state.categories.forEach(cat => {
      if (cat.id === 'All') return;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#featuredGrid';
      a.innerHTML = `${cat.emoji || '🥬'} ${cat.name}`;
      a.addEventListener('click', () => this.setCategory(cat.id));
      li.appendChild(a);
      this.navCategoriesMenu.appendChild(li);
    });
  },

  renderCategoryCards() {
    if (!this.categoriesGridCards) return;
    this.categoriesGridCards.innerHTML = '';

    state.categories.forEach(cat => {
      const card = document.createElement('div');
      card.className = `category-card-item ${cat.id === 'All' ? 'active' : ''}`;
      card.dataset.id = cat.id;
      card.innerHTML = `
        <span class="category-card-emoji">${cat.emoji || '🥬'}</span>
        <span class="category-card-name">${cat.name}</span>
      `;

      card.addEventListener('click', () => {
        document.querySelectorAll('.category-card-item').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.setCategory(cat.id);
        
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

    const bestsellers = state.products.filter(p => p.featured || p.originalPrice);
    const list = bestsellers.length > 0 ? bestsellers : state.products.slice(0, 4);

    list.forEach(product => {
      const card = this.createProductCard(product);
      this.bestsellerGrid.appendChild(card);
    });
  },

  renderFeaturedProducts(category = 'All') {
    if (!this.featuredGrid) return;
    
    const filtered = category === 'All' 
      ? state.products.slice(0, 4) 
      : state.products.filter(p => p.category.toLowerCase() === category.toLowerCase()).slice(0, 4);

    this.renderProductsToGrid(filtered, this.featuredGrid);
  },

  renderProductsToGrid(products, grid) {
    if (!grid) return;
    grid.innerHTML = '';

    if (products.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: #64748B;">
          <span style="font-size: 3.5rem; display: block; margin-bottom: 1rem;">🥬</span>
          <h3>No Products Found</h3>
          <p>We couldn't find any products matching those criteria.</p>
        </div>
      `;
      return;
    }

    products.forEach(product => {
      const card = this.createProductCard(product);
      grid.appendChild(card);
    });

    UIAnimations.animateGridEntrance(grid);
  },

  createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';

    const discountBadge = product.originalPrice 
      ? `<span class="card-badge red">Sale -${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>` 
      : (product.badge ? `<span class="card-badge ${product.badgeColor || 'green'}">${product.badge}</span>` : '');

    const isFav = state.wishlist.includes(product.id);
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
    card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
      this.addToCart(product.id, 1);
    });

    card.querySelector('.fav-btn').addEventListener('click', (e) => {
      this.toggleWishlist(product.id, e.currentTarget);
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

  setCategory(catId) {
    state.filters.category = catId;

    // Sync header dropdown
    if (this.searchCategorySelect) {
      this.searchCategorySelect.value = catId;
    }

    // Sync tabs
    document.querySelectorAll('.featured-tab').forEach(tab => {
      if (tab.dataset.category === catId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Sync category cards
    document.querySelectorAll('.category-card-item').forEach(card => {
      if (card.dataset.id === catId) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    this.applyFilters();
  },

  applyFilters() {
    const grid = this.featuredGrid;
    if (!grid) return;

    UIAnimations.renderSkeletons(grid);

    const filtered = state.products.filter(product => {
      // Category match
      if (state.filters.category !== 'All' && product.category.toLowerCase() !== state.filters.category.toLowerCase()) {
        return false;
      }
      // Search match
      if (state.filters.search) {
        const query = state.filters.search;
        const isDairyQuery = query.includes('diary') || query.includes('dairy');
        const isVegetableQuery = query.includes('vegetable');
        const nameMatch = product.name.toLowerCase().includes(query);
        const descMatch = product.description.toLowerCase().includes(query);
        const tagMatch = product.tags && product.tags.some(t => t.toLowerCase().includes(query));
        const categoryMatch = product.category.toLowerCase().includes(query) || 
                              (isDairyQuery && product.category.toLowerCase() === 'dairy') ||
                              (isVegetableQuery && product.category.toLowerCase() === 'produce');
        if (!nameMatch && !descMatch && !tagMatch && !categoryMatch) return false;
      }
      return true;
    });

    setTimeout(() => {
      const heading = document.querySelector('.featured-section h2');
      if (heading) {
        if (state.filters.search) {
          heading.textContent = `Search Results for "${state.filters.search}"`;
        } else if (state.filters.category !== 'All') {
          const catName = state.filters.category.charAt(0).toUpperCase() + state.filters.category.slice(1);
          heading.textContent = `Featured ${catName}`;
        } else {
          heading.textContent = "Featured Product";
        }
      }

      this.renderProductsToGrid(filtered, grid);
    }, 200);
  },

  clearFilters() {
    state.filters = {
      category: 'All',
      search: ''
    };
    if (this.searchInput) this.searchInput.value = '';
    if (this.searchCategorySelect) this.searchCategorySelect.value = 'All';
    this.setCategory('All');
  },

  // Cart Functions
  addToCart(productId, quantity = 1) {
    const product = state.products.find(p => p.id === productId);
    if (!product || !product.inStock) return;

    const existing = state.cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      state.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }

    this.saveCartToLocalStorage();
    this.updateCartUI();
    UIAnimations.showToast(`Added "${product.name}" to basket!`, "success");
  },

  removeFromCart(productId) {
    const idx = state.cart.findIndex(item => item.id === productId);
    if (idx !== -1) {
      const removed = state.cart.splice(idx, 1)[0];
      this.saveCartToLocalStorage();
      this.updateCartUI();
      UIAnimations.showToast(`Removed "${removed.name}" from basket`, "info");
    }
  },

  updateQuantity(productId, change) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
      this.removeFromCart(productId);
    } else {
      this.saveCartToLocalStorage();
      this.updateCartUI();
    }
  },

  updateCartUI() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (this.cartCountBadge) this.cartCountBadge.textContent = totalItems;

    if (!this.cartBody) return;

    if (state.cart.length === 0) {
      this.cartBody.innerHTML = `
        <div style="text-align:center; padding: 4rem 1rem; color: #64748B;">
          <span style="font-size: 3rem; display:block; margin-bottom:1rem;">🛒</span>
          <h3>Your Basket is Empty</h3>
          <p>Browse our products and add them to your cart.</p>
        </div>
      `;
      if (this.cartFooter) this.cartFooter.style.display = 'none';
      return;
    }

    this.cartBody.innerHTML = '';
    const list = document.createElement('div');
    list.className = 'cart-list';

    state.cart.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="item-price">₹${item.price.toFixed(2)}</div>
          <div style="margin-top: 0.5rem;">
            <div class="quantity-controller">
              <button class="qty-btn dec-btn">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn inc-btn">+</button>
            </div>
          </div>
        </div>
        <div class="cart-item-actions">
          <span class="item-total">₹${(item.price * item.quantity).toFixed(2)}</span>
          <button class="remove-item-btn" title="Remove">✕</button>
        </div>
      `;

      itemEl.querySelector('.dec-btn').addEventListener('click', () => this.updateQuantity(item.id, -1));
      itemEl.querySelector('.inc-btn').addEventListener('click', () => this.updateQuantity(item.id, 1));
      itemEl.querySelector('.remove-item-btn').addEventListener('click', () => this.removeFromCart(item.id));

      list.appendChild(itemEl);
    });

    this.cartBody.appendChild(list);

    // Calculations
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05; // 5% GST
    const shipping = subtotal >= 499 ? 0 : 49.00;
    const total = subtotal + tax + shipping;

    if (this.subtotalVal) this.subtotalVal.textContent = `₹${subtotal.toFixed(2)}`;
    if (this.taxVal) this.taxVal.textContent = `₹${tax.toFixed(2)}`;
    if (this.shippingVal) this.shippingVal.textContent = shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`;
    if (this.totalVal) this.totalVal.textContent = `₹${total.toFixed(2)}`;

    if (this.cartFooter) this.cartFooter.style.display = 'block';
  },

  // Wishlist Functions
  toggleWishlist(productId, btnElement) {
    const idx = state.wishlist.indexOf(productId);
    const product = state.products.find(p => p.id === productId);

    if (idx === -1) {
      state.wishlist.push(productId);
      if (btnElement) btnElement.classList.add('active');
      UIAnimations.showToast(`Added "${product.name}" to wishlist`, "success");
    } else {
      state.wishlist.splice(idx, 1);
      if (btnElement) btnElement.classList.remove('active');
      UIAnimations.showToast(`Removed "${product.name}" from wishlist`, "info");
    }

    this.saveWishlistToLocalStorage();
    this.updateWishlistUI();
  },

  updateWishlistUI() {
    const count = state.wishlist.length;
    if (this.wishlistCountBadge) {
      this.wishlistCountBadge.textContent = count;
      this.wishlistCountBadge.style.display = count > 0 ? 'inline-block' : 'none';
    }

    if (!this.wishlistBody) return;

    if (state.wishlist.length === 0) {
      this.wishlistBody.innerHTML = `
        <div style="text-align:center; padding: 4rem 1rem; color: #64748B;">
          <span style="font-size: 3rem; display:block; margin-bottom:1rem;">❤️</span>
          <h3>Your Wishlist is Empty</h3>
          <p>Tap the heart on any product to save it here.</p>
        </div>
      `;
      return;
    }

    this.wishlistBody.innerHTML = '';
    const list = document.createElement('div');
    list.className = 'cart-list';

    state.wishlist.forEach(id => {
      const product = state.products.find(p => p.id === id);
      if (!product) return;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="cart-item-image">
        <div class="cart-item-info">
          <h4>${product.name}</h4>
          <div class="item-price">₹${product.price.toFixed(2)}</div>
        </div>
        <div class="cart-item-actions">
          <button class="add-to-cart-btn" style="padding:0.4rem 0.8rem; font-size:0.8rem;">🛒 Add</button>
          <button class="remove-wish-btn" style="background:none; border:none; color:red; margin-top:0.5rem; cursor:pointer;">Remove</button>
        </div>
      `;

      itemEl.querySelector('.add-to-cart-btn').addEventListener('click', () => this.addToCart(product.id, 1));
      itemEl.querySelector('.remove-wish-btn').addEventListener('click', () => this.toggleWishlist(product.id, null));

      list.appendChild(itemEl);
    });

    this.wishlistBody.appendChild(list);
  },

  toggleCart(open) {
    if (!this.cartBackdrop) return;
    if (open) {
      this.cartBackdrop.classList.add('active');
    } else {
      this.cartBackdrop.classList.remove('active');
    }
  },

  toggleWishlistDrawer(open) {
    if (!this.wishlistBackdrop) return;
    if (open) {
      this.wishlistBackdrop.style.display = 'block';
      setTimeout(() => this.wishlistBackdrop.classList.add('active'), 50);
      this.updateWishlistUI();
    } else {
      this.wishlistBackdrop.classList.remove('active');
      setTimeout(() => this.wishlistBackdrop.style.display = 'none', 300);
    }
  },

  // Slider controls
  initHeroSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.slide');
    const prevBtn = document.getElementById('heroPrevBtn');
    const nextBtn = document.getElementById('heroNextBtn');
    let activeIdx = 0;

    const showSlide = (idx) => {
      slides.forEach(s => s.classList.remove('active'));
      slides[idx].classList.add('active');
    };

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        activeIdx = (activeIdx - 1 + slides.length) % slides.length;
        showSlide(activeIdx);
      });

      nextBtn.addEventListener('click', () => {
        activeIdx = (activeIdx + 1) % slides.length;
        showSlide(activeIdx);
      });
    }

    setInterval(() => {
      activeIdx = (activeIdx + 1) % slides.length;
      showSlide(activeIdx);
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

  // Local Storage Helpers
  saveCartToLocalStorage() {
    localStorage.setItem('farmfresh_cart', JSON.stringify(state.cart));
  },
  loadCartFromLocalStorage() {
    const saved = localStorage.getItem('farmfresh_cart');
    if (saved) {
      try {
        state.cart = JSON.parse(saved);
        this.updateCartUI();
      } catch (e) {
        state.cart = [];
      }
    }
  },
  saveWishlistToLocalStorage() {
    localStorage.setItem('farmfresh_wishlist', JSON.stringify(state.wishlist));
  },
  loadWishlistFromLocalStorage() {
    const saved = localStorage.getItem('farmfresh_wishlist');
    if (saved) {
      try {
        state.wishlist = JSON.parse(saved);
        this.updateWishlistUI();
      } catch (e) {
        state.wishlist = [];
      }
    }
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
    document.getElementById('modalProductUnit').textContent = product.unit || 'per unit';
    document.getElementById('modalProductDescription').textContent = product.description;

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
      this.addToCart(product.id, 1);
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

// Bind to window for helper methods
window.ProductFilters = {
  setCategory(catId) {
    FarmFreshApp.setCategory(catId);
  },
  clearFilters() {
    FarmFreshApp.clearFilters();
  }
};
window.FreshMarketApp = FarmFreshApp;

// Bootstrap main application on ready
document.addEventListener('DOMContentLoaded', () => {
  FarmFreshApp.init();
});
