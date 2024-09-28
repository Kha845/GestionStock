<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Order::class;

    public function definition()
    {
            return [
                'order_number' => $this->faker->unique()->numerify('ORD-####'), // Génère un numéro de commande unique
                'customer_id' => $this->faker->randomDigitNotNull(), // Génère un ID client aléatoire (tu peux ajuster selon les relations)
                'price' => $this->faker->randomFloat(2, 10, 500), // Génère un prix entre 10 et 500 avec 2 décimales
                'quantity' => $this->faker->numberBetween(1, 100), // Génère une quantité aléatoire entre 1 et 100
                'created_at' => now(), // Date de création
                'updated_at' => now(), // Date de mise à jour
            ];
    }
}
