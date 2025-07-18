import React, { useState } from "react";
import {
  HomeOutlined,
  ShopFilled,
  ShoppingOutlined,
  TagsOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: "Homepage",
    key: "/",
    icon: <HomeOutlined />,
  },
  {
    label: "Products",
    key: "/products",
    icon: <ShopFilled />,
  },
  {
    label: "Categories",
    key: "/categories",
    icon: <UnorderedListOutlined />,
  },
  {
    label: "User",
    key: "/users",
    icon: <UserOutlined />,
  },
  {
    label: "Brand",
    key: "/brands",
    icon: <TagsOutlined />,
  },
  {
    label: "Order",
    key: "/orders",
    icon: <ShoppingOutlined />,
  },
];

const Header: React.FC = () => {
  const [current, setCurrent] = useState("home");
  const navigate = useNavigate();

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    navigate(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

export default Header;