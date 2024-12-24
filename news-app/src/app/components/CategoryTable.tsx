'use client'

import { Table, Modal, Form, Button, Input, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Header from "./Header";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../utils/api";
import { columns } from "@/app/components/CategoryTableColumns";
import http from "@/lib/http";
import { log } from "node:console";

type IValues = {
  name: string,
  description: string,
  subcategories: string[]
}

export default function CategoryTable() {

  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await apiFetch("/api/categories/", "GET");
        setCategories(response);
      } catch (error) {
        console.log("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    form.validateFields().then(async (values: IValues) => {

      try {
        const payload = { ...values };

        // http.get<any>("/api/subcategories/");

        const data = await apiFetch("/api/categories/", "POST", payload);

        const subcategoryPromises = values.subcategories.map((sub) => {
          const body = {
            sub: sub,
            category: data.id,
          };
          return http.post<any>("api/subcategories/", JSON.stringify(body));
        });

        const subcategoryResponses = await Promise.all(subcategoryPromises);
        data.subcategories = subcategoryResponses.map((res) => res.payload);
        setCategories((prevCategories) => [...prevCategories, data]);
      } catch (error) {
        console.error("Error adding category:", error);
      } finally {
        form.resetFields();
        setIsAddCategoryModalVisible(false);
      }
    });

  };

  return (
    <>
      <Header />
      <div className="flex justify-end items-center h-[70px]">
        <Button
          className="bg-black text-xl text-white h-[40px] mr-[10px] hover:bg-black"
          icon={<PlusOutlined />}
          onClick={() => setIsAddCategoryModalVisible(true)}
        >
          Add Category
        </Button>
      </div>

      <Table
        loading={isLoading}
        columns={columns}
        dataSource={categories}
        rowKey="id"
      />

      <Modal
        title="Add Category"
        open={isAddCategoryModalVisible}
        onCancel={() => setIsAddCategoryModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsAddCategoryModalVisible(false)}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleAddCategory}
          >
            Add
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          form={form}
        >
          <Form.Item
            label="Category Name"
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

          <Form.Item
            label="Subcategories"
            name="subcategories"
            rules={[{ required: true, message: 'Please enter at least one subcategory' }]}
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Enter subcategories"
              open={false}
            />
          </Form.Item>

        </Form>
      </Modal>
    </>
  );
}
