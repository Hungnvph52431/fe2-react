import React from "react";
import { Form, Input, InputNumber, Button, message, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Header from "./Header";
interface Product {
  id?: number;
  name: string;
  price: number;
  description: string;
  image?: string;
}

const createProduct = async (product: Product): Promise<void> => {
  await axios.post("http://localhost:3001/products", product);
};

const ProductCreate: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form] = Form.useForm();

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      message.success("Thêm sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products");
    },
    onError: () => {
      message.error("Thêm sản phẩm thất bại!");
    },
  });

  const onFinish = (values: Product) => {
    mutation.mutate(values);
  };

  return (
    <>
      <Header />
      <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
        <h2>Thêm sản phẩm mới</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập giá" }]}
          >
            <Input type="number" style={{ width: "100%" }} addonAfter="VND" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Hình ảnh (URL)" name="image">
            <Input />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={mutation.isPending}
              >
                Thêm sản phẩm
              </Button>
              <Button onClick={() => navigate("/products")}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default ProductCreate;
