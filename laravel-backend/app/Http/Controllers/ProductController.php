<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Carbon\Carbon;
use Exception;
use Illuminate\Contracts\Cache\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator ;
use Illuminate\Http\UploadedFile;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {

            $data['products'] =
            DB::table('products')->leftJoin('categories','categories.id',"=",'products.category_id')->select(["products.*","categories.name as categorie"])->get();
            return $this->sendResponse('List fetch successfully', $data, 200);
        } catch (Exception $e) {

            return $this->handleException($e);
        }
    }
     /**
     *
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function initForm()
    {
        try {

            $data['categories'] = DB::table('categories')->select('id','name')->get();

            return  response()->json([
                            'error' => false,
                            'message' => 'List fetch successfully',
                            'categories' => $data['categories'] // Retourne les catégories directement
                             ], 200);

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
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|unique:products',
                'category_id' => 'required|exists:categories,id', // Assurez-vous que la catégorie existe
                'stock' => 'required|numeric',
                'price' => 'required|numeric',
                'image' => 'required|mimes:jpeg,png,jpg|max:5000',
            ]);

            if ($validator->fails()) {
                return $this->sendError("Please enter valid input data", $validator->errors(), 400);
            }

            // Valider les données
            $postData = $validator->validated();

            // Générer un nom unique pour le fichier
            $imageFile = $postData['image'];
            $imageFileName = Carbon::now()->timestamp . "_" . uniqid() . "." . $imageFile->getClientOriginalExtension();

            // Vérifier si le répertoire existe, sinon le créer
            $directory = 'product-category';

            if (!Storage::disk('public')->exists($directory)) {
                Storage::disk('public')->makeDirectory($directory);
            }

            // Enregistrer le fichier dans le répertoire 'product-category' avec le nom généré
            $imagePath = $imageFile->storeAs($directory, $imageFileName, 'public');

            $postData['image'] = $imagePath; // Mise à jour du chemin de l'image

            DB::beginTransaction();
            $data['product'] = Product::create($postData); // Utiliser $postData mis à jour
            DB::commit();

            return response()->json(['message' => 'Produit créé avec succès', 'data' => $data], 201);
        } catch (Exception $e) {
            DB::rollBack();
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
            // Rechercher le produit avec sa catégorie associée
            $data['product'] = Product::with('categorie:id,name')->find($id);

            // Vérifier si le produit existe
            if (empty($data['product'])) {
                return $this->sendError('Product not found', ["errors" => ["general" => "Product not found"]], 400);
            }

            // Vérifier si la catégorie associée au produit existe
            if (empty($data['product']->categorie)) {
                return $this->sendError('Category not found for this product', ["errors" => ["category" => "No category associated with this product"]], 400);
            }

            // Si tout est correct, renvoyer la réponse avec le produit et la catégorie
            return $this->sendResponse("Product fetched successfully.", $data, 200);

        } catch (Exception $e) {
            // Gestion des exceptions
            return $this->handleException($e);
        }

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
{
    try {
        // Rechercher le produit avec sa catégorie associée
        $data['product'] = Product::find($id);

        // Vérifier si le produit existe
        if (empty($data['product'])) {
            return $this->sendError('Product not found', ["errors" => ["general" => "Product not found"]], 400);
        }

        // Validation des données
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:products,name,' . $data['product']->id,
            'category_id' => 'required|exists:categories,id',  // Vérifie l'existence de la catégorie
            'stock' => 'required|numeric',
            'price' => 'required|numeric',
            'image' => 'nullable|mimes:jpeg,png,jpg|max:5000',
        ]);

        if ($validator->fails()) {
            return $this->sendError("Please enter valid input data", $validator->errors(), 400);
        }

        // Valider les données
        $postData = $validator->validated();

        // Gestion de l'image si elle est présente
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            // Obtenir le fichier image
            $imageFile = $request->file('image');

            // Générer un nom unique pour l'image
            $imageFileName = Carbon::now()->timestamp . "_" . uniqid() . "." . $imageFile->getClientOriginalExtension();

            // Créer le répertoire 'product-category' s'il n'existe pas
            if (!Storage::disk('public')->exists('product-category')) {
                Storage::disk('public')->makeDirectory('product-category');
            }

            // Supprimer l'ancienne image si elle existe
            if (!empty($data['product']->image) && Storage::disk('public')->exists($data['product']->image)) {
                Storage::disk('public')->delete($data['product']->image);
            }

            // Enregistrer la nouvelle image
            $imagePath = $imageFile->storeAs('product-category', $imageFileName, 'public');
            $postData['image'] = $imagePath; // Mettre à jour le chemin de l'image
        }

        // Début de la transaction
        DB::beginTransaction();
        $data['product']->update($postData);
        DB::commit();

        return $this->sendResponse("Product updated successfully.", $data, 201);
    } catch (Exception $e) {
        DB::rollBack();
        return $this->handleException($e);
    }
}


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

         try {
             // Rechercher le produit avec sa catégorie associée
         $data['product'] = Product::find($id);

         // Vérifier si le produit existe
         if (empty($data['product'])) {
             return $this->sendError('Product not found', ["errors" => ["general" => "Product not found"]], 400);
         }

         // Vérifier si la catégorie associée au produit existe
         if (empty($data['product']->categorie)) {
             return $this->sendError('product not found for this product', ["errors" => ["product" => "No category associated with this product"]], 400);
         }else{
              if (Storage::disk('public')->exists($data['product']->image)) {
                Storage::disk('public')->delete($data['product']->image);
                }
            DB::beginTransaction();
            $data['product']->delete();
            DB::commit();
            return $this->sendResponse("product delete successfully.", $data, 200);
         }
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e);
        }
    }
    public function getList(Request $request){
        try{
            $query = DB::table('products');

            $query->where(function($query) use ($request) {
            $search = '%' . $request->search . '%';
            $query->orWhere('name', 'like', $search);
            });

            $data['products'] = $query->orderBy('name')
                          ->limit(20)
                          ->get(['id', 'name as Label', 'stock', 'price']);

             return $this->sendResponse("List fetched successfully", $data, 200);
        }catch(\Exception $e){
            DB::rollBack();
            return $this->handleException($e);
        }
    }

}
