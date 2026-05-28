<?php
// Load product data from products.json to bootstrap client-side state
$productsJson = '';
$productsFile = __DIR__ . '/products.json';
if (file_exists($productsFile)) {
    $productsJson = file_get_contents($productsFile);
} else {
    $productsJson = json_encode(['categories' => [], 'products' => []]);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FreshCart | Interactive Premium Grocery Store</title>
  <meta name="description" content="Shop organic produce, premium dairy, artisan bakeries, and beverages at FreshCart. Fast delivery and quality guaranteed.">
  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <!-- Dynamic Header -->
  <header class="header">
    <div class="header-container">
      <a href="#" class="logo" id="logoLink">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <span>FreshCart</span>
      </a>

      <div class="search-bar">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z" />
        </svg>
        <input type="text" id="searchInput" placeholder="Search for products, brands, and more...">
      </div>

      <div class="header-actions">
        <button class="icon-btn" id="wishlistToggleBtn" title="Wishlist">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <span class="badge" id="wishlistCountBadge" style="display: none;">0</span>
        </button>

        <button class="icon-btn" id="cartToggleBtn" title="Shopping Cart">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          <span class="badge" id="cartCountBadge">0</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-content">
      <h1>Fresh Groceries, <br>Delivered Clean to Your Door</h1>
      <p>Enjoy premium organic produce, pasture-raised dairy, hand-baked bread, and artisanal pantry items curated specifically for your kitchen.</p>
    </div>
  </section>

  <!-- Mobile Collapsible Filter Bar -->
  <div class="mobile-filters-bar">
    <button class="mobile-filters-trigger" id="mobileFilterBtn">
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
      Filter & Refine
    </button>
    <div class="results-count" id="mobileResultsCount">Showing 0 products</div>
  </div>

  <!-- Category Nav -->
  <nav class="categories-nav">
    <div class="categories-container" id="categoryTabs">
      <!-- Generated Dynamically -->
    </div>
  </nav>

  <!-- Main Shop Layout -->
  <div class="shop-layout">

    <!-- Filters Sidebar -->
    <aside class="filter-sidebar" id="filterSidebar">
      <!-- Mobile Close Trigger -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;" class="mobile-only-header">
        <h3 style="font-size: 1.25rem;">Filters</h3>
        <button id="closeFiltersBtn" style="background: none; border: none; cursor: pointer; padding: 0.5rem;">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Price Slider -->
      <div class="filter-section">
        <h3>Price Range</h3>
        <div class="price-range">
          <input type="range" id="priceSlider" class="price-slider" min="0" max="50" step="1" value="50">
          <div class="price-labels">
            <span>Min: $0</span>
            <span id="priceLabel">Max: $50</span>
          </div>
        </div>
      </div>

      <!-- Rating Picker -->
      <div class="filter-section">
        <h3>Minimum Rating</h3>
        <div class="stars-selector" id="ratingSelector">
          <label class="star-option">
            <input type="radio" name="ratingFilter" value="0" checked>
            <span>All Ratings</span>
          </label>
          <label class="star-option">
            <input type="radio" name="ratingFilter" value="4.5">
            <span class="rating-stars">★★★★★</span> <span>4.5 & up</span>
          </label>
          <label class="star-option">
            <input type="radio" name="ratingFilter" value="4.0">
            <span class="rating-stars">★★★★☆</span> <span>4.0 & up</span>
          </label>
          <label class="star-option">
            <input type="radio" name="ratingFilter" value="3.5">
            <span class="rating-stars">★★★☆☆</span> <span>3.5 & up</span>
          </label>
        </div>
      </div>

      <!-- Availability Toggle -->
      <div class="filter-section">
        <label class="stock-toggle">
          <h3>In Stock Only</h3>
          <div class="toggle-switch">
            <input type="checkbox" id="stockToggle">
            <span class="slider"></span>
          </div>
        </label>
      </div>

      <!-- Reset Filters Button -->
      <button class="btn-reset" id="resetFiltersBtn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 1.15rem; height:1.15rem;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        Reset All Filters
      </button>
    </aside>

    <!-- Products Section -->
    <main class="products-area">
      <div class="products-header">
        <div class="results-count desktop-only" id="resultsCount">Showing 0 products</div>
      </div>

      <!-- Products Grid -->
      <div class="product-grid" id="productGrid">
        <!-- Rendered by JS or show Skeletons initially -->
      </div>
    </main>

  </div>

  <!-- Cart Backdrop and Slide-in Drawer -->
  <div class="drawer-backdrop" id="cartBackdrop">
    <div class="drawer" id="cartDrawer">
      <div class="drawer-header">
        <h2>Your Shopping Cart</h2>
        <button class="icon-btn" id="closeCartBtn" style="width: 2.25rem; height: 2.25rem;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="drawer-body" id="cartBody">
        <!-- Dynamic Cart List or Empty State -->
      </div>

      <div class="drawer-footer" id="cartFooter" style="display: none;">
        <div class="summary-row">
          <span>Subtotal</span>
          <span id="subtotalVal">$0.00</span>
        </div>
        <div class="summary-row">
          <span>Tax (10%)</span>
          <span id="taxVal">$0.00</span>
        </div>
        <div class="summary-row">
          <span>Shipping</span>
          <span id="shippingVal">$0.00</span>
        </div>
        <div class="summary-row total-row">
          <span>Estimated Total</span>
          <span id="totalVal">$0.00</span>
        </div>
        <button class="checkout-btn" id="checkoutBtn">
          Proceed to Checkout
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 1.25rem; height: 1.25rem;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
        </button>
        <button class="btn-continue" id="continueBtn">Continue Shopping</button>
      </div>
    </div>
  </div>

  <!-- Toast Notification Container -->
  <div class="toast-container" id="toastContainer"></div>

  <!-- Bootstrap initial product data in window scope -->
  <script>
    window.STORE_DATA = <?php echo $productsJson; ?>;
  </script>
  <script src="script.js"></script>
</body>
</html>
