/**
 * FreshMarket Cart Operations & Wishlist drawer management
 */

const CartManager = {
  cart: [],
  wishlist: JSON.parse(localStorage.getItem('freshmarket_wishlist')) || [],

  init() {
    this.cacheElements();
    this.bindEvents();
    this.fetchCart();
    this.updateWishlistUI();
  },

  cacheElements() {
    // Cart elements
    this.cartToggle = document.getElementById('cartToggleBtn');
    this.cartClose = document.getElementById('closeCartBtn');
    this.cartBackdrop = document.getElementById('cartBackdrop');
    this.cartSidebar = document.getElementById('cartSidebar');
    this.cartItemsContainer = document.getElementById('cartItems');
    this.cartCountBadge = document.getElementById('cartCountBadge');
    
    // Totals
    this.subtotalVal = document.getElementById('subtotal');
    this.taxVal = document.getElementById('tax');
    this.shippingVal = document.getElementById('shipping');
    this.totalVal = document.getElementById('total');
    
    // Delivery Promo
    this.deliveryPromo = document.getElementById('deliveryPromoBanner');
    this.promoRemaining = document.getElementById('promoRemaining');
    
    // Checkout & shopping buttons
    this.checkoutBtn = document.getElementById('checkoutBtn');
    this.continueBtn = document.getElementById('continueShoppingBtn');
    
    // Wishlist elements
    this.wishlistToggle = document.getElementById('wishlistToggleBtn');
    this.wishlistClose = document.getElementById('closeWishlistBtn');
    this.wishlistBackdrop = document.getElementById('wishlistBackdrop');
    this.wishlistSidebar = document.getElementById('wishlistSidebar');
    this.wishlistItemsContainer = document.getElementById('wishlistItems');
    this.wishlistCountBadge = document.getElementById('wishlistCountBadge');
  },

  bindEvents() {
    // Drawer Toggles
    this.cartToggle.addEventListener('click', () => this.openCart());
    this.cartClose.addEventListener('click', () => this.closeCart());
    this.continueBtn.addEventListener('click', () => this.closeCart());
    this.cartBackdrop.addEventListener('click', (e) => {
      if (e.target === this.cartBackdrop) this.closeCart();
    });

    this.wishlistToggle.addEventListener('click', () => this.openWishlist());
    this.wishlistClose.addEventListener('click', () => this.closeWishlist());
    this.wishlistBackdrop.addEventListener('click', (e) => {
      if (e.target === this.wishlistBackdrop) this.closeWishlist();
    });

    // Checkout
    this.checkoutBtn.addEventListener('click', () => this.processCheckout());
  },

  openCart() {
    this.cartBackdrop.classList.add('open');
  },

  closeCart() {
    this.cartBackdrop.classList.remove('open');
  },

  openWishlist() {
    this.wishlistBackdrop.classList.add('open');
    this.renderWishlist();
  },

  closeWishlist() {
    this.wishlistBackdrop.classList.remove('open');
  },

  /**
   * Fetch current session cart from PHP backend
   */
  async fetchCart() {
    try {
      const res = await fetch('api/cart.php?action=get');
      const cartData = await res.json();
      this.updateCartState(cartData);
    } catch (err) {
      console.error("Failed to fetch cart state", err);
    }
  },

  /**
   * Add Product item to cart via API
   */
  async addToCart(productId, quantity = 1, buttonElement = null) {
    const formData = new FormData();
    formData.append('action', 'add');
    formData.append('product_id', productId);
    formData.append('quantity', quantity);

    try {
      if (buttonElement) {
        buttonElement.disabled = true;
        buttonElement.innerHTML = 'Adding...';
      }

      const res = await fetch('api/cart.php', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        this.updateCartState(data.cart);
        window.UIAnimations.showToast(data.message, "success");
        
        // Bounce badge
        this.cartCountBadge.style.transform = "scale(1.3)";
        setTimeout(() => this.cartCountBadge.style.transform = "scale(1)", 200);

        if (buttonElement) {
          buttonElement.classList.add('added');
          buttonElement.innerHTML = '✓ Added to Basket';
          setTimeout(() => {
            buttonElement.classList.remove('added');
            buttonElement.innerHTML = '🛒 Add to Basket';
            buttonElement.disabled = false;
          }, 1200);
        }
      } else {
        window.UIAnimations.showToast(data.message, "error");
        if (buttonElement) {
          buttonElement.innerHTML = '🛒 Add to Basket';
          buttonElement.disabled = false;
        }
      }
    } catch(err) {
      console.error(err);
      window.UIAnimations.showToast("Failed to add product to basket", "error");
      if (buttonElement) {
        buttonElement.innerHTML = '🛒 Add to Basket';
        buttonElement.disabled = false;
      }
    }
  },

  /**
   * Update Quantity of Product inside Session
   */
  async updateQuantity(productId, quantity) {
    const formData = new FormData();
    formData.append('action', 'update');
    formData.append('product_id', productId);
    formData.append('quantity', quantity);

    try {
      const res = await fetch('api/cart.php', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        this.updateCartState(data.cart);
      }
    } catch(err) {
      console.error(err);
      window.UIAnimations.showToast("Could not update item quantity", "error");
    }
  },

  /**
   * Remove item from cart
   */
  async removeFromCart(productId) {
    const formData = new FormData();
    formData.append('action', 'remove');
    formData.append('product_id', productId);

    try {
      const res = await fetch('api/cart.php', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        this.updateCartState(data.cart);
        window.UIAnimations.showToast(data.message, "info");
      }
    } catch(err) {
      console.error(err);
      window.UIAnimations.showToast("Could not remove item from basket", "error");
    }
  },

  /**
   * Update Cart UI elements and totals
   */
  updateCartState(cartData) {
    this.cart = cartData.items || [];
    const summary = cartData.summary || {};

    // Update Counts
    const totalCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCountBadge.textContent = totalCount;

    // Render Items
    this.renderCartItems();

    // Render Summary
    const cur = summary.currency || '₹';
    this.subtotalVal.textContent = `${cur}${summary.subtotal.toFixed(2)}`;
    this.taxVal.textContent = `${cur}${summary.tax.toFixed(2)}`;
    
    if (summary.subtotal === 0) {
      this.shippingVal.textContent = `${cur}0.00`;
    } else {
      this.shippingVal.textContent = summary.shipping === 0 ? 'FREE' : `${cur}${summary.shipping.toFixed(2)}`;
    }
    
    this.totalVal.textContent = `${cur}${summary.total.toFixed(2)}`;

    // Delivery Promo Banner calculation
    const threshold = summary.freeShippingThreshold || 499.00;
    if (summary.subtotal === 0) {
      this.deliveryPromo.style.display = 'block';
      this.deliveryPromo.classList.remove('free');
      this.deliveryPromo.innerHTML = `Add <strong>${cur}${threshold}</strong> more for FREE delivery!`;
    } else if (summary.subtotal < threshold) {
      const remaining = threshold - summary.subtotal;
      this.deliveryPromo.style.display = 'block';
      this.deliveryPromo.classList.remove('free');
      this.deliveryPromo.innerHTML = `Add <strong>${cur}${remaining.toFixed(2)}</strong> more for FREE delivery!`;
    } else {
      this.deliveryPromo.classList.add('free');
      this.deliveryPromo.innerHTML = `🎉 Your order qualifies for <strong>FREE Delivery</strong>!`;
    }
  },

  renderCartItems() {
    this.cartItemsContainer.innerHTML = '';

    if (this.cart.length === 0) {
      this.cartItemsContainer.innerHTML = `
        <div class="empty-cart-message">
          <span class="empty-cart-emoji">🧺</span>
          <p>Your grocery basket is empty.</p>
          <p style="font-size: 0.8rem;">Explore our high-quality produce and dry pantry items to add them here.</p>
        </div>
      `;
      this.checkoutBtn.disabled = true;
      return;
    }

    this.checkoutBtn.disabled = false;

    this.cart.forEach(item => {
      const cartItemDiv = document.createElement('div');
      cartItemDiv.className = 'cart-item';
      cartItemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">₹${item.price.toFixed(2)} ${item.unit}</span>
          <div class="quantity-controls">
            <button class="qty-dec" data-id="${item.id}">−</button>
            <input type="number" value="${item.quantity}" readonly>
            <button class="qty-inc" data-id="${item.id}">+</button>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; height: 100%;">
          <span style="font-weight: 700; font-family: var(--font-display); color: var(--color-dark);">₹${item.total.toFixed(2)}</span>
          <button class="remove-btn" data-id="${item.id}">✕ Remove</button>
        </div>
      `;

      // Handlers
      cartItemDiv.querySelector('.qty-dec').addEventListener('click', () => {
        this.updateQuantity(item.id, item.quantity - 1);
      });
      cartItemDiv.querySelector('.qty-inc').addEventListener('click', () => {
        this.updateQuantity(item.id, item.quantity + 1);
      });
      cartItemDiv.querySelector('.remove-btn').addEventListener('click', () => {
        this.removeFromCart(item.id);
      });

      this.cartItemsContainer.appendChild(cartItemDiv);
    });
  },

  /**
   * Process simulated checkout
   */
  async processCheckout() {
    this.checkoutBtn.disabled = true;
    this.checkoutBtn.innerHTML = 'Processing Payment...';

    try {
      const res = await fetch('api/checkout.php');
      const data = await res.json();
      
      if (data.success) {
        window.UIAnimations.showToast(`Order Placed! ID: ${data.orderId}`, "success");
        setTimeout(() => {
          window.UIAnimations.showToast(`Delivery Scheduled: ${data.deliveryEstimation}`, "info");
        }, 1200);
        
        this.closeCart();
        this.fetchCart();
      } else {
        window.UIAnimations.showToast(data.message, "error");
      }
    } catch(err) {
      console.error(err);
      window.UIAnimations.showToast("Checkout failed. Please try again.", "error");
    } finally {
      this.checkoutBtn.disabled = false;
      this.checkoutBtn.innerHTML = '🔓 Secure Checkout';
    }
  },

  /**
   * Wishlist logic
   */
  toggleWishlist(productId, btnElement = null) {
    const idx = this.wishlist.indexOf(productId);
    const products = window.FreshMarketApp.products;
    const foundProduct = products.find(p => p.id === productId);

    if (idx === -1) {
      this.wishlist.push(productId);
      window.UIAnimations.showToast(`Added "${foundProduct ? foundProduct.name : 'item'}" to Wishlist`, 'success');
      if (btnElement) {
        btnElement.classList.add('active');
        btnElement.innerHTML = '❤️';
      }
    } else {
      this.wishlist.splice(idx, 1);
      window.UIAnimations.showToast(`Removed "${foundProduct ? foundProduct.name : 'item'}" from Wishlist`, 'info');
      if (btnElement) {
        btnElement.classList.remove('active');
        btnElement.innerHTML = '🤍';
      }
    }

    localStorage.setItem('freshmarket_wishlist', JSON.stringify(this.wishlist));
    this.updateWishlistUI();
    this.renderWishlist();
  },

  updateWishlistUI() {
    const count = this.wishlist.length;
    this.wishlistCountBadge.textContent = count;
    this.wishlistCountBadge.style.display = count > 0 ? 'inline-block' : 'none';
  },

  renderWishlist() {
    this.wishlistItemsContainer.innerHTML = '';
    const products = window.FreshMarketApp.products;

    const wishlistProducts = products.filter(p => this.wishlist.includes(p.id));

    if (wishlistProducts.length === 0) {
      this.wishlistItemsContainer.innerHTML = `
        <div class="empty-cart-message">
          <span style="font-size: 3rem;">❤️</span>
          <p>Your wishlist is empty.</p>
          <p style="font-size: 0.8rem;">Tap the heart icon on any food item to save it for later.</p>
        </div>
      `;
      return;
    }

    wishlistProducts.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'wishlist-item';
      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="wishlist-item-image">
        <div class="wishlist-item-details">
          <span class="wishlist-item-name">${item.name}</span>
          <span class="wishlist-item-price">₹${item.price.toFixed(2)} ${item.unit}</span>
          <button class="add-to-cart-btn" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; margin-top: 0.25rem;" data-id="${item.id}">
            🛒 Add to Basket
          </button>
        </div>
        <button class="wishlist-remove-btn" data-id="${item.id}">✕ Remove</button>
      `;

      itemDiv.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
        this.addToCart(item.id, 1, e.target);
      });

      itemDiv.querySelector('.wishlist-remove-btn').addEventListener('click', () => {
        this.toggleWishlist(item.id);
        
        // Refresh product card heart in main grid if present
        const gridCardBtn = document.querySelector(`.fav-btn[data-id="${item.id}"]`);
        if (gridCardBtn) {
          gridCardBtn.classList.remove('active');
          gridCardBtn.innerHTML = '🤍';
        }
      });

      this.wishlistItemsContainer.appendChild(itemDiv);
    });
  }
};

window.CartManager = CartManager;
