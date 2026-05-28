<?php
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

$query = sanitize_input($_GET['q'] ?? '');
$products = get_products();

if (strlen($query) < 1) {
    json_response($products);
}

$results = array_filter($products, function($p) use ($query) {
    $searchString = strtolower($query);
    $isDairyQuery = (strpos($searchString, 'diary') !== false) || (strpos($searchString, 'dairy') !== false);
    $isVegetableQuery = (strpos($searchString, 'vegetable') !== false);
    $nameMatch = strpos(strtolower($p['name']), $searchString) !== false;
    $descMatch = strpos(strtolower($p['description']), $searchString) !== false;
    $categoryMatch = (strpos(strtolower($p['category']), $searchString) !== false) || 
                      ($isDairyQuery && strcasecmp($p['category'], 'dairy') === 0) ||
                      ($isVegetableQuery && strcasecmp($p['category'], 'produce') === 0);
    
    $tagMatch = false;
    if (isset($p['tags']) && is_array($p['tags'])) {
        foreach ($p['tags'] as $tag) {
            if (strpos(strtolower($tag), $searchString) !== false) {
                $tagMatch = true;
                break;
            }
        }
    }
    
    return $nameMatch || $descMatch || $tagMatch || $categoryMatch;
});

json_response(array_values($results));
?>
