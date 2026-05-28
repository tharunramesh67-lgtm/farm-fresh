<?php
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

$category = sanitize_input($_GET['category'] ?? 'all');
$minPrice = floatval($_GET['min_price'] ?? 0);
$maxPrice = floatval($_GET['max_price'] ?? 99999);
$organic = ($_GET['organic'] ?? '') === 'true';
$local = ($_GET['local'] ?? '') === 'true';
$inStock = ($_GET['in_stock'] ?? '') === 'true';
$rating = floatval($_GET['rating'] ?? 0);
$search = sanitize_input($_GET['search'] ?? '');

$products = get_products();

$filtered = array_filter($products, function($p) use ($category, $minPrice, $maxPrice, $organic, $local, $inStock, $rating, $search) {
    // Category match
    if ($category !== 'all' && strcasecmp($p['category'], $category) !== 0) {
        return false;
    }
    
    // Price match
    if ($p['price'] < $minPrice || $p['price'] > $maxPrice) {
        return false;
    }
    
    // Organic match
    if ($organic && !($p['organic'] ?? false)) {
        return false;
    }
    
    // Local match
    if ($local && !($p['localSource'] ?? false)) {
        return false;
    }
    
    // In Stock match
    if ($inStock && !($p['inStock'] ?? false)) {
        return false;
    }
    
    // Rating match
    if (($p['rating'] ?? 0) < $rating) {
        return false;
    }
    
    // Search text match
    if (!empty($search)) {
        $searchString = strtolower($search);
        $nameMatch = strpos(strtolower($p['name']), $searchString) !== false;
        $descMatch = strpos(strtolower($p['description']), $searchString) !== false;
        
        $tagMatch = false;
        if (isset($p['tags']) && is_array($p['tags'])) {
            foreach ($p['tags'] as $tag) {
                if (strpos(strtolower($tag), $searchString) !== false) {
                    $tagMatch = true;
                    break;
                }
            }
        }
        
        if (!$nameMatch && !$descMatch && !$tagMatch) {
            return false;
        }
    }
    
    return true;
});

json_response(array_values($filtered));
?>
