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
  <title>Farm Fresh | Premium Organic Grocery Store</title>
  <meta name="description" content="Shop organic produce, premium dairy, artisan bakeries, and beverages at Farm Fresh. Fast delivery and quality guaranteed.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Inter:wght@400;500;600;700&family=Comfortaa:wght@500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <!-- Top Bar -->
  <div class="top-bar">
    <div class="top-bar-container">
      <div class="top-bar-left">
        <span>📞 +123 4567 890</span>
        <span class="separator">|</span>
        <span>✉️ support@farmfresh.com</span>
      </div>
      <div class="top-bar-right">
        <div class="lang-selector">
          <span>English</span> <span class="arrow">▼</span>
        </div>
        <span class="separator">|</span>
        <a href="#register" class="register-link">Register</a>
      </div>
    </div>
  </div>

  <!-- Header -->
  <header class="header">
    <div class="header-container">
      <a href="#" class="logo" id="logoLink">
        <span class="logo-emoji">🥬</span>
        <span class="logo-text">Farm Fresh</span>
      </a>

      <!-- Redesigned Search bar -->
      <div class="search-bar">
        <input type="text" id="searchInput" placeholder="Search fresh fruits, leafy spinach, paneer, tea...">
        <button class="search-btn" id="searchBtn">Search</button>
      </div>

      <div class="header-actions">
        <a href="#profile" class="action-btn-circle" title="My Account">
          👤
        </a>

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

  <!-- Main Navigation Menu -->
  <nav class="main-navigation">
    <div class="nav-container">
      <ul class="nav-menu">
        <li><a href="#" class="active">Home</a></li>
        <li class="dropdown">
          <a href="#featuredGrid">Shop <span class="arrow">▼</span></a>
          <ul class="dropdown-menu">
            <li><a href="#featuredGrid" onclick="window.ProductFilters.setCategory('produce')">Fresh Produce</a></li>
            <li><a href="#featuredGrid" onclick="window.ProductFilters.setCategory('dairy')">Organic Dairy</a></li>
            <li><a href="#featuredGrid" onclick="window.ProductFilters.setCategory('bakery')">Bakery Specials</a></li>
          </ul>
        </li>
        <li class="dropdown">
          <a href="#categories">Categories <span class="arrow">▼</span></a>
          <ul class="dropdown-menu" id="navCategoriesMenu">
            <!-- Filled via script.js -->
          </ul>
        </li>
        <li><a href="#blog">Blog</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
  </nav>

  <!-- Hero Slider -->
  <section class="hero-slider" id="heroSlider">
    <div class="slides-container">
      <div class="slide active" style="background-color: #FEE2E2;">
        <div class="slide-content">
          <span class="hero-tag">🚜 100% Organic & Local</span>
          <h2>Farm Fresh Organic <br>We Care Always</h2>
          <p>Hand picked fresh vegetables straight to your doorstep today.</p>
          <a href="#featuredGrid" class="hero-cta">Shop Now</a>
        </div>
        <div class="slide-image">
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80" alt="Farm Fresh Basket">
        </div>
      </div>
      <div class="slide" style="background-color: #ECFDF5;">
        <div class="slide-content">
          <span class="hero-tag">🥛 Pasture Raised Dairy</span>
          <h2>Pure & Rich Dairy <br>From Local Farms</h2>
          <p>Indulge in organic milk, golden ghee, and creamy malai paneer.</p>
          <a href="#featuredGrid" class="hero-cta">Shop Dairy</a>
        </div>
        <div class="slide-image">
          <img src="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80" alt="Fresh Dairy products">
        </div>
      </div>
    </div>
    <button class="slider-arrow prev" id="heroPrevBtn">❮</button>
    <button class="slider-arrow next" id="heroNextBtn">❯</button>
  </section>

  <!-- Product Categories Section -->
  <section class="section categories-section" id="categories">
    <div class="container">
      <div class="section-header">
        <h2>Product Categories</h2>
        <a href="#featuredGrid" class="view-all-link">View All Categories ❯</a>
      </div>
      <div class="categories-grid-cards" id="categoriesGridCards">
        <!-- Filled Dynamically -->
      </div>
    </div>
  </section>

  <!-- Bestseller Product Section -->
  <section class="section bestseller-section">
    <div class="container">
      <div class="section-header">
        <h2>Bestseller Product</h2>
        <a href="#featuredGrid" class="view-all-link">View all products ❯</a>
      </div>
      <div class="bestseller-carousel">
        <button class="carousel-arrow prev" id="bestPrevBtn">❮</button>
        <div class="bestseller-grid" id="bestsellerGrid">
          <!-- Loaded Dynamically -->
        </div>
        <button class="carousel-arrow next" id="bestNextBtn">❯</button>
      </div>
    </div>
  </section>

  <!-- Shop Our Collections Section -->
  <section class="section collections-section">
    <div class="container collections-grid">
      <div class="collection-card card-orange" style="background-image: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=400&q=80');">
        <div class="card-content">
          <h3>Organic Honey with <br>Healthy Ingredients</h3>
          <a href="#featuredGrid" class="card-btn">Shop Now ❯</a>
        </div>
      </div>
      <div class="collection-card card-green" style="background-image: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1610970881699-44a5587caa9a?auto=format&fit=crop&w=400&q=80');">
        <div class="card-content">
          <h3>100% Fresh Healthy <br>Fruits & Berries</h3>
          <a href="#featuredGrid" class="card-btn">Shop Now ❯</a>
        </div>
      </div>
      <div class="collection-card card-yellow" style="background-image: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80');">
        <div class="card-content">
          <h3>Home Made Natural <br>Fruit Ingredients</h3>
          <a href="#featuredGrid" class="card-btn">Shop Now ❯</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Trusted Brands Section -->
  <section class="brands-section">
    <div class="container brands-container">
      <div class="brand-item">🌱 <span>100% Organic</span></div>
      <div class="brand-item">🚜 <span>Direct Farm Source</span></div>
      <div class="brand-item">🛡️ <span>Secure Checkout</span></div>
      <div class="brand-item">🚚 <span>Instant Delivery</span></div>
      <div class="brand-item">🏅 <span>Premium Quality</span></div>
      <div class="brand-item">😊 <span>Happy Customers</span></div>
    </div>
  </section>

  <!-- Featured Product Section -->
  <section class="section featured-section">
    <div class="container">
      <div class="section-header">
        <h2>Featured Product</h2>
        <div class="featured-tabs" id="featuredTabs">
          <button class="featured-tab active" data-category="All">All Products</button>
          <button class="featured-tab" data-category="Produce">Vegetables</button>
          <button class="featured-tab" data-category="Dairy">Dairy</button>
          <button class="featured-tab" data-category="Bakery">Bakery</button>
        </div>
      </div>
      <div class="featured-grid" id="featuredGrid">
        <!-- Loaded Dynamically -->
      </div>
    </div>
  </section>

  <!-- Big Deals Middle Banner -->
  <section class="middle-banner">
    <div class="container middle-banner-container">
      <div class="middle-banner-content">
        <span class="banner-tag">Save Up To 50% Off</span>
        <h2>Big Deals Trending Of Week & Fresh Products</h2>
        <a href="#featuredGrid" class="hero-cta">Shop Now</a>
      </div>
      <div class="middle-banner-image">
        <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80" alt="Couple shopping">
      </div>
    </div>
  </section>

  <!-- What Our Customers Say -->
  <section class="section testimonials-section">
    <div class="container">
      <div class="section-header center">
        <h2>What Our Customers Say</h2>
      </div>
      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="user-info">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Laura Johnsen" class="user-avatar">
            <div>
              <h4>Laura Johnsen</h4>
              <span class="rating">★★★★★</span>
            </div>
          </div>
          <p>"The vegetable quality is outstanding. Super fresh, packaged carefully, and always delivered on time. Highly recommended!"</p>
        </div>
        <div class="testimonial-card">
          <div class="user-info">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" alt="Ahmed Khan" class="user-avatar">
            <div>
              <h4>Ahmed Khan</h4>
              <span class="rating">★★★★★</span>
            </div>
          </div>
          <p>"I buy milk, ghee, and local greens weekly. The quality is far better than regular supermarkets. Pure farm-fresh goodness."</p>
        </div>
        <div class="testimonial-card">
          <div class="user-info">
            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" alt="Irena Petrova" class="user-avatar">
            <div>
              <h4>Irena Petrova</h4>
              <span class="rating">★★★★★</span>
            </div>
          </div>
          <p>"Outstanding customer support! I had a minor issue with my delivery and it was resolved within 10 minutes. Love Farm Fresh!"</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Latest From Our Blog -->
  <section class="section blog-section" id="blog">
    <div class="container">
      <div class="section-header">
        <h2>Latest From Our Blog</h2>
        <a href="#blog" class="view-all-link">View Blog ❯</a>
      </div>
      <div class="blog-grid">
        <article class="blog-card">
          <div class="blog-img-wrapper">
            <img src="https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=400&q=80" alt="Seasonal eating">
          </div>
          <div class="blog-meta">🌱 Farm Fresh • May 28, 2026</div>
          <h3>Seasonal Eating: Why It Matters For Your Health</h3>
          <p>Eating seasonal foods means you get them at the peak of their freshness and nutritional value.</p>
          <a href="#blog" class="blog-link">Read More ❯</a>
        </article>
        <article class="blog-card">
          <div class="blog-img-wrapper">
            <img src="https://images.unsplash.com/photo-1610970881699-44a5587caa9a?auto=format&fit=crop&w=400&q=80" alt="Fruit desserts">
          </div>
          <div class="blog-meta">💡 Tips • May 26, 2026</div>
          <h3>5 Simple Fruit Desserts That Require No Baking</h3>
          <p>Enjoy quick, healthy, and cooling treats made with fresh summer organic berries.</p>
          <a href="#blog" class="blog-link">Read More ❯</a>
        </article>
        <article class="blog-card">
          <div class="blog-img-wrapper">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80" alt="Meet the farmers">
          </div>
          <div class="blog-meta">🚜 Spotlight • May 25, 2026</div>
          <h3>Meet The Farmers: The Johnson's Organic Journey</h3>
          <p>Discover the passion and hard work behind the organic vegetables delivered to your home.</p>
          <a href="#blog" class="blog-link">Read More ❯</a>
        </article>
        <article class="blog-card">
          <div class="blog-img-wrapper">
            <img src="https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80" alt="Store produce">
          </div>
          <div class="blog-meta">💡 Tips • May 24, 2026</div>
          <h3>How To Properly Store Produce To Maximize Freshness</h3>
          <p>Learn storage hacks to keep your leafy greens and vegetables fresh twice as long.</p>
          <a href="#blog" class="blog-link">Read More ❯</a>
        </article>
      </div>
    </div>
  </section>

  <!-- Newsletter Signup -->
  <section class="newsletter-section">
    <div class="container newsletter-container">
      <div class="newsletter-content">
        <h2>Join Our Newsletter</h2>
        <p>Subscribe to receive weekly farm-fresh recipes, exclusive deals, and organic living tips.</p>
      </div>
      <form class="newsletter-form" onsubmit="event.preventDefault(); alert('Subscribed to Newsletter successfully!');">
        <input type="email" placeholder="Your Email Address" required>
        <button type="submit">Subscribe</button>
      </form>
    </div>
  </section>

  <!-- Cart Sidebar Drawer -->
  <div class="drawer-backdrop" id="cartBackdrop">
    <div class="drawer" id="cartDrawer">
      <div class="drawer-header">
        <h2>Your Shopping Cart</h2>
        <button class="icon-btn" id="closeCartBtn" style="width: 2.25rem; height: 2.25rem;">
          ✕
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
        </button>
        <button class="btn-continue" id="continueBtn">Continue Shopping</button>
      </div>
    </div>
  </div>

  <!-- Wishlist Drawer (Dynamic) -->
  <div class="drawer-backdrop" id="wishlistBackdrop" style="display: none;">
    <div class="drawer" id="wishlistDrawer">
      <div class="drawer-header">
        <h2>Your Wishlist</h2>
        <button class="icon-btn" id="closeWishlistBtn" style="width: 2.25rem; height: 2.25rem;">
          ✕
        </button>
      </div>
      <div class="drawer-body" id="wishlistBody">
        <!-- Dynamic Wishlist Items -->
      </div>
    </div>
  </div>

  <!-- Redesigned Dark Footer Area -->
  <footer class="footer footer-dark">
    <div class="footer-container">
      <div class="footer-section" id="about">
        <a href="#" class="logo">
          <span class="logo-emoji">🥬</span>
          <span class="logo-text" style="color: #22C55E;">Farm Fresh</span>
        </a>
        <p class="footer-about">Your premium choice for organic vegetables, dairy, and farm-fresh essentials. Direct from local farms to your home.</p>
        <div class="footer-socials">
          <a href="#">📘</a>
          <a href="#">📷</a>
          <a href="#">🐦</a>
        </div>
      </div>
      <div class="footer-section">
        <h3>Customer Service</h3>
        <ul class="footer-links">
          <li><a href="#profile">My Account</a></li>
          <li><a href="#tracking">Order Tracking</a></li>
          <li><a href="#wishlist">Wishlist</a></li>
          <li><a href="#returns">Returns & Exchanges</a></li>
        </ul>
      </div>
      <div class="footer-section" id="contact">
        <h3>Contact Us</h3>
        <p class="footer-contact">📞 +123 4567 890</p>
        <p class="footer-contact">✉️ support@farmfresh.com</p>
        <p class="footer-contact">📍 Farm Fresh Lane, Green Valley</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; <?php echo date('Y'); ?> Farm Fresh. Premium Organic Grocery. All rights reserved.</p>
    </div>
  </footer>

  <!-- Toast Notification Container -->
  <div class="toast-container" id="toastContainer"></div>

  <!-- Bootstrap initial product data in window scope -->
  <script>
    window.STORE_DATA = <?php echo $productsJson; ?>;
  </script>
  <script src="script.js"></script>
</body>
</html>
