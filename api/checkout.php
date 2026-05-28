<?php
require_once __DIR__ . '/../includes/session.php';
require_once __DIR__ . '/../includes/functions.php';

$cart = $_SESSION['cart'] ?? [];

if (empty($cart)) {
    json_response(['success' => false, 'message' => 'Your cart is empty'], 400);
}

// Clear cart on checkout success
$_SESSION['cart'] = [];

$orderId = 'FC-' . rand(100000, 999999);
$deliveryDays = rand(1, 2);
$deliveryMsg = $deliveryDays === 1 ? "Tomorrow morning" : "Day after tomorrow";

json_response([
    'success' => true,
    'message' => 'Order placed successfully!',
    'orderId' => $orderId,
    'deliveryEstimation' => $deliveryMsg,
    'estimatedDays' => $deliveryDays
]);
?>
