import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, Button, Alert } from "antd";
import axios from "axios";
import Header from "./Header";

interface Brand {
  id: number;
  name: string;
  logo?: string;
  country?: string;
}

const fetchBrands = async (): Promise<Brand[]> => {
  const { data } = await axios.get("http://localhost:3001/brands");
  return data;
};

const BrandList: React.FC = () => {
  const {
    data: brands,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: Brand, b: Brand) => a.id - b.id,
    },
    {
      title: "Tên thương hiệu",
      dataIndex: "name",
      key: "name",
      sorter: (a: Brand, b: Brand) => a.name.localeCompare(b.name),
    },
    {
      title: "Quốc gia",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      render: (logo: string) =>
        logo ? (
          <img
            src={logo}
            alt="logo"
            style={{ width: 80, height: 80, objectFit: "contain" }}
          />
        ) : (
          <span>Không có</span>
        ),
    },
  ];

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description="Không thể tải danh sách thương hiệu. Vui lòng thử lại!"
        type="error"
        showIcon
      />
    );
  }

  return (
    <div>
        <Header />
      <h2>Danh sách thương hiệu</h2>
      <Button
        type="primary"
        onClick={() => refetch()}
        style={{ marginBottom: 16 }}
        disabled={isLoading}
      >
        Làm mới dữ liệu
      </Button>
      <Table
        dataSource={brands}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default BrandList;
