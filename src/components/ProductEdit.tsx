import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Input, Button, message, InputNumber } from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface Product {
  id?: number;
  name: string;
  price: number;
  description: string;
  image?: string;
}

interface FormValues {
  name: string;
  price: number;
  description: string;
  image?: string;
}

interface ProductUpdateData {
  name: string;
  price: number;
  description: string;
  image?: string;
}

interface ProductEditFormProps {
  productId?: number;
}

const ProductEditForm: React.FC<ProductEditFormProps> = ({ productId }) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const currentId = productId || id;

  const fetchProduct = async (productId: number | string): Promise<Product> => {
    const response = await axios.get(
      `http://localhost:3001/products/${productId}`
    );
    return response.data;
  };

  const { data, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", currentId],
    queryFn: () => fetchProduct(currentId!),
    enabled: !!currentId,
  });

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        price: data.price,
        description: data.description,
        image: data.image || "",
      });
    }
  }, [data, form]);

  const updateProduct = async (
    productData: ProductUpdateData
  ): Promise<Product> => {
    const response = await axios.put(
      `http://localhost:3001/products/${currentId}`,
      productData
    );
    return response.data;
  };

  const mutation = useMutation<Product, Error, ProductUpdateData>({
    mutationFn: updateProduct,
    onSuccess: () => {
      message.success("Cập nhật sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", currentId] });
      navigate("/products");
    },
    onError: (error) => {
      message.error(`Lỗi khi cập nhật sản phẩm: ${error.message}`);
    },
  });

  const onFinish = (values: FormValues) => {
    const productData: ProductUpdateData = {
      name: values.name,
      price: values.price,
      description: values.description,
      image: values.image,
    };

    mutation.mutate(productData);
  };

  if (isLoadingProduct) {
    return <div>Đang tải dữ liệu sản phẩm...</div>;
  }

  if (!currentId) {
    return <div>Không tìm thấy ID sản phẩm</div>;
  }

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Chỉnh sửa sản phẩm</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ name: "", price: 0 }}
      >
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giá"
          name="price"
          rules={[
            { required: true, message: "Vui lòng nhập giá sản phẩm!" },
            { type: "number", min: 1, message: "Giá sản phẩm phải lớn hơn 0" },
          ]}
        >
          <InputNumber style={{ width: "100%" }} addonAfter="VND" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item 
          label="Hình ảnh (URL)" 
          name="image"
          rules={[{ required: true, message: "Vui lòng nhập hình ảnh" }]}
          >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductEditForm;
