import React from 'react';
import logo from './logo.svg';
import './App.css';
import ProductList from './components/ProductList';
import CategoryList from './components/CategoryList';
import UserList from './components/UserList';
import BrandList from './components/BrandList';
import OrderList from './components/OrderList';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './components/HomePage';
import Checkout from './components/Checkout';
import ProductDetail from './components/ProductDetail';
import Dashboard from './components/admin/Dashboard';


function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Homepage/>
    },
    {
      path: "/products",
      element: <ProductList/>
    },
    {
      path: "/products/:id",
      element: <ProductDetail/>
    },
    {
      path: "/users",
      element: <UserList/>
    },
    {
      path: "/categories",
      element: <CategoryList/>
    },
    {
      path: "/brands",
      element: <BrandList/>
    },
    {
      path: "/orders",
      element: <OrderList/>
    },
    {
      path: "/checkouts",
      element: <Checkout />
    },
     {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "products",
        element: <ProductList />,
      },
      {
        path: "users",
        element: <UserList />,
      },
      {
        path: "categories",
        element: <CategoryList />,
      },
      {
        path: "orders",
        element: <OrderList />,
      }
    ],
  },
    
  ])

  return (
    <div style={{padding : "20px"}}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
