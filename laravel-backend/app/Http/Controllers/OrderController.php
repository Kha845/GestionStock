<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductOrder;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

            try {
                $data['orders'] =  DB::table('orders')->leftjoin('customers','customers.id','=','orders.customer_id')
                                                    ->select('orders.*', DB::raw("CONCAT(customers.first_name,' ', customers.last_name) as customer_name"))
                                                    ->get();
                return $this->sendResponse("List fetched successfully",$data,200);

            } catch (Exception $e) {

                return $this->handleException($e);
            }
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            // Validation des données d'entrée
            $validator = Validator::make($request->all(), [
                'customer_id' => 'required|string|max:255|exists:customers,id',
                'products' => 'required|array|min:1',
                'products.*.product_id' => 'required|exists:products,id',
                'products.*.quantity' => 'required|numeric|min:1',
                'products.*.discount' => 'required|numeric|min:0|max:100',
            ]);

            if ($validator->fails()) {
                return $this->sendError("Please enter valid input data", $validator->errors(), 400);
            }

            $postData = $validator->validated();
            DB::beginTransaction();

            // Création de la commande
            $order = Order::create([
                "customer_id" => $postData['customer_id'],
                "order_number" => "POS" . uniqid(),
                "price" => 0, // Initialiser le prix ici
                "quantity" => 0 // Initialiser la quantité ici
            ]);

            foreach ($postData['products'] as $product) {
                $productData = Product::find($product['product_id']);
                if (empty($productData)) {
                    return $this->sendError("Product not found", ["error" => ["general not found"]], 404);
                }

                if ($productData->stock < $product['quantity']) {
                    return $this->sendError($productData->name . " is out of stock", ["error" => ["general not found"]], 400);
                }

                // Créer une entrée dans ProductOrder
                ProductOrder::create([
                    'order_id' => $order->id,
                    'product_id' => $productData->id,
                    'product_name' => $productData->name,
                    'product_price' => $productData->price,
                    'product_quantity' => $product['quantity'],
                    'product_discount' => $product['discount'],
                ]);

                // Mettre à jour le stock
                $productData->stock -= $product['quantity'];
                $productData->save();

                // Calculer le prix
                $discountedPrice = $productData->price - ($productData->price * $product['discount'] / 100);
                $order->price += floatval($discountedPrice * $product['quantity']);
                $order->quantity += intval($product['quantity']);
            }

            // Sauvegarder les modifications de l'ordre
            $order->save(); // Assurez-vous de sauvegarder les modifications de l'ordre ici

            DB::commit();

            return response()->json([
                'message' => 'Commande created successfully',
                'data' => $order, // Vous pouvez retourner l'ordre ici
            ], 201);
        } catch (Exception $e) {
            DB::rollBack(); // Annuler la transaction en cas d'erreur
            return $this->handleException($e);
        }
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $data['orders'] =  Order::with(['items','customer'])->find($id);
            return $this->sendResponse('Order List fetched successfully',$data,200);
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }
}
