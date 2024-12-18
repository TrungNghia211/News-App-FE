import { Button, Form, Input } from "antd";
import React from "react";
import { apiFetch } from "../../../../../utils/api";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 0 },
  },
};

const FormAddEdit = ({ form, currentCategory, onSave }) => {
  const handleSubmit = async (values) => {
    const { name, description } = values;

    const categoryPayload = {
      name,
      description,
    };

    try {
      const categoryData = await apiFetch(
        "/api/categories",
        "POST",
        categoryPayload
      );

      onSave();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={{
        description: "No description",
      }}
      onFinish={handleSubmit}
    >
      <Form.Item
        label="Category Name"
        required
        name="name"
        rules={[{ required: true, message: "Please enter the category name!" }]}
      >
        <Input placeholder="Enter category name" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please enter the description!" }]}
      >
        <Input placeholder="Enter category description" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Category
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormAddEdit;
