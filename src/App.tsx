import React from 'react';
import logo from './logo.svg';
import './App.css';
import ProductList from './components/ProductList';
import CategoryList from './components/CategoryList';

function App() {
  return (
    <div style={{padding : "20px"}}>
      <ProductList />
      <CategoryList />
    </div>
  );
}

export default App;
