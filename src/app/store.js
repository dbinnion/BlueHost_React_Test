import { configureStore } from '@reduxjs/toolkit';
import productFormReducer from '../features/productForm/productFormSlice';

export default configureStore({
  reducer: {
    productForm: productFormReducer,
  },
});
