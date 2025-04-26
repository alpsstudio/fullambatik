<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AIController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/canvas', function () {
    return view('canvas');
});


Route::post('/generate-ai', [AIController::class, 'generate']);
