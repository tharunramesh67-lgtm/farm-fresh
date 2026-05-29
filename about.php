<?php
require_once __DIR__ . '/includes/session.php';
require_once __DIR__ . '/includes/config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About Us | Farm Fresh Premium Organic</title>
  <meta name="description" content="Learn about Farm Fresh, our mission, sustainable organic farming practices, and how we bring fresh produce straight from local farms to your table.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Inter:wght@400;500;600;700&family=Comfortaa:wght@500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
  <style>
    .about-hero {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(34, 197, 94, 0.7) 100%), 
                  url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80') no-repeat center center/cover;
      padding: 5rem 2rem;
      text-align: center;
      color: white;
      margin-bottom: 3rem;
    }
    .about-hero h1 {
      font-size: 3rem;
      color: white;
      margin-bottom: 1rem;
      font-family: var(--font-display);
    }
    .about-hero p {
      font-size: 1.2rem;
      max-width: 600px;
      margin: 0 auto;
      font-family: var(--font-body);
    }
    .about-container {
      max-width: 1200px;
      margin: 0 auto 4rem auto;
      padding: 0 1.5rem;
    }
    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3.5rem;
      align-items: center;
      margin-bottom: 4rem;
    }
    @media (max-width: 768px) {
      .about-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }
    .about-image img {
      width: 100%;
      border-radius: var(--border-radius-lg);
      border: 3px solid var(--color-brown);
      box-shadow: var(--shadow-md);
      object-fit: cover;
    }
    .about-text h2 {
      font-size: 2.25rem;
      color: var(--color-brown);
      margin-bottom: 1.25rem;
    }
    .about-text p {
      font-size: 1.05rem;
      color: #475569;
      margin-bottom: 1.25rem;
    }
    .values-section {
      background-color: #FFFDF9;
      border: 2px dashed var(--color-brown);
      border-radius: var(--border-radius-lg);
      padding: 3rem 2rem;
      text-align: center;
      margin-top: 4rem;
    }
    .values-section h2 {
      color: var(--color-brown);
      font-size: 2rem;
      margin-bottom: 2rem;
    }
    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }
    .value-card {
      background: white;
      padding: 2rem;
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-sm);
      border: 1px solid #F1F5F9;
      transition: var(--transition);
    }
    .value-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-md);
      border-color: var(--color-primary);
    }
    .value-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      display: block;
    }
    .value-card h3 {
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
      color: var(--color-dark);
    }
    .value-card p {
      font-size: 0.95rem;
      color: #64748B;
    }
  </style>
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
      </div>
    </div>
  </div>

  <!-- Header -->
  <header class="header">
    <div class="header-container">
      <a href="index.php" class="logo">
        <span class="logo-emoji">🥬</span>
        <span class="logo-text">Farm Fresh</span>
      </a>
      <div class="header-actions">
        <a href="index.php" class="action-btn" style="text-decoration: none;">
          🏠 Back to Home
        </a>
      </div>
    </div>
  </header>

  <!-- Main Navigation Menu -->
  <nav class="main-navigation">
    <div class="nav-container">
      <ul class="nav-menu">
        <li><a href="index.php">Home</a></li>
        <li><a href="index.php#shopContainer">Shop</a></li>
        <li><a href="index.php#categories">Categories</a></li>
        <li><a href="index.php#blog">Blog</a></li>
        <li><a href="about.php" class="active">About</a></li>
        <li><a href="contact.php">Contact</a></li>
      </ul>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="about-hero">
    <h1>Our Farm-Fresh Story</h1>
    <p>Bringing nature's absolute best, healthiest, and 100% organic products direct from local fields to your doorstep.</p>
  </section>

  <!-- About Details Section -->
  <main class="about-container">
    <div class="about-grid">
      <div class="about-image">
        <img src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80" alt="Fresh vegetable farming">
      </div>
      <div class="about-text">
        <h2>We Grow and Deliver Health</h2>
        <p>At Farm Fresh, our journey started with a simple belief: everyone deserves access to clean, chemical-free food that nurtures both body and soul. We partner closely with local sustainable farmers to cut down transit times and guarantee fresh organic products.</p>
        <p>Every single vegetable, dairy product, and bakery treat is selected by hand, rigorously quality-checked, and shipped with eco-conscious materials to keep our planet green.</p>
      </div>
    </div>

    <div class="about-grid" style="direction: rtl;">
      <div class="about-image">
        <img src="https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80" alt="Farmer with fresh harvest">
      </div>
      <div class="about-text" style="direction: ltr;">
        <h2>Sustainable Agriculture First</h2>
        <p>We are dedicated to regenerating soil and protecting bee populations. By implementing crop rotation and utilizing only natural composts, our farming methods capture carbon and avoid toxic chemical runoff entirely.</p>
        <p>By buying from Farm Fresh, you aren't just eating healthier – you are supporting local farming families and a greener, cleaner agricultural future.</p>
      </div>
    </div>

    <!-- Core Values -->
    <section class="values-section">
      <h2>Our Core Values</h2>
      <div class="values-grid">
        <div class="value-card">
          <span class="value-icon">🌱</span>
          <h3>100% Organic</h3>
          <p>Strictly non-GMO, zero chemical pesticides, and only natural fertilizers from start to finish.</p>
        </div>
        <div class="value-card">
          <span class="value-icon">🚜</span>
          <h3>Directly Sourced</h3>
          <p>Eliminating middlemen so that farmers receive fair trade wages and you get maximum freshness.</p>
        </div>
        <div class="value-card">
          <span class="value-icon">📦</span>
          <h3>Eco Packaging</h3>
          <p>We use biodegradable and recyclable packaging solutions to leave a minimal carbon footprint.</p>
        </div>
      </div>
    </section>
  </main>

  <!-- Redesigned Dark Footer Area -->
  <footer class="footer footer-dark">
    <div class="footer-container">
      <div class="footer-section">
        <a href="index.php" class="logo">
          <span class="logo-emoji">🥬</span>
          <span class="logo-text" style="color: #22C55E;">Farm Fresh</span>
        </a>
        <p class="footer-about">Your premium choice for organic vegetables, dairy, and farm-fresh essentials. Direct from local farms to your home.</p>
      </div>
      <div class="footer-section">
        <h3>Quick Links</h3>
        <ul class="footer-links">
          <li><a href="index.php">Home</a></li>
          <li><a href="about.php">About Us</a></li>
          <li><a href="contact.php">Contact Us</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <h3>Contact Us</h3>
        <p class="footer-contact">📞 +123 4567 890</p>
        <p class="footer-contact">✉️ support@farmfresh.com</p>
        <p class="footer-contact">📍 Farm Fresh Lane, Green Valley</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; <?php echo date('Y'); ?> Farm Fresh. All rights reserved.</p>
    </div>
  </footer>

</body>
</html>
