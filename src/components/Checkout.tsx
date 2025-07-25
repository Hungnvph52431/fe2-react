import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Spin, Alert, Tag, Typography } from "antd";
import axios from "axios";
import Header from "./Header";

const { Title, Text } = Typography;

interface Order {
  id: number;
  customerName: string;
  email: string;
  total: number;
  status: "Tiến hành" | "Hoàn thành" | "Hủy bỏ";
  date: string;
}

const fetchLatestOrder = async (): Promise<Order> => {
  const { data } = await axios.get("http://localhost:3001/orders");
  // Lấy đơn hàng mới nhất (giả sử là đơn cuối cùng trong danh sách)
  return data[data.length - 1];
};

const Checkout: React.FC = () => {
  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["latest-order"],
    queryFn: fetchLatestOrder,
  });

  const statusColor = (status: string) => {
    switch (status) {
      case "Hoàn thành":
        return "green";
      case "Tiến hành":
        return "orange";
      case "Hủy bỏ":
        return "red";
      default:
        return "default";
    }
  };

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description="Không thể tải thông tin đơn hàng. Vui lòng thử lại!"
        type="error"
        showIcon
      />
    );
  }

  if (isLoading || !order) {
    return <Spin tip="Đang tải đơn hàng..." />;
  }

  return (
    <div className="container mx-auto p-4">
      <Header />
      <Title level={3}>Xác nhận đơn hàng</Title>
      <Card bordered>
        <p>
          <Text strong>Mã đơn hàng:</Text> #{order.id}
        </p>
        <p>
          <Text strong>Khách hàng:</Text> {order.customerName}
        </p>
        <p>
          <Text strong>Email:</Text> {order.email}
        </p>
        <p>
          <Text strong>Tổng tiền:</Text> {order.total.toLocaleString("vi-VN")} ₫
        </p>
        <p>
          <Text strong>Ngày đặt:</Text> {new Date(order.date).toLocaleDateString("vi-VN")}
        </p>
        <p>
          <Text strong>Trạng thái:</Text>{" "}
          <Tag color={statusColor(order.status)}>{order.status.toUpperCase()}</Tag>
        </p>
      </Card>
    </div>
  );
};

export default Checkout;
