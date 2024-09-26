<?php

namespace Database\Factories;

use App\Models\Categorie;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $model = Product::class;
        return [
            'name' => $this->faker->word, // Génère un nom de produit
            'category_id' => Categorie::factory(), // Génère un id de catégorie
            'stock' => $this->faker->numberBetween(1, 100), // Génère un stock entre 1 et 100
            'price' => $this->faker->randomFloat(2, 10, 1000), // Génère un prix entre 10 et 1000
            'image' => $this->faker->imageUrl(640, 480, 'products', true, 'Faker'), // Génère une URL d'image fictive
        ];
    }
}
