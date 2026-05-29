<?php
require_once __DIR__ . '/includes/session.php';
require_once __DIR__ . '/includes/config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Us | Farm Fresh Premium Organic</title>
  <meta name="description" content="Get in touch with Farm Fresh. Contact us for inquiries, feedback, or support regarding our organic produce and delivery services.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Inter:wght@400;500;600;700&family=Comfortaa:wght@500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
  <style>
    .contact-hero {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(251, 146, 60, 0.7) 100%), 
                  url('https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=1200&q=80') no-repeat center center/cover;
      padding: 5rem 2rem;
      text-align: center;
      color: white;
      margin-bottom: 3rem;
    }
    .contact-hero h1 {
      font-size: 3rem;
      color: white;
      margin-bottom: 1rem;
      font-family: var(--font-display);
    }
    .contact-hero p {
      font-size: 1.2rem;
      max-width: 600px;
      margin: 0 auto;
      font-family: var(--font-body);
    }
    .contact-container {
      max-width: 1200px;
      margin: 0 auto 4rem auto;
      padding: 0 1.5rem;
    }
    .contact-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 3rem;
      align-items: start;
    }
    @media (max-width: 768px) {
      .contact-grid {
        grid-template-columns: 1fr;
      }
    }
    .contact-form-card {
      background: white;
      border: 2px solid var(--color-brown);
      border-radius: var(--border-radius-lg);
      padding: 2.5rem;
      box-shadow: var(--shadow-md);
    }
    .contact-form-card h2 {
      color: var(--color-brown);
      font-size: 1.75rem;
      margin-bottom: 1.5rem;
    }
    .form-group {
      margin-bottom: 1.25rem;
    }
    .form-group label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }
    .form-control {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #E2E8F0;
      border-radius: var(--border-radius-md);
      font-family: var(--font-body);
      font-size: 0.95rem;
      outline: none;
      transition: var(--transition);
    }
    .form-control:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
    }
    textarea.form-control {
      resize: vertical;
      min-height: 120px;
    }
    .submit-btn {
      width: 100%;
      padding: 0.9rem;
      background-color: var(--color-primary);
      color: white;
      border: none;
      border-radius: var(--border-radius-md);
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 1.1rem;
      cursor: pointer;
      transition: var(--transition);
      box-shadow: 0 4px 10px rgba(34, 197, 94, 0.2);
    }
    .submit-btn:hover {
      background-color: var(--color-primary-hover);
      transform: translateY(-2px);
    }
    .contact-info-panel {
      background-color: #FFFDF9;
      border: 2px dashed var(--color-brown);
      border-radius: var(--border-radius-lg);
      padding: 2.5rem;
    }
    .contact-info-panel h2 {
      color: var(--color-brown);
      font-size: 1.75rem;
      margin-bottom: 1.5rem;
    }
    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .info-icon {
      font-size: 1.75rem;
      background: white;
      padding: 0.5rem;
      border-radius: var(--border-radius-sm);
      border: 1px solid #E2E8F0;
      box-shadow: var(--shadow-sm);
    }
    .info-text h3 {
      font-size: 1.1rem;
      margin-bottom: 0.25rem;
    }
    .info-text p {
      color: #64748B;
      font-size: 0.95rem;
    }
    .success-alert {
      display: none;
      background-color: #DCFCE7;
      color: #15803D;
      padding: 1rem;
      border-radius: var(--border-radius-md);
      border: 1px solid #BBF7D0;
      margin-bottom: 1.5rem;
      font-weight: 500;
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
        <li><a href="about.php">About</a></li>
        <li><a href="contact.php" class="active">Contact</a></li>
      </ul>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="contact-hero">
    <h1>Contact Our Friendly Team</h1>
    <p>Have questions about our organic products, custom orders, or delivery? Reach out to us anytime!</p>
  </section>

  <!-- Contact Section Container -->
  <main class="contact-container">
    <div class="contact-grid">
      <!-- Contact Form Card -->
      <div class="contact-form-card">
        <h2>Send Us A Message</h2>
        <div class="success-alert" id="successAlert">
          ✨ Message sent successfully! We will get back to you within 24 hours.
        </div>
        <form id="contactForm" onsubmit="handleContactSubmit(event)">
          <div class="form-group">
            <label for="name">Your Name</label>
            <input type="text" id="name" class="form-control" placeholder="John Doe" required>
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" class="form-control" placeholder="john@example.com" required>
          </div>
          <div class="form-group">
            <label for="subject">Subject</label>
            <input type="text" id="subject" class="form-control" placeholder="Inquiry about Delivery" required>
          </div>
          <div class="form-group">
            <label for="message">Your Message</label>
            <textarea id="message" class="form-control" placeholder="Tell us how we can help..." required></textarea>
          </div>
          <button type="submit" class="submit-btn">Send Message</button>
        </form>
      </div>

      <!-- Contact Details Sidebar Panel -->
      <div class="contact-info-panel">
        <h2>Get In Touch</h2>
        <div class="info-item">
          <span class="info-icon">📍</span>
          <div class="info-text">
            <h3>Our Farm Location</h3>
            <p>Farm Fresh Lane, Green Valley, GV 56789</p>
          </div>
        </div>
        <div class="info-item">
          <span class="info-icon">📞</span>
          <div class="info-text">
            <h3>Phone Support</h3>
            <p>+123 4567 890 (Mon-Sat, 8am - 6pm)</p>
          </div>
        </div>
        <div class="info-item">
          <span class="info-icon">✉️</span>
          <div class="info-text">
            <h3>Email Support</h3>
            <p>support@farmfresh.com</p>
          </div>
        </div>
        <div class="info-item">
          <span class="info-icon">⏱️</span>
          <div class="info-text">
            <h3>Working Hours</h3>
            <p>Monday - Friday: 7:00 AM - 8:00 PM<br>Saturday - Sunday: 8:00 AM - 5:00 PM</p>
          </div>
        </div>
      </div>
    </div>
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

  <script>
    function handleContactSubmit(event) {
      event.preventDefault();
      document.getElementById('successAlert').style.display = 'block';
      document.getElementById('contactForm').reset();
      window.scrollTo({ top: document.querySelector('.contact-form-card').offsetTop - 120, behavior: 'smooth' });
    }
  </script>

</body>
</html>
