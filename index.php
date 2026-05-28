<?php
require_once __DIR__ . '/includes/session.php';
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/config.php';

// Bootstrap product data
$products = get_products();
$categories = get_categories();
$storeData = [
    'categories' => $categories,
    'products' => $products,
    'currency' => CURRENCY_SYMBOL
];
$storeDataJson = json_encode($storeData);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FreshMarket | Premium Organic Grocery Store</title>
  <meta name="description" content="Explore and shop premium, farm-fresh organic vegetables, dairy, meat, bakery items, and beverages. Direct from local farms at great prices.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Inter:wght@400;500;600;700&family=Comfortaa:wght@500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>

  <!-- Dynamic Header -->
  <header class="header">
    <div class="header-container">
      <a href="#" class="logo" id="logoLink">
        <span class="logo-emoji">🛒</span>
        <span class="logo-text">FreshMarket</span>
      </a>

      <div class="search-bar">
        <input type="text" id="searchInput" placeholder="Search fresh fruits, leafy spinach, paneer, tea...">
        <button class="search-btn" id="searchBtn">🔍</button>
      </div>

      <div class="header-actions">
        <button class="action-btn" id="wishlistToggleBtn" title="Wishlist">
          <span class="btn-icon">❤️</span>
          <span class="btn-text">Wishlist</span>
          <span class="badge" id="wishlistCountBadge" style="display: none;">0</span>
        </button>

        <button class="action-btn cart-btn" id="cartToggleBtn" title="Shopping Cart">
          <span class="btn-icon">🛒</span>
          <span class="btn-text">Cart</span>
          <span class="badge" id="cartCountBadge">0</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Hero Banner -->
  <section class="hero-section">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <span class="hero-tag">🚜 100% Locally Sourced</span>
      <h1>Vibrant, Fresh Food <br>Straight From Farms to Your Kitchen</h1>
      <p>Taste the richness of genuine organic produce, creamy pasture-raised dairy, pure ghee, and artisanal bakery bread curated for you.</p>
      <a href="#shopContainer" class="hero-cta">Shop Fresh Today</a>
    </div>
  </section>

  <!-- Categories Horizontal Navigation -->
  <nav class="categories-nav">
    <div class="categories-container" id="categoryTabs">
      <!-- Generated Dynamically -->
    </div>
  </nav>

  <!-- Main Shop Layout -->
  <div class="container shop-layout" id="shopContainer">

    <!-- Filters Sidebar -->
    <aside class="filters-sidebar" id="filterSidebar">
      <div class="sidebar-header">
        <h3>Filter & Refine</h3>
        <button class="close-sidebar-btn" id="closeFiltersBtn">✕</button>
      </div>
      
      <div class="filter-group">
        <label>Price Range: <span class="price-range-display"><span id="minPriceDisplay">₹0</span> - <span id="maxPriceDisplay">₹1500</span></span></label>
        <div class="range-sliders">
          <input type="range" id="priceMin" min="0" max="1500" value="0" step="10" class="filter-slider">
          <input type="range" id="priceMax" min="0" max="1500" value="1500" step="10" class="filter-slider">
        </div>
      </div>
      
      <div class="filter-group checks-group">
        <label class="checkbox-container">
          <input type="checkbox" id="organicFilter">
          <span class="checkmark"></span>
          🌱 Organic Certified
        </label>
        
        <label class="checkbox-container">
          <input type="checkbox" id="localFilter">
          <span class="checkmark"></span>
          🚜 Locally Sourced
        </label>
        
        <label class="checkbox-container">
          <input type="checkbox" id="stockFilter">
          <span class="checkmark"></span>
          ✓ In Stock Only
        </label>
      </div>
      
      <div class="filter-group">
        <label for="ratingFilter">Minimum Rating</label>
        <select id="ratingFilter" class="filter-select">
          <option value="0">All Ratings</option>
          <option value="4.8">★★★★★ 4.8+ Stars</option>
          <option value="4.5">★★★★☆ 4.5+ Stars</option>
          <option value="4.0">★★★★☆ 4.0+ Stars</option>
        </select>
      </div>
      
      <button class="reset-filters-btn" id="resetFiltersBtn">Clear All Filters</button>
    </aside>

    <!-- Products Content Grid -->
    <section class="products-section">
      <div class="results-header">
        <div class="results-counter">
          Showing <span id="resultsCount" class="count-highlight">0</span> of <span id="totalCount">0</span> products
        </div>
        <button class="mobile-filter-trigger" id="mobileFilterBtn">
          <span>⚙️</span> Filter & Refine
        </button>
      </div>
      
      <div class="products-grid" id="productsGrid">
        <!-- Products dynamically loaded by JS -->
      </div>
    </section>
  </div>

  <!-- Cart Sidebar Drawer -->
  <div class="cart-drawer-backdrop" id="cartBackdrop">
    <aside class="cart-sidebar" id="cartSidebar">
      <div class="cart-header">
        <h2>🛒 Your Basket</h2>
        <button class="cart-close-btn" id="closeCartBtn">✕</button>
      </div>
      
      <div class="cart-items" id="cartItems">
        <!-- Cart items loaded dynamically -->
      </div>
      
      <div class="cart-summary" id="cartSummarySection">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span id="subtotal">₹0.00</span>
        </div>
        <div class="summary-row">
          <span>Tax (5% GST):</span>
          <span id="tax">₹0.00</span>
        </div>
        <div class="summary-row">
          <span>Delivery Charge:</span>
          <span id="shipping">₹0.00</span>
        </div>
        <div class="summary-row total">
          <span>Estimated Total:</span>
          <span id="total">₹0.00</span>
        </div>
        
        <div class="delivery-promo-banner" id="deliveryPromoBanner">
          Add <span id="promoRemaining">₹0.00</span> more for FREE delivery!
        </div>
      </div>
      
      <div class="cart-actions">
        <button class="checkout-btn" id="checkoutBtn">🔓 Secure Checkout</button>
        <button class="continue-shopping-btn" id="continueShoppingBtn">← Continue Shopping</button>
      </div>
    </aside>
  </div>

  <!-- Wishlist Sidebar Drawer -->
  <div class="wishlist-drawer-backdrop" id="wishlistBackdrop">
    <aside class="wishlist-sidebar" id="wishlistSidebar">
      <div class="wishlist-header">
        <h2>❤️ Your Wishlist</h2>
        <button class="wishlist-close-btn" id="closeWishlistBtn">✕</button>
      </div>
      <div class="wishlist-items" id="wishlistItems">
        <!-- Wishlist items loaded dynamically -->
      </div>
    </aside>
  </div>

  <!-- Toast Notification Container -->
  <div class="toast-container" id="toastContainer"></div>

  <!-- Bootstrap initial product data in window scope -->
  <script>
    window.STORE_DATA = <?php echo $storeDataJson; ?>;
  </script>
  
  <!-- JavaScript Modules -->
  <script src="js/animations.js"></script>
  <script src="js/filters.js"></script>
  <script src="js/cart.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
