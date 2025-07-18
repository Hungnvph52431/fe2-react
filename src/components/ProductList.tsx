import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, Button, Alert } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

// Định nghĩa interface cho sản phẩm
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

// Hàm gọi API để lấy danh sách sản phẩm
const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await axios.get("http://localhost:3001/products");
  return data;
};

const ProductList: React.FC = () => {

  const navigate = useNavigate();

  const goToProductDetail = (id : number) => {
    navigate(`/products/${id}`);
  }

  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"], // Khóa duy nhất cho truy vấn
    queryFn: fetchProducts, // Hàm lấy dữ liệu
  });

  // Cấu hình cột cho bảng AntD
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: Product, b: Product) => a.id - b.id, // Sắp xếp theo ID
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name), // Sắp xếp theo tên
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: (a: Product, b: Product) => a.price - b.price, // Sắp xếp theo giá
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img
          src={image}
          alt="product"
          style={{ width: 100, height: 100, objectFit: "cover" }}
        />
      ),
    }

  ];

  // Xử lý lỗi
  if (error) {
    return (
      <Alert
        message="Lỗi"
        description="Không thể tải dữ liệu. Vui lòng thử lại!"
        type="error"
        showIcon
      />
    );
  }

  return (
    <div>
      <Header />
      <h2>Danh sách sản phẩm</h2>
      <Button
        type="primary"
        onClick={() => refetch()}
        style={{ marginBottom: 16 }}
        disabled={isLoading}
      >
        Làm mới dữ liệu
      </Button>
      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        loading={isLoading} 
        pagination={{ pageSize: 5 }} 
      />
      <button onClick={() => goToProductDetail(1)} >Xem sản phẩm 1</button>
    </div>
  );
};

export default ProductList;