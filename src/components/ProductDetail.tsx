
import React from 'react'
import { useParams } from 'react-router-dom'
import Header from './Header';

const ProductDetail = () => {
    const {id} = useParams();

  return <>

  <Header /> 
     
      <div>Chi tiết sản phẩm {id}</div>
    
  </>
}

export default ProductDetail