<?php
$source = 'C:\\Users\\tharu\\.gemini\\antigravity-ide\\brain\\a66dc765-c370-4158-847c-5da2db7ed734\\media__1780041506701.png';
$dest = __DIR__ . '/images/farm_fresh_basket.png';

if (!file_exists(dirname($dest))) {
    mkdir(dirname($dest), 0777, true);
}

$data = @file_get_contents($source);
if ($data === false) {
    $err = error_get_last();
    echo "FAILED: " . $err['message'];
} else {
    if (file_put_contents($dest, $data) !== false) {
        echo "SUCCESS";
    } else {
        echo "FAILED to write destination";
    }
}
