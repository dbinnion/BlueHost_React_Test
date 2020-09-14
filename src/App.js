import React from 'react';
import logo from './logo.svg';
import { ProductForm } from './features/productForm/ProductForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ProductForm />
      </header>
    </div>
  );
}

export default App;
