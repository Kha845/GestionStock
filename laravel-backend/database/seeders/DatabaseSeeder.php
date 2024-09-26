<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Categorie;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
          User::factory(25)->create();
          Customer::factory(25)->create();
        //  Categorie::factory()->count(10)->create();
          Product::factory(25)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        Categorie::truncate();
        Categorie::create(["name" => 'Can Food']);
        Categorie::create(["name" => 'Dairy']);
        Categorie::create(["name" => 'Snecks']);
        Categorie::create(["name" => 'Vegetable']);


    }
}
