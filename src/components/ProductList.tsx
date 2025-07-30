import React, { useState, useEffect } from "react";
import { Table, Button, Alert, Input, Space, Popconfirm, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import Header from "./Header";

// Interface sản phẩm
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image?: string;
}

// API: Lấy danh sách sản phẩm
const fetchProducts = async (keyword: string): Promise<Product[]> => {
  const { data } = await axios.get("http://localhost:3001/products");
  if (!keyword || !keyword.trim()) return data;

  return data.filter(
    (product: Product) =>
      product.name.toLowerCase().includes(keyword.toLowerCase()) ||
      product.description.toLowerCase().includes(keyword.toLowerCase())
  );
};

// API: Xóa sản phẩm
const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`http://localhost:3001/products/${id}`);
};

const ProductList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("search") || "";
  const [inputValue, setInputValue] = useState(keyword);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { categoryId } = useParams();

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", keyword, categoryId],
    queryFn: () => fetchProducts(keyword),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      message.success("Xóa sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      message.error("Xóa sản phẩm thất bại");
    },
  });

  const handleSearch = () => {
    setSearchParams({ search: inputValue });
  };

  useEffect(() => {
    setInputValue(keyword);
  }, [keyword]);

  const goToProductDetail = (id: number) => {
    navigate(`/products/${id}`);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

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
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          <div
            style={{
              width: 60,
              height: 60,
              background: "#f0f0f0",
              borderRadius: 4,
            }}
          />
        ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: unknown, record: Product) => (
        <Space>
          <Button
            type="primary"
            onClick={() => goToProductDetail(record.id)}
            size="small"
          >
            Xem
          </Button>

          <Button
            type="primary"
            onClick={() => navigate(`/products/edit/${record.id}`)}
            size="small"
          >
            Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này không?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="primary" danger size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <div>
        <Header />
        <Alert
          message="Lỗi"
          description="Không thể tải dữ liệu. Vui lòng thử lại sau."
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
          <Button type="primary" onClick={() => navigate("/products/create")}>
            Thêm mới sản phẩm
          </Button>
        </Space>

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
              `${range[0]}-${range[1]} trong ${total} sản phẩm`,
          }}
        />
      </div>
    </div>
  );
};

export default ProductList;
