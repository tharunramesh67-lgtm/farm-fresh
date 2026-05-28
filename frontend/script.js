// Global Store State
let state = {
  products: [],
  displayedProducts: [],
  cart: [],
  wishlist: [],
  filters: {
    category: 'All',
    search: '',
    priceMax: 50,
    ratingMin: 0,
    inStockOnly: false
  }
};

// DOM Elements
const productGrid = document.getElementById('productGrid');
const categoryTabs = document.getElementById('categoryTabs');
const searchInput = document.getElementById('searchInput');
const priceSlider = document.getElementById('priceSlider');
const priceLabel = document.getElementById('priceLabel');
const ratingSelector = document.getElementById('ratingSelector');
const stockToggle = document.getElementById('stockToggle');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const resultsCount = document.getElementById('resultsCount');
const mobileResultsCount = document.getElementById('mobileResultsCount');

// Cart & Wishlist Elements
const cartToggleBtn = document.getElementById('cartToggleBtn');
const wishlistToggleBtn = document.getElementById('wishlistToggleBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartBackdrop = document.getElementById('cartBackdrop');
const cartDrawer = document.getElementById('cartDrawer');
const cartCountBadge = document.getElementById('cartCountBadge');
const wishlistCountBadge = document.getElementById('wishlistCountBadge');
const cartBody = document.getElementById('cartBody');
const cartFooter = document.getElementById('cartFooter');
const subtotalVal = document.getElementById('subtotalVal');
const taxVal = document.getElementById('taxVal');
const shippingVal = document.getElementById('shippingVal');
const totalVal = document.getElementById('totalVal');
const checkoutBtn = document.getElementById('checkoutBtn');
const continueBtn = document.getElementById('continueBtn');
const logoLink = document.getElementById('logoLink');

// Mobile filter drawer elements
const mobileFilterBtn = document.getElementById('mobileFilterBtn');
const filterSidebar = document.getElementById('filterSidebar');
const closeFiltersBtn = document.getElementById('closeFiltersBtn');

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
  // Load data bootstrapped by PHP or fallback to fetch
  if (window.STORE_DATA) {
    state.products = window.STORE_DATA.products || [];
    renderCategoryTabs(window.STORE_DATA.categories || []);
    initializeState();
  } else {
    renderSkeletonLoaders();
    try {
      const response = await fetch('products.json');
      const data = await response.json();
      state.products = data.products || [];
      renderCategoryTabs(data.categories || []);
      initializeState();
    } catch (e) {
      console.error("Failed to load products.json:", e);
      showToast("Error loading product catalog", "error");
    }
  }
});

function initializeState() {
  // Load from local storage
  loadCartFromLocalStorage();
  loadWishlistFromLocalStorage();

  // Setup Event Listeners
  setupEventListeners();

  // Initial Filter and Render
  applyFilters();
}

// Render Category Navigation
function renderCategoryTabs(categories) {
  categoryTabs.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `category-btn ${cat === state.filters.category ? 'active' : ''}`;
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      // Toggle active class
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filters.category = cat;
      
      // Simulate loading with skeleton loaders
      renderSkeletonLoaders();
      setTimeout(() => {
        applyFilters();
      }, 300);
    });
    categoryTabs.appendChild(btn);
  });
}

// Render Skeleton Loaders
function renderSkeletonLoaders() {
  productGrid.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    skeleton.innerHTML = `
      <div class="skeleton-image"></div>
      <div class="skeleton-text title"></div>
      <div class="skeleton-text desc"></div>
      <div class="skeleton-text desc" style="width: 60%"></div>
      <div class="skeleton-footer">
        <div class="skeleton-price"></div>
        <div class="skeleton-rating"></div>
      </div>
    `;
    productGrid.appendChild(skeleton);
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Search input change (with debounced-like response)
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      state.filters.search = e.target.value.trim().toLowerCase();
      applyFilters();
    }, 200);
  });

  // Price slider
  priceSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    priceLabel.textContent = `Max: $${val}`;
    state.filters.priceMax = parseFloat(val);
    applyFilters();
  });

  // Rating picker
  ratingSelector.addEventListener('change', (e) => {
    state.filters.ratingMin = parseFloat(e.target.value);
    applyFilters();
  });

  // Stock toggle
  stockToggle.addEventListener('change', (e) => {
    state.filters.inStockOnly = e.target.checked;
    applyFilters();
  });

  // Reset Filters
  resetFiltersBtn.addEventListener('click', resetFilters);

  // Cart open/close triggers
  cartToggleBtn.addEventListener('click', toggleCart);
  closeCartBtn.addEventListener('click', toggleCart);
  continueBtn.addEventListener('click', toggleCart);
  cartBackdrop.addEventListener('click', (e) => {
    if (e.target === cartBackdrop) toggleCart();
  });

  // Mobile Filters toggle
  mobileFilterBtn.addEventListener('click', () => {
    filterSidebar.classList.add('active');
  });
  closeFiltersBtn.addEventListener('click', () => {
    filterSidebar.classList.remove('active');
  });

  // Logo Reset
  logoLink.addEventListener('click', (e) => {
    e.preventDefault();
    resetFilters();
  });

  // Checkout Button
  checkoutBtn.addEventListener('click', () => {
    if (state.cart.length === 0) return;
    showToast('Processing checkout simulation...', 'info');
    setTimeout(() => {
      showToast('Order placed successfully! Thank you.', 'success');
      state.cart = [];
      saveCartToLocalStorage();
      updateCartUI();
      toggleCart();
    }, 1500);
  });
}

// Reset Filters Function
function resetFilters() {
  state.filters = {
    category: 'All',
    search: '',
    priceMax: 50,
    ratingMin: 0,
    inStockOnly: false
  };

  // Reset UI inputs
  searchInput.value = '';
  priceSlider.value = 50;
  priceLabel.textContent = 'Max: $50';
  stockToggle.checked = false;
  
  const ratingRadios = ratingSelector.querySelectorAll('input[type="radio"]');
  ratingRadios.forEach(radio => {
    radio.checked = radio.value === "0";
  });

  document.querySelectorAll('.category-btn').forEach(btn => {
    if (btn.textContent === 'All') {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  applyFilters();
  showToast('Filters reset successfully', 'info');
}

// Apply Filters Pipeline
function applyFilters() {
  productGrid.classList.add('fade-out');

  // Filter list
  state.displayedProducts = state.products.filter(product => {
    // Category match
    if (state.filters.category !== 'All' && product.category.toLowerCase() !== state.filters.category.toLowerCase()) {
      return false;
    }

    // Search match (name or description)
    if (state.filters.search) {
      const nameMatch = product.name.toLowerCase().includes(state.filters.search);
      const descMatch = product.description.toLowerCase().includes(state.filters.search);
      if (!nameMatch && !descMatch) return false;
    }

    // Price match
    if (product.price > state.filters.priceMax) {
      return false;
    }

    // Rating match
    if (product.rating < state.filters.ratingMin) {
      return false;
    }

    // Stock availability
    if (state.filters.inStockOnly && !product.inStock) {
      return false;
    }

    return true;
  });

  // Redraw
  setTimeout(() => {
    renderProducts();
    productGrid.classList.remove('fade-out');
  }, 200);
}

// Render Products Grid
function renderProducts() {
  productGrid.innerHTML = '';

  // Update Counters
  const countStr = `Showing ${state.displayedProducts.length} of ${state.products.length} products`;
  resultsCount.textContent = countStr;
  mobileResultsCount.textContent = countStr;

  if (state.displayedProducts.length === 0) {
    productGrid.innerHTML = `
      <div class="empty-cart-state" style="grid-column: 1 / -1; padding: 4rem 2rem;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3>No Products Found</h3>
        <p>Try broadening your price range, choosing another category, or search term.</p>
        <button class="btn-reset" id="emptyResetBtn" style="max-width: 200px; margin-top: 1rem;">Clear Filters</button>
      </div>
    `;
    document.getElementById('emptyResetBtn').addEventListener('click', resetFilters);
    return;
  }

  state.displayedProducts.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    
    // Construct Sale/Discount indicator
    let badgeHtml = '';
    if (!product.inStock) {
      badgeHtml = `<span class="badge-outofstock">Out of Stock</span>`;
    } else if (product.originalPrice) {
      const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
      badgeHtml = `<span class="badge-sale">-${discount}% OFF</span>`;
    }

    const isFav = state.wishlist.includes(product.id);

    card.innerHTML = `
      <div class="card-badges">
        ${badgeHtml}
      </div>
      <button class="wishlist-btn ${isFav ? 'active' : ''}" data-id="${product.id}" title="Add to Wishlist">
        <svg xmlns="http://www.w3.org/2000/svg" fill="${isFav ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      </button>

      <div class="card-image-wrapper">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${product.inStock ? `
          <div class="card-overlay">
            <button class="quick-add-btn" data-id="${product.id}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="width: 1.15rem; height: 1.15rem;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Quick Add
            </button>
          </div>
        ` : ''}
      </div>

      <div class="card-details">
        <span class="product-cat">${product.category}</span>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <div class="card-footer">
          <div class="card-price">
            <span class="price-current">$${product.price.toFixed(2)}</span>
            ${product.originalPrice ? `<span class="price-original">$${product.originalPrice.toFixed(2)}</span>` : ''}
          </div>
          <div class="card-rating">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>${product.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    `;

    // Quick Add Click Handlers
    const addBtn = card.querySelector('.quick-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(product.id, 1, addBtn);
      });
    }

    // Wishlist Toggle Handler
    const favBtn = card.querySelector('.wishlist-btn');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist(product.id, favBtn);
    });

    productGrid.appendChild(card);
  });
}

// Add to Cart
function addToCart(productId, quantity = 1, buttonElement = null) {
  const product = state.products.find(p => p.id === productId);
  if (!product || !product.inStock) return;

  const existingItem = state.cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }

  saveCartToLocalStorage();
  updateCartUI();

  // Pulse cart badge
  cartCountBadge.classList.remove('pulse');
  void cartCountBadge.offsetWidth; // Trigger reflow to restart animation
  cartCountBadge.classList.add('pulse');

  // Trigger feedback in button if provided
  if (buttonElement) {
    const originalContent = buttonElement.innerHTML;
    buttonElement.style.backgroundColor = '#10B981';
    buttonElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" style="width: 1.15rem; height: 1.15rem;">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
      Added
    `;
    setTimeout(() => {
      buttonElement.innerHTML = originalContent;
      buttonElement.style.backgroundColor = '';
    }, 1000);
  }

  showToast(`Added "${product.name}" to cart!`, 'success');
}

// Remove from Cart with Slide-out Animation
function removeFromCart(productId) {
  const itemIndex = state.cart.findIndex(item => item.id === productId);
  if (itemIndex === -1) return;

  const cartItemDOM = document.querySelector(`.cart-item[data-id="${productId}"]`);
  
  if (cartItemDOM) {
    cartItemDOM.classList.add('removing');
    // Wait for CSS slide out to finish (300ms)
    setTimeout(() => {
      const removedItem = state.cart.splice(itemIndex, 1)[0];
      saveCartToLocalStorage();
      updateCartUI();
      showToast(`Removed "${removedItem.name}" from cart`, 'info');
    }, 300);
  } else {
    state.cart.splice(itemIndex, 1);
    saveCartToLocalStorage();
    updateCartUI();
  }
}

// Update Cart Quantity
function updateQuantity(productId, change) {
  const item = state.cart.find(item => item.id === productId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCartToLocalStorage();
    updateCartUI();
  }
}

// Toggle Wishlist
function toggleWishlist(productId, btnElement) {
  const index = state.wishlist.indexOf(productId);
  const product = state.products.find(p => p.id === productId);

  if (index === -1) {
    state.wishlist.push(productId);
    btnElement.classList.add('active');
    const svg = btnElement.querySelector('svg');
    svg.setAttribute('fill', 'currentColor');
    showToast(`Added "${product.name}" to wishlist`, 'success');
  } else {
    state.wishlist.splice(index, 1);
    btnElement.classList.remove('active');
    const svg = btnElement.querySelector('svg');
    svg.setAttribute('fill', 'none');
    showToast(`Removed "${product.name}" from wishlist`, 'info');
  }

  saveWishlistToLocalStorage();
  updateWishlistUI();
}

// Update Cart Sidebar Content
function updateCartUI() {
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountBadge.textContent = totalItems;
  
  if (state.cart.length === 0) {
    cartBody.innerHTML = `
      <div class="empty-cart-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h3>Your Cart is Empty</h3>
        <p>Browse our categories and add healthy groceries to your basket.</p>
      </div>
    `;
    cartFooter.style.display = 'none';
    return;
  }

  cartBody.innerHTML = '';
  const list = document.createElement('div');
  list.className = 'cart-list';

  state.cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    const cartEl = document.createElement('div');
    cartEl.className = 'cart-item';
    cartEl.setAttribute('data-id', item.id);
    cartEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="item-price">$${item.price.toFixed(2)}</div>
        <div style="margin-top: 0.5rem;">
          <div class="quantity-controller">
            <button class="qty-btn dec-btn" data-id="${item.id}">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn inc-btn" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
      <div class="cart-item-actions">
        <span class="item-total">$${itemTotal.toFixed(2)}</span>
        <button class="remove-item-btn" data-id="${item.id}" title="Remove Item">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    `;

    // Connect handlers
    cartEl.querySelector('.dec-btn').addEventListener('click', () => updateQuantity(item.id, -1));
    cartEl.querySelector('.inc-btn').addEventListener('click', () => updateQuantity(item.id, 1));
    cartEl.querySelector('.remove-item-btn').addEventListener('click', () => removeFromCart(item.id));

    list.appendChild(cartEl);
  });

  cartBody.appendChild(list);

  // Calculations
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.10;
  const shipping = subtotal >= 50 ? 0 : 5.00;
  const total = subtotal + tax + shipping;

  subtotalVal.textContent = `$${subtotal.toFixed(2)}`;
  taxVal.textContent = `$${tax.toFixed(2)}`;
  shippingVal.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
  totalVal.textContent = `$${total.toFixed(2)}`;

  cartFooter.style.display = 'block';
}

// Update Wishlist Badge
function updateWishlistUI() {
  const count = state.wishlist.length;
  if (count > 0) {
    wishlistCountBadge.textContent = count;
    wishlistCountBadge.style.display = 'inline-block';
  } else {
    wishlistCountBadge.style.display = 'none';
  }
}

// Toggle Cart Open/Close
function toggleCart() {
  cartBackdrop.classList.toggle('active');
}

// Toast Notifications
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    `;
  } else {
    iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.085 1.085l-.04.02-.041.02a.75.75 0 01-1.085-1.085l.04-.02zM12 7.5h.008v.008H12V7.5z" />
      </svg>
    `;
  }

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  const container = document.getElementById('toastContainer');
  container.appendChild(toast);

  // Auto remove toast
  setTimeout(() => {
    toast.style.animation = 'toast-in 0.3s ease-in reverse forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Local Storage helpers
function saveCartToLocalStorage() {
  localStorage.setItem('freshcart_cart', JSON.stringify(state.cart));
}

function loadCartFromLocalStorage() {
  const saved = localStorage.getItem('freshcart_cart');
  if (saved) {
    try {
      state.cart = JSON.parse(saved);
      updateCartUI();
    } catch (e) {
      state.cart = [];
    }
  }
}

function saveWishlistToLocalStorage() {
  localStorage.setItem('freshcart_wishlist', JSON.stringify(state.wishlist));
}

function loadWishlistFromLocalStorage() {
  const saved = localStorage.getItem('freshcart_wishlist');
  if (saved) {
    try {
      state.wishlist = JSON.parse(saved);
      updateWishlistUI();
    } catch (e) {
      state.wishlist = [];
    }
  }
}
