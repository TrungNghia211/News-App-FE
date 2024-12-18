"use client";
import { useRouter } from "next/navigation";
import { Table, Modal, Form, Button, Layout } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Header from "../Header/page";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../../utils/api";
import columnsCategory from "./columns";
import FormAddEdit from "./FormAddEdit";

const { Content } = Layout;

export default function FormCategory() {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] =
    useState(false);
  const [isSubcategoryModalVisible, setIsSubcategoryModalVisible] =
    useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await apiFetch("/api/categories", "GET");
        setCategories(response);
      } catch (error) {
        console.log("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleOnSubmitAddCategory = () => {
    form.validateFields().then(async (values) => {
      try {
        const payload = { ...values };
        console.log("Payload to be sent:", payload);
        const data = await apiFetch("/api/categories", "POST", payload);
        setCategories([...categories, data.data]);
      } catch (error) {
        console.error("Error adding category:", error);
      } finally {
        form.resetFields();
        setIsAddCategoryModalVisible(false);
      }
    });
  };

  const handleOnSubmitEditCategory = () => {
    form.validateFields().then(async (values) => {
      try {
        const payload = { ...values };
        const data = await apiFetch(
          `/api/categories/${currentCategory.id}`,
          "PUT",
          payload
        );
        setCategories(
          categories.map((category) =>
            category.id === currentCategory.id
              ? { ...category, ...data.data }
              : category
          )
        );
      } catch (error) {
        console.error("Error editing category:", error);
      } finally {
        form.resetFields();
        setIsEditModalVisible(false);
      }
    });
  };

  const handleEditCategory = (record) => {
    setCurrentCategory(record);
    form.setFieldsValue({ ...record });
    setIsEditModalVisible(true);
  };

  const handleDeleteCategory = async (id) => {
    try {
      await apiFetch(`/api/categories/${id}`, "DELETE");
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleViewSubcategories = async (categoryId) => {
    try {
      const response = await apiFetch(
        `/api/subcategories/category/${categoryId}/`,
        "GET"
      );
      setSubcategories(response);
      setIsSubcategoryModalVisible(true);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleEditSubcategory = (subcategoryId) => {
    const subcategory = subcategories.find((item) => item.id === subcategoryId);
    setCurrentSubcategory(subcategory);
    console.log("Editing subcategory:", subcategory);
  };

  const handleDeleteSubcategory = async (subcategoryId) => {
    try {
      await apiFetch(`/api/subcategories/${subcategoryId}`, "DELETE");
      setSubcategories(
        subcategories.filter((subcategory) => subcategory.id !== subcategoryId)
      );
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  const columns = columnsCategory(
    handleEditCategory,
    handleDeleteCategory,
    handleViewSubcategories
  );

  return (
    <Layout>
      <Header />
      <Content style={{ padding: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "0 16px",
            marginBottom: "16px",
            height: "80px",
            borderRadius: "4px",
          }}
        >
          <Button
            style={{
              backgroundColor: "#ffc107",
              color: "#ffffff",
              fontSize: "20px",
              borderColor: "#ffc107",
              height: "50px",
            }}
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
          pagination={true}
        />

        {/* Add Category Modal */}
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
              onClick={handleOnSubmitAddCategory}
            >
              Add
            </Button>,
          ]}
        >
          <FormAddEdit form={form} />
        </Modal>

        {/* Edit Category Modal */}
        <Modal
          title="Edit Category"
          open={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsEditModalVisible(false)}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleOnSubmitEditCategory}
            >
              Save
            </Button>,
          ]}
        >
          <FormAddEdit form={form} />
        </Modal>

        {/* Subcategories Modal */}
        <Modal
          title="Subcategories"
          open={isSubcategoryModalVisible}
          onCancel={() => setIsSubcategoryModalVisible(false)}
          footer={[
            <Button
              key="save"
              type="primary"
              onClick={() => {
                console.log("Save changes");
                setIsSubcategoryModalVisible(false);
              }}
            >
              Save
            </Button>,
          ]}
        >
          {subcategories.length > 0 ? (
            <ul>
              {subcategories.map((subcategory) => (
                <li
                  key={subcategory.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <span>{subcategory.sub}</span>
                  <div>
                    <Button
                      type="link"
                      onClick={() => handleEditSubcategory(subcategory.id)}
                      style={{ marginRight: "10px" }}
                    >
                      Edit
                    </Button>
                    <Button
                      type="link"
                      onClick={() => handleDeleteSubcategory(subcategory.id)}
                      style={{ color: "#ff4d4f" }}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No subcategories found for this category.</p>
          )}
        </Modal>
      </Content>
    </Layout>
  );
}
