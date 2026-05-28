<?php
require_once __DIR__ . '/../includes/session.php';
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

$action = $_POST['action'] ?? $_GET['action'] ?? '';
$cart = $_SESSION['cart'] ?? [];

// Helper to structure the full cart details and calculate prices/taxes/shipping
function get_cart_details($cart) {
    $products = get_products();
    $items = [];
    $subtotal = 0.0;

    foreach ($cart as $productId => $qty) {
        // Find product
        $foundProduct = null;
        foreach ($products as $p) {
            if ($p['id'] == $productId) {
                $foundProduct = $p;
                break;
            }
        }
        if ($foundProduct) {
            $itemTotal = $foundProduct['price'] * $qty;
            $subtotal += $itemTotal;
            $items[] = [
                'id' => $foundProduct['id'],
                'name' => $foundProduct['name'],
                'price' => $foundProduct['price'],
                'unit' => $foundProduct['unit'],
                'image' => $foundProduct['image'],
                'quantity' => $qty,
                'total' => $itemTotal
            ];
        }
    }

    $tax = $subtotal * TAX_RATE;
    $shipping = 0.0;
    if ($subtotal > 0) {
        $shipping = ($subtotal >= FREE_SHIPPING_THRESHOLD) ? 0.0 : SHIPPING_COST;
    }
    $total = $subtotal + $tax + $shipping;

    return [
        'items' => $items,
        'summary' => [
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping' => $shipping,
            'total' => $total,
            'currency' => CURRENCY_SYMBOL,
            'freeShippingThreshold' => FREE_SHIPPING_THRESHOLD
        ]
    ];
}

switch($action) {
    case 'add':
        $productId = intval($_POST['product_id'] ?? 0);
        $quantity = intval($_POST['quantity'] ?? 1);
        
        if ($productId <= 0) {
            json_response(['success' => false, 'message' => 'Invalid product ID'], 400);
        }

        // Verify product exists and is in stock
        $products = get_products();
        $exists = false;
        $inStock = false;
        foreach ($products as $p) {
            if ($p['id'] == $productId) {
                $exists = true;
                $inStock = $p['inStock'];
                break;
            }
        }

        if (!$exists) {
            json_response(['success' => false, 'message' => 'Product does not exist'], 404);
        }
        if (!$inStock) {
            json_response(['success' => false, 'message' => 'Product is out of stock'], 400);
        }
        
        if (isset($cart[$productId])) {
            $cart[$productId] += $quantity;
        } else {
            $cart[$productId] = $quantity;
        }
        $_SESSION['cart'] = $cart;
        
        json_response([
            'success' => true, 
            'message' => 'Added to cart successfully',
            'cart' => get_cart_details($cart)
        ]);
        break;
        
    case 'remove':
        $productId = intval($_POST['product_id'] ?? 0);
        if ($productId <= 0) {
            json_response(['success' => false, 'message' => 'Invalid product ID'], 400);
        }
        
        if (isset($cart[$productId])) {
            unset($cart[$productId]);
        }
        $_SESSION['cart'] = $cart;
        
        json_response([
            'success' => true, 
            'message' => 'Removed from cart successfully',
            'cart' => get_cart_details($cart)
        ]);
        break;
        
    case 'update':
        $productId = intval($_POST['product_id'] ?? 0);
        $quantity = intval($_POST['quantity'] ?? 0);
        
        if ($productId <= 0) {
            json_response(['success' => false, 'message' => 'Invalid product ID'], 400);
        }
        
        if ($quantity > 0) {
            $cart[$productId] = $quantity;
        } else {
            if (isset($cart[$productId])) {
                unset($cart[$productId]);
            }
        }
        $_SESSION['cart'] = $cart;
        
        json_response([
            'success' => true, 
            'message' => 'Quantity updated',
            'cart' => get_cart_details($cart)
        ]);
        break;
        
    case 'get':
        json_response(get_cart_details($cart));
        break;

    case 'clear':
        $_SESSION['cart'] = [];
        json_response([
            'success' => true,
            'message' => 'Cart cleared',
            'cart' => get_cart_details([])
        ]);
        break;

    default:
        json_response(['error' => 'Invalid action'], 400);
}
?>
