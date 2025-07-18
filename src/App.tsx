import React from 'react';
import logo from './logo.svg';
import './App.css';
import ProductList from './components/ProductList';
import CategoryList from './components/CategoryList';
import UserList from './components/UserList';
import BrandList from './components/BrandList';
import OrderList from './components/OrderList';

function App() {
  return (
    <div style={{padding : "20px"}}>
      <ProductList />
      <CategoryList />
      <UserList />
      <BrandList />
      <OrderList />
    </div>
  );
}

export default App;
