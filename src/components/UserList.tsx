import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, Button, Alert } from "antd";
import axios from "axios";
import Header from "./Header";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;

}

const fetchUsers = async (): Promise<User[]> => {
  const { data } = await axios.get("http://localhost:3001/users");
  return data;
};

const UserList: React.FC = () => {
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: User, b: User) => a.id - b.id,
    },
    {
      title: "Tên người dùng",
      dataIndex: "name",
      key: "name",
      sorter: (a: User, b: User) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    }
  ];

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description="Không thể tải danh sách người dùng. Vui lòng thử lại!"
        type="error"
        showIcon
      />
    );
  }

  return (
    <div>
        <Header />
      <h2>Danh sách người dùng</h2>
      <Button
        type="primary"
        onClick={() => refetch()}
        style={{ marginBottom: 16 }}
        disabled={isLoading}
      >
        Làm mới dữ liệu
      </Button>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default UserList;
