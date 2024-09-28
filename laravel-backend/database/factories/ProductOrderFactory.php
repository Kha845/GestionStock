<?php

namespace Database\Factories;

use App\Models\ProductOrder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductOrder>
 */
class ProductOrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = ProductOrder::class;
    public function definition()
    {
            return [
                'order_id' => $this->faker->randomDigitNotNull(), // Génère un ID de commande aléatoire
                'product_id' => $this->faker->randomDigitNotNull(), // Génère un ID de produit aléatoire
                'product_name' => $this->faker->words(3, true), // Génère un nom de produit de 3 mots
                'product_price' => $this->faker->randomFloat(2, 5, 500), // Génère un prix entre 5 et 500 avec 2 décimales
                'product_quantity' => $this->faker->numberBetween(1, 100), // Génère une quantité entre 1 et 100
                'product_discount' => $this->faker->randomFloat(2, 0, 50), // Génère une réduction entre 0 et 50%
                'created_at' => now(),
                'updated_at' => now(),
            ];
    }
}
