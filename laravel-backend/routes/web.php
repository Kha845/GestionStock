<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Models\Order;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

//la gestion de l'authentification des utilisateurs
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {

    Route::post('login', [AuthController::class,'login']);
    Route::post('logout', [AuthController::class,'logout']);
    Route::post('refresh', [AuthController::class,'refresh']);
    Route::get('me', [AuthController::class,'me']);

});

Route::group(['middleware'=>'auth'], function($routes){
    //la gestion des clients
    Route::group(['prefix'=>'v1/customers','middleware'=>'auth'],function($routes){
        Route::get('/list',[CustomerController::class,'index']);
        Route::post('/',[CustomerController::class,'store']);
        Route::get('/{id}',[CustomerController::class,'show']);
        Route::put('/{id}',[CustomerController::class,'update']);
        Route::delete('/{id}',[CustomerController::class,'destroy']);
        Route::post('/getList',[CustomerController::class,'getList']);

    });
     //la gestion des produits
    Route::group(['prefix'=>'v1/products','middleware'=>'auth'],function($routes){
        Route::get('/list',[ProductController::class,'index']);
        Route::get('/init-form',[ProductController::class,'initForm']);
        Route::post('/',[ProductController::class,'store']);
        Route::get('/{id}',[ProductController::class,'show']);
        Route::put('/{id}',[ProductController::class,'update']);
        Route::delete('/{id}',[ProductController::class,'destroy']);
        Route::post('/getList',[ProductController::class,'getList']);

    });
    //la gestion des commandes
    Route::group(['prefix'=>'v1/orders','middleware'=>'auth'],function($routes){
        Route::get('/list',[OrderController::class,'index']);
        Route::post('/',[OrderController::class,'store']);
        Route::get('/{id}',[OrderController::class,'show']);

    });
});


