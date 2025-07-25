// src/components/admin/layout/DashboardLayout.tsx
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  AppstoreOutlined,
  UserOutlined,
  TagsOutlined,
  ShoppingCartOutlined,
  DashboardOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const DashboardLayout = () => {
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div className="text-white text-center py-4 text-xl font-bold">Admin</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
        >
          <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
            <Link to="/dashboard">Tổng quan</Link>
          </Menu.Item>
          <Menu.Item key="/dashboard/products" icon={<AppstoreOutlined />}>
            <Link to="/dashboard/products">Sản phẩm</Link>
          </Menu.Item>
          <Menu.Item key="/dashboard/users" icon={<UserOutlined />}>
            <Link to="/dashboard/users">Người dùng</Link>
          </Menu.Item>
          <Menu.Item key="/dashboard/categories" icon={<TagsOutlined />}>
            <Link to="/dashboard/categories">Danh mục</Link>
          </Menu.Item>
          <Menu.Item key="/dashboard/orders" icon={<ShoppingCartOutlined />}>
            <Link to="/dashboard/orders">Đơn hàng</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', paddingLeft: 16, fontSize: 18 }}>
          Quản trị hệ thống
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
