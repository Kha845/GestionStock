import { Navigate, useRoutes } from 'react-router-dom'
import Customers from '../pages/private/customers/Index'
import Login from '../pages/guest/Login'
import BaseLayout from '../components/Layouts/BaseLayout'
import PrivateRoute from '../middleware/PrivateRoute'
import CustomerList from '../pages/private/customers/list'
import CustomerCreate from '../pages/private/customers/creatForm'
import CustomerEdit from '../pages/private/customers/edit'
import Products from '../pages/private/products'
import ProductList from '../pages/private/products/list'
import ProductCreate from '../pages/private/products/creatForm'
import ProductEdit from '../pages/private/products/edit'
import Orders from '../pages/private/orders'
import OrderList from '../pages/private/orders/list'
import OrderCreate from '../pages/private/orders/creatForm'
import OrderView from '../pages/private/orders/view'
const routes = [
    {path: "/", element: <Navigate to = "login"/>},

    {path: "/login", element: <Login/>},

    {path: "/dashboard", element: <PrivateRoute element= {<BaseLayout />} />, children: [
        {path: "", element:  <Navigate to = "customers" />} , 
        {path: "customers", element: <PrivateRoute element= {<Customers/>}/>, children: [
            {path: "", element: <CustomerList/>},
            {path: "create", element: <CustomerCreate/>},
            {path: "edit/:id", element: <CustomerEdit/>}
        ]},
        {path: "products", element: <PrivateRoute element= {<Products />}/>, children: [
            {path: "", element: <ProductList />},
            {path: "create", element: <ProductCreate/>},
            {path: "edit/:id", element: <ProductEdit />}
        ]},
        {path: "orders", element: <PrivateRoute element= {<Orders />}/>, children: [
            {path: "", element: <OrderList />},
            {path: "create", element: <OrderCreate/>},
            {path: "view/:id", element: <OrderView/>},
        ]},
    ]},
    {path: "*", element: <Navigate to = "/"/>},
]

const Approutes = () =>{

    const route = useRoutes(routes)

    return route
}

export default Approutes