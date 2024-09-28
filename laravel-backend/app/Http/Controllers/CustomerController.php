<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Exception;
use Illuminate\Foundation\Bootstrap\HandleExceptions;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use PhpParser\Node\Stmt\Label;
use Illuminate\Support\Facades\Log;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(): JsonResponse
    {
        try {
            $data['customers'] = DB::table('customers')->get();
            return $this->sendResponse('List fetch successfully', $data, 200);
        } catch (Exception $e) {

            return $this->handleException($e);
        }
    }

    public function getList(Request $request)
{
    try {
        $search = $request->search ?? ''; // Assurez-vous que $search a une valeur par défaut
        $query = DB::table('customers');

        // Ajoutez une condition pour éviter une requête vide
        if (strlen($search) > 0) {
            $query->where(function($q) use ($search) {
                $likeSearch = '%' . $search . '%';
                $q->orWhere(DB::raw("CONCAT(first_name, ' ', last_name)"), 'like', $likeSearch)
                  ->orWhere('last_name', 'like', $likeSearch)
                  ->orWhere('email', 'like', $likeSearch)
                  ->orWhere('phone_number', 'like', $likeSearch)
                  ->orWhere('zip_code', 'like', $likeSearch);
            });
        }

        $data['customers'] = $query->orderBy('first_name')
                                    ->limit(100)
                                    ->get(['id', DB::raw("CONCAT(first_name, ' ', last_name) as label")]); // Utilisation de "label" en minuscules

        return $this->sendResponse("List fetched successfully", $data, 200);
    } catch (\Exception $e) {
        // Log de l'erreur pour le débogage
        Log::error('Error fetching customers: ' . $e->getMessage());
        return $this->handleException($e);
    }
}

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'phone_number' => 'required|string|max:12|min:9|unique:customers,phone_number',
                'email' => 'required|string|max:255|unique:customers,email',
                'adresse' => 'required|string|max:255',
                'zip_code' => 'required|string|max:4|min:4',

            ]);
            if ($validator->fails()) {
                return $this->sendError("Please entrer valid input data", $validator->errors(), 400);
            }
            DB::beginTransaction();
            $data['customer'] = Customer::create($validator->validated());
            DB::commit();
            return response()->json([
                'message' => 'Client créer avec succès',
                'data' => $data,
            ], 201);
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
    public function show($id): JsonResponse
    {
        try {
            $data['customer'] = Customer::find($id);

            if (empty($data['customer'])) {

                return $this->sendError('customer not found',["errors" => ["general" => "customer not found"]], 400);
            }

            return $this->sendResponse("customer fetch successfully.", $data, 200);


        } catch (Exception $e) {

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
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $data['customer'] = Customer::find($id);
            if (empty($data['customer'])) {
                return $this->sendError('customer not found', ["errors" => ["general" => "customer not found"]], 400);
            }

            $validator = Validator::make($request->all(), [
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|string|max:255|unique:customers,email,'.$id,
                'adresse' => 'required|string|max:255',
                'phone_number' => 'required|string|max:12|min:9|unique:customers,phone_number,'.$id,
                'zip_code' => 'required|string|max:4|min:4',

            ]);

            if ($validator->fails()) {
                return $this->sendError("Please entrer valid input data", $validator->errors(), 400);
            }
            DB::beginTransaction();
            $updateCustomerData = $validator->validated();
            $data['customer']->update($updateCustomerData);
            DB::commit();

            return $this->sendResponse("customer update successfully.", $data, 201);
        } catch (Exception $e) {

            return $this->handleException($e);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id): JsonResponse
    {
        try {
            $data['customer'] = Customer::find($id);

            if (empty($data['customer'])) {
                return $this->sendError('customer not found', ["errors" => ["general" => "customer not found"]], 400);
            } else {
                DB::beginTransaction();
                $data['customer']->delete();
                DB::commit();
            }

            return $this->sendResponse("customer delete successfully.", $data, 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e);
        }
    }

}
