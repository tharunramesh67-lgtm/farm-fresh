/**
 * FreshMarket Products Filtering & Search Logic
 */

const ProductFilters = {
  state: {
    category: 'all',
    minPrice: 0,
    maxPrice: 1500,
    organic: false,
    local: false,
    inStock: false,
    rating: 0,
    search: ''
  },

  init() {
    this.cacheElements();
    this.bindEvents();
    this.resetSliders();
  },

  cacheElements() {
    this.priceMinInput = document.getElementById('priceMin');
    this.priceMaxInput = document.getElementById('priceMax');
    this.minPriceDisplay = document.getElementById('minPriceDisplay');
    this.maxPriceDisplay = document.getElementById('maxPriceDisplay');
    
    this.organicCheck = document.getElementById('organicFilter');
    this.localCheck = document.getElementById('localFilter');
    this.stockCheck = document.getElementById('stockFilter');
    this.ratingSelect = document.getElementById('ratingFilter');
    this.resetBtn = document.getElementById('resetFiltersBtn');
    
    this.searchInput = document.getElementById('searchInput');
    this.searchBtn = document.getElementById('searchBtn');
    this.grid = document.getElementById('productsGrid');
  },

  bindEvents() {
    // Sliders
    this.priceMinInput.addEventListener('input', (e) => {
      let val = parseInt(e.target.value);
      if (val >= parseInt(this.priceMaxInput.value)) {
        val = parseInt(this.priceMaxInput.value) - 10;
        e.target.value = val;
      }
      this.state.minPrice = val;
      this.minPriceDisplay.textContent = `₹${val}`;
      this.debouncedFilter();
    });

    this.priceMaxInput.addEventListener('input', (e) => {
      let val = parseInt(e.target.value);
      if (val <= parseInt(this.priceMinInput.value)) {
        val = parseInt(this.priceMinInput.value) + 10;
        e.target.value = val;
      }
      this.state.maxPrice = val;
      this.maxPriceDisplay.textContent = `₹${val}`;
      this.debouncedFilter();
    });

    // Checkboxes
    this.organicCheck.addEventListener('change', (e) => {
      this.state.organic = e.target.checked;
      this.applyFilters();
    });

    this.localCheck.addEventListener('change', (e) => {
      this.state.local = e.target.checked;
      this.applyFilters();
    });

    this.stockCheck.addEventListener('change', (e) => {
      this.state.inStock = e.target.checked;
      this.applyFilters();
    });

    // Dropdown
    this.ratingSelect.addEventListener('change', (e) => {
      this.state.rating = parseFloat(e.target.value);
      this.applyFilters();
    });

    // Reset button
    this.resetBtn.addEventListener('click', () => this.clearFilters());

    // Live search input
    let searchTimeout;
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.state.search = e.target.value.trim();
        this.applyFilters();
      }, 300);
    });

    this.searchBtn.addEventListener('click', () => {
      this.state.search = this.searchInput.value.trim();
      this.applyFilters();
    });
  },

  resetSliders() {
    this.state.minPrice = parseInt(this.priceMinInput.value);
    this.state.maxPrice = parseInt(this.priceMaxInput.value);
    this.minPriceDisplay.textContent = `₹${this.state.minPrice}`;
    this.maxPriceDisplay.textContent = `₹${this.state.maxPrice}`;
  },

  /**
   * Set category and filter
   */
  setCategory(catId) {
    this.state.category = catId;
    this.applyFilters();
  },

  /**
   * Apply filters through fetching backend api/filter.php
   */
  async applyFilters() {
    window.UIAnimations.renderSkeletons(this.grid);

    const queryParams = new URLSearchParams({
      category: this.state.category,
      min_price: this.state.minPrice,
      max_price: this.state.maxPrice,
      organic: this.state.organic,
      local: this.state.local,
      in_stock: this.state.inStock,
      rating: this.state.rating,
      search: this.state.search
    });

    try {
      const response = await fetch(`api/filter.php?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Filter request failed");
      
      const filteredProducts = await response.json();
      
      // Update global store state and redraw
      window.FreshMarketApp.updateProductList(filteredProducts);
    } catch(err) {
      console.error(err);
      window.UIAnimations.showToast("Could not load products. Please check connection.", "error");
    }
  },

  /**
   * Clears state and controls
   */
  clearFilters() {
    this.state = {
      category: 'all',
      minPrice: 0,
      maxPrice: 1500,
      organic: false,
      local: false,
      inStock: false,
      rating: 0,
      search: ''
    };

    // Reset UI Inputs
    this.priceMinInput.value = 0;
    this.priceMaxInput.value = 1500;
    this.minPriceDisplay.textContent = '₹0';
    this.maxPriceDisplay.textContent = '₹1500';
    
    this.organicCheck.checked = false;
    this.localCheck.checked = false;
    this.stockCheck.checked = false;
    this.ratingSelect.value = '0';
    this.searchInput.value = '';

    // Reset Active tab
    document.querySelectorAll('.category-btn').forEach(btn => {
      if (btn.dataset.id === 'all') {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    this.applyFilters();
    window.UIAnimations.showToast("All filters cleared successfully", "info");
  },

  /**
   * Debounces fast price adjustments
   */
  debouncedFilter() {
    clearTimeout(this.filterTimeout);
    this.filterTimeout = setTimeout(() => {
      this.applyFilters();
    }, 250);
  }
};

// Export
window.ProductFilters = ProductFilters;
