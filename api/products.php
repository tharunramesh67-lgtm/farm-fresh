<?php
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

$action = $_GET['action'] ?? 'all';
$products = get_products();

switch($action) {
    case 'all':
        json_response($products);
        break;
        
    case 'category':
        $category = $_GET['category'] ?? '';
        if (empty($category)) {
            json_response(['error' => 'Category parameter is required'], 400);
        }
        $filtered = array_filter($products, function($p) use ($category) {
            return strcasecmp($p['category'], $category) === 0;
        });
        json_response(array_values($filtered));
        break;
        
    case 'featured':
        $filtered = array_filter($products, function($p) {
            return $p['featured'] ?? false;
        });
        json_response(array_values($filtered));
        break;

    default:
        json_response(['error' => 'Invalid action'], 400);
}
?>
