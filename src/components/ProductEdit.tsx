import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

// Định nghĩa interface cho sản phẩm
interface Product {
  id?: number;
  name: string;
  price: number;
  description: string;
  image?: string;
}

// Định nghĩa interface cho form data
interface FormValues {
  name: string;
  price: number; 
  description: string;
  image?: string;
}

// Định nghĩa interface cho data gửi lên API
interface ProductUpdateData {
  name: string;
  price: number;
  description: string;
  image?: string;
}

interface ProductEditFormProps {
  productId?: number; // Optional vì có thể lấy từ useParams
}

const ProductEditForm: React.FC<ProductEditFormProps> = ({ productId }) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  // Sử dụng productId từ props hoặc từ params
  const currentId = productId || id;

  // Fetch product data
  const fetchProduct = async (productId: number | string): Promise<Product> => {
    const response = await axios.get(`http://localhost:3001/products/${productId}`);
    return response.data;
  };

  // Sử dụng useQuery để fetch dữ liệu sản phẩm
  const { data, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", currentId],
    queryFn: () => fetchProduct(currentId!),
    enabled: !!currentId, // Chỉ fetch khi có id
  });

  // Set form values khi có data
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        price: data.price.toString(),
        description: data.description,
        image: data.image 
      });
    }
  }, [data, form]);

  // Hàm gọi API để cập nhật sản phẩm
  const updateProduct = async (productData: ProductUpdateData): Promise<Product> => {
    const response = await axios.put(
      `http://localhost:3001/products/${currentId}`,
      productData
    );
    return response.data;
  };

  // Sử dụng useMutation với TypeScript
  const mutation = useMutation<Product, Error, ProductUpdateData>({
    mutationFn: updateProduct,
    onSuccess: () => {
      message.success("Cập nhật sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", currentId] });
      nav("/products")
    },
    onError: (error) => {
      message.error(`Lỗi khi cập nhật sản phẩm: ${error.message}`);
    },
  });

  // Hàm submit form
  const onFinish = (values: FormValues) => {
    // Chuyển price từ string sang number
    const productData: ProductUpdateData = {
      name: values.name,
      price: Number(values.price),
      description: values.description
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
        initialValues={{ name: "", price: "" }}
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
            { pattern: /^\d+(\.\d+)?$/, message: "Giá phải là số hợp lệ!" }
          ]}
        >
          <Input type="number" />
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
          <Button 
          type="primary" htmlType="submit" loading={mutation.isPending}

          >
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductEditForm;