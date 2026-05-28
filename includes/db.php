<?php
require_once __DIR__ . '/config.php';

function get_products() {
    if (!file_exists(PRODUCTS_JSON)) {
        return [];
    }
    $json = file_get_contents(PRODUCTS_JSON);
    $data = json_decode($json, true);
    return $data['products'] ?? [];
}

function get_categories() {
    if (!file_exists(CATEGORIES_JSON)) {
        return [];
    }
    $json = file_get_contents(CATEGORIES_JSON);
    $data = json_decode($json, true);
    return $data['categories'] ?? [];
}
?>
