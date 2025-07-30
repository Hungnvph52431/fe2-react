import React, { useState, useEffect } from "react";
import {
  CheckOutlined,
  HomeOutlined,
  OrderedListOutlined,
  ShopFilled,
  ShoppingOutlined,
  TagsOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: "Trang chủ",
    key: "/",
    icon: <HomeOutlined />,
  },
  {
    label: "Sản phẩm",
    key: "/products",
    icon: <ShopFilled />,
  },
  {
    label: "Danh mục",
    key: "/categories",
    icon: <UnorderedListOutlined />,
  },
  {
    label: "Người dùng",
    key: "/users",
    icon: <UserOutlined />,
  },
  {
    label: "Thương hiệu",
    key: "/brands",
    icon: <TagsOutlined />,
  },
  {
    label: "Đơn hàng",
    key: "/orders",
    icon: <ShoppingOutlined />,
  },
  {
    label: "Thanh toán",
    key: "/checkouts",
    icon: <CheckOutlined />,
  },
  {
    label: "danh sách",
    key: "/list",
    icon: <OrderedListOutlined  />,
  },
  
];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location.pathname]);

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    navigate(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      theme="light"
      style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
      items={items}
    />
  );
};

export default Header;
