import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, Button, Alert, Input, Space } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import axios from "axios";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import Header from "./Header";

// Định nghĩa interface cho sản phẩm
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image?: string;
}

// Hàm gọi API để lấy danh sách sản phẩm - Cách 2: Filter phía client
const fetchProducts = async (keyword: string): Promise<Product[]> => {
  console.log('Searching with keyword:', keyword);
  
  // Luôn lấy tất cả sản phẩm
  const { data } = await axios.get("http://localhost:3001/products");
  
  console.log('Total products from API:', data?.length);
  
  // Nếu không có keyword, trả về tất cả
  if (!keyword || !keyword.trim()) {
    return data;
  }
  
  // Filter phía client
  const filteredData = data.filter((product: Product) => 
    product.name.toLowerCase().includes(keyword.toLowerCase()) ||
    product.description.toLowerCase().includes(keyword.toLowerCase())
  );
  
  console.log('Filtered products:', filteredData?.length);
  return filteredData;
};

const ProductList: React.FC = () => {
  // Sử dụng useSearchParams để quản lý query parameters
  const [searchParams, setSearchParams] = useSearchParams();
  const { categoryId } = useParams(); // Ví dụ sử dụng useParams nếu có category
  
  // Lấy keyword từ URL params
  const keyword = searchParams.get('search') || '';
  const [inputValue, setInputValue] = useState(keyword);

  const navigate = useNavigate();

  const goToProductDetail = (id: number) => {
    navigate(`/products/${id}`);
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = () => {
    setSearchParams({ search: inputValue });
  };

  // Hàm xóa bộ lọc
  const handleClearSearch = () => {
    setInputValue('');
    setSearchParams({});
  };

  // useQuery sử dụng keyword từ URL params
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", keyword, categoryId], // Bao gồm cả categoryId nếu có
    queryFn: () => fetchProducts(keyword),
    // Tự động refetch khi keyword thay đổi
  });

  // Sync inputValue với keyword từ URL khi component mount
  useEffect(() => {
    setInputValue(keyword);
  }, [keyword]);

  // Cấu hình cột cho bảng AntD
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: Product, b: Product) => a.id - b.id,
      width: 80,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: (a: Product, b: Product) => a.price - b.price,
      render: (price: number) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image: string) => 
        image ? (
          <img
            src={image}
            alt="product"
            style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
          />
        ) : (
          <div style={{ width: 60, height: 60, background: '#f0f0f0', borderRadius: 4 }} />
        )
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: Product) => (
        <Button 
          type="link" 
          onClick={() => goToProductDetail(record.id)}
        >
          Xem chi tiết
        </Button>
      ),
    }
  ];

  // Xử lý lỗi
  if (error) {
    return (
      <div>
        <Header />
        <Alert
          message="Lỗi"
          description="Không thể tải dữ liệu. Vui lòng thử lại!"
          type="error"
          showIcon
          style={{ margin: "20px 0" }}
        />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={{ padding: "20px" }}>
        <h2>Danh sách sản phẩm</h2>
        
        {/* Thanh tìm kiếm */}
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 300 }}
            suffix={<SearchOutlined />}
          />
          <Button type="primary" onClick={handleSearch} loading={isLoading}>
            Tìm kiếm
          </Button>
          <Button type="primary" onClick={() => refetch()} disabled={isLoading}>
            Làm mới
          </Button>
        </Space>

        {/* Bảng sản phẩm */}
        <Table
          dataSource={products}
          columns={columns}
          rowKey="id"
          loading={isLoading} 
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} sản phẩm`
          }} 
        />
      </div>
    </div>
  );
};

export default ProductList;