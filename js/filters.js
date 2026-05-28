/**
 * Farm Fresh Products Filtering & Search Logic
 */

const ProductFilters = {
  state: {
    category: 'all',
    search: ''
  },

  init() {
    this.cacheElements();
    this.bindEvents();
  },

  cacheElements() {
    this.searchInput = document.getElementById('searchInput');
    this.searchBtn = document.getElementById('searchBtn');
    this.searchCategorySelect = document.getElementById('searchCategorySelect');
  },

  bindEvents() {
    // Search input
    let searchTimeout;
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.state.search = e.target.value.trim();
          this.applyFilters();
        }, 300);
      });

      // Press Enter to search immediately
      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          clearTimeout(searchTimeout);
          this.state.search = this.searchInput.value.trim();
          this.applyFilters();
        }
      });
    }

    if (this.searchBtn) {
      this.searchBtn.addEventListener('click', () => {
        if (this.searchInput) this.state.search = this.searchInput.value.trim();
        this.applyFilters();
      });
    }

    if (this.searchCategorySelect) {
      this.searchCategorySelect.addEventListener('change', (e) => {
        this.state.category = e.target.value;
        this.applyFilters();
      });
    }
  },

  setCategory(catId) {
    this.state.category = catId;
    
    // Sync header dropdown if exists
    if (this.searchCategorySelect) {
      this.searchCategorySelect.value = catId;
    }
    
    // Sync featured tabs
    document.querySelectorAll('.featured-tab').forEach(tab => {
      if (tab.dataset.category === catId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Highlight category card item
    document.querySelectorAll('.category-card-item').forEach(card => {
      if (card.dataset.id === catId) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    this.applyFilters();
  },

  async applyFilters() {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;

    window.UIAnimations.renderSkeletons(grid);

    const queryParams = new URLSearchParams({
      category: this.state.category,
      search: this.state.search,
      min_price: 0,
      max_price: 1500,
      organic: false,
      local: false,
      in_stock: false,
      rating: 0
    });

    try {
      let filteredProducts = null;

      // 1. Try to fetch from the server if running over HTTP/HTTPS
      if (window.location.protocol.startsWith('http')) {
        try {
          const response = await fetch(`api/filter.php?${queryParams.toString()}`);
          if (response.ok) {
            filteredProducts = await response.json();
          }
        } catch (err) {
          console.warn("API filtering failed, falling back to client-side filtering:", err);
        }
      }

      // 2. Client-side filtering fallback (highly robust for static setups)
      if (!filteredProducts) {
        const allProducts = window.FreshMarketApp ? window.FreshMarketApp.products : [];
        filteredProducts = allProducts.filter(p => {
          // Category match
          if (this.state.category !== 'all' && p.category.toLowerCase() !== this.state.category.toLowerCase()) {
            return false;
          }
          // Search match
          if (this.state.search) {
            const query = this.state.search.toLowerCase();
            const isDairyQuery = query.includes('diary') || query.includes('dairy');
            const isVegetableQuery = query.includes('vegetable');
            const nameMatch = p.name.toLowerCase().includes(query);
            const descMatch = p.description.toLowerCase().includes(query);
            const tagMatch = p.tags && p.tags.some(t => t.toLowerCase().includes(query));
            const categoryMatch = p.category.toLowerCase().includes(query) || 
                                  (isDairyQuery && p.category.toLowerCase() === 'dairy') ||
                                  (isVegetableQuery && p.category.toLowerCase() === 'produce');
            if (!nameMatch && !descMatch && !tagMatch && !categoryMatch) return false;
          }
          return true;
        });
      }

      // Update heading dynamically
      const heading = document.querySelector('.featured-section h2');
      if (heading) {
        if (this.state.search) {
          heading.textContent = `Search Results for "${this.state.search}"`;
        } else if (this.state.category !== 'all') {
          const categoryName = this.state.category.charAt(0).toUpperCase() + this.state.category.slice(1);
          heading.textContent = `Featured ${categoryName}`;
        } else {
          heading.textContent = "Featured Product";
        }
      }

      // Render to featured grid
      if (window.FreshMarketApp) {
        window.FreshMarketApp.renderProductsToGrid(filteredProducts, grid);
      }
    } catch(err) {
      console.error(err);
      window.UIAnimations.showToast("Could not load products. Please check connection.", "error");
    }
  },

  clearFilters() {
    this.state = {
      category: 'all',
      search: ''
    };
    if (this.searchInput) this.searchInput.value = '';
    if (this.searchCategorySelect) this.searchCategorySelect.value = 'all';

    // Reset active tabs
    document.querySelectorAll('.featured-tab').forEach(tab => {
      if (tab.dataset.category === 'all') {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Reset category card item
    document.querySelectorAll('.category-card-item').forEach(card => {
      if (card.dataset.id === 'all') {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    this.applyFilters();
  }
};

window.ProductFilters = ProductFilters;
