<?php
// Configuration settings
define('CURRENCY_SYMBOL', '₹');
define('TAX_RATE', 0.05); // 5% GST for groceries
define('SHIPPING_COST', 49.00); // ₹49 flat delivery charge
define('FREE_SHIPPING_THRESHOLD', 499.00); // Free delivery above ₹499

// File Paths
define('DATA_DIR', __DIR__ . '/../data');
define('PRODUCTS_JSON', DATA_DIR . '/products.json');
define('CATEGORIES_JSON', DATA_DIR . '/categories.json');
?>
