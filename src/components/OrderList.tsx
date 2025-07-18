import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, Button, Alert, Tag } from "antd";
import axios from "axios";

interface Order {
  id: number;
  customerName: string;
  email: string;
  total: number;
  status: "Tiến hành" | "Hoàn thành" | "Hủy bỏ";
  date: string;
}

const fetchOrders = async (): Promise<Order[]> => {
  const { data } = await axios.get("http://localhost:3001/orders");
  return data;
};

const OrderList: React.FC = () => {
  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const statusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "green";
      case "pending":
        return "orange";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: Order, b: Order) => a.id - b.id,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      sorter: (a: Order, b: Order) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: (total: number) => total.toLocaleString("vi-VN") + " ₫",
      sorter: (a: Order, b: Order) => a.total - b.total,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={statusColor(status)}>{status.toUpperCase()}</Tag>,
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      sorter: (a: Order, b: Order) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
  ];

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description="Không thể tải danh sách đơn hàng. Vui lòng thử lại!"
        type="error"
        showIcon
      />
    );
  }

  return (
    <div>
      <h2>Danh sách đơn hàng</h2>
      <Button
        type="primary"
        onClick={() => refetch()}
        style={{ marginBottom: 16 }}
        disabled={isLoading}
      >
        Làm mới dữ liệu
      </Button>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default OrderList;
