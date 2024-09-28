<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Categorie;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductOrder;
use Illuminate\Database\Seeder;
use App\Models\User;
use Database\Factories\OrderProductFactory;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
          User::factory(15)->create();
          Customer::factory(15)->create();
        //  Categorie::factory(5)->create();
        //  Order::factory(5)->create();
        //  Product::factory(25)->create();

      // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        Categorie::truncate();
        Categorie::create(["name" => 'Can Food']);
        Categorie::create(["name" => 'Dairy']);
        Categorie::create(["name" => 'Snecks']);
        Categorie::create(["name" => 'Vegetable']);


       // ProductOrder::factory()->count(10)->create();
    }
}
