"use client";
import React, { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar, Card, Row, Col, Typography, Button, Modal, Input } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../../../components/Header/page";
import debounce from "lodash.debounce";

const { Meta } = Card;
const { Title } = Typography;
const { Search } = Input;

export default function Articles() {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [articles, setArticles] = useState([]);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/articles/all/");
        const data = await res.json();
        setArticles(data);
        setDisplayedArticles(data);
      } catch (err) {
        console.error("Error fetching articles:", err);
      }
    };
    fetchArticles();
  }, []);

  const onSearch = debounce((value) => {
    const filteredArticles = articles.filter((article) =>
      article.title.toLowerCase().includes(value.toLowerCase())
    );
    setDisplayedArticles(filteredArticles);
  }, 500);

  const handleAddNew = () => {
    router.push("/admin/articles/add");
  };

  const showDeleteModal = (articleId) => {
    setArticleToDelete(articleId);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:8000/api/articles/${articleToDelete}/`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });
      setDisplayedArticles(
        displayedArticles.filter((article) => article.id !== articleToDelete)
      );
      setIsDeleteModalVisible(false);
      setArticleToDelete(null);
    } catch (err) {
      console.error("Error deleting article:", err);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setArticleToDelete(null);
  };

  const handleEdit = (articleId) => {
    router.push(`/admin/articles/edit/${articleId}`);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  return (
    <div className="p-4">
      <Header />
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>List Articles </Title>
        <div className="flex items-center">
          <Search
            placeholder="Search articles"
            value={searchValue}
            onChange={handleSearchChange}
            className="mr-4 w-72 text-lg p-3"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNew}
            className="bg-yellow-400 text-white text-lg py-2 px-4"
          >
            Add New
          </Button>
        </div>
      </div>
      <Row gutter={16} justify="start">
        {displayedArticles.map((article) => (
          <Col
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xl={4}
            key={article.id}
            className="mb-4"
          >
            <Card
              className="w-full h-full flex flex-col justify-between"
              cover={
                <img
                  alt={article.title}
                  src={article.image_url}
                  className="max-h-44 object-cover"
                />
              }
              actions={[
                <Button
                  key="edit"
                  className="bg-blue-500 text-white"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(article.id)}
                  style={{ padding: "20px 30px", fontSize: "1.75rem" }}
                />,
                <Button
                  key="delete"
                  className="bg-red-500 text-white"
                  onClick={() => showDeleteModal(article.id)}
                  style={{ padding: "20px 20px", fontSize: "1.25rem" }}
                >
                  <DeleteOutlined />
                </Button>,
              ]}
            >
              <Link href={`/articles/${article.id}`}>
                <Meta
                  title={
                    article.title.length > 50
                      ? `${article.title.slice(0, 50)}...`
                      : article.title
                  }
                />
              </Link>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={handleCancelDelete}
        okText="Xóa"
        okButtonProps={{
          style: { backgroundColor: "red", borderColor: "red", color: "white" },
        }}
      >
        <p>Bạn có chắc chắn muốn xóa bài viết này không?</p>
      </Modal>
    </div>
  );
}
"use client";
import React, { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar, Card, Row, Col, Typography, Button, Modal, Input } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../../../components/Header/page";
import debounce from "lodash.debounce";

const { Meta } = Card;
const { Title } = Typography;
const { Search } = Input;

export default function Articles() {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [articles, setArticles] = useState([]);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/articles/all/");
        const data = await res.json();
        setArticles(data);
        setDisplayedArticles(data);
      } catch (err) {
        console.error("Error fetching articles:", err);
      }
    };
    fetchArticles();
  }, []);

  const onSearch = debounce((value) => {
    const filteredArticles = articles.filter((article) =>
      article.title.toLowerCase().includes(value.toLowerCase())
    );
    setDisplayedArticles(filteredArticles);
  }, 500);

  const handleAddNew = () => {
    router.push("/admin/articles/add");
  };

  const showDeleteModal = (articleId) => {
    setArticleToDelete(articleId);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:8000/api/articles/${articleToDelete}/`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });
      setDisplayedArticles(
        displayedArticles.filter((article) => article.id !== articleToDelete)
      );
      setIsDeleteModalVisible(false);
      setArticleToDelete(null);
    } catch (err) {
      console.error("Error deleting article:", err);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setArticleToDelete(null);
  };

  const handleEdit = (articleId) => {
    router.push(`/admin/articles/edit/${articleId}`);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  return (
    <div className="p-4">
      <Header />
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>List Articles </Title>
        <div className="flex items-center">
          <Search
            placeholder="Search articles"
            value={searchValue}
            onChange={handleSearchChange}
            className="mr-4 w-72 text-lg p-3"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNew}
            className="bg-yellow-400 text-white text-lg py-2 px-4"
          >
            Add New
          </Button>
        </div>
      </div>
      <Row gutter={16} justify="start">
        {displayedArticles.map((article) => (
          <Col
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xl={4}
            key={article.id}
            className="mb-4"
          >
            <Card
              className="w-full h-full flex flex-col justify-between"
              cover={
                <img
                  alt={article.title}
                  src={article.image_url}
                  className="max-h-44 object-cover"
                />
              }
              actions={[
                <Button
                  key="edit"
                  className="bg-blue-500 text-white"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(article.id)}
                  style={{ padding: "20px 30px", fontSize: "1.75rem" }}
                />,
                <Button
                  key="delete"
                  className="bg-red-500 text-white"
                  onClick={() => showDeleteModal(article.id)}
                  style={{ padding: "20px 20px", fontSize: "1.25rem" }}
                >
                  <DeleteOutlined />
                </Button>,
              ]}
            >
              <Link href={`/articles/${article.id}`}>
                <Meta
                  title={
                    article.title.length > 50
                      ? `${article.title.slice(0, 50)}...`
                      : article.title
                  }
                />
              </Link>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={handleCancelDelete}
        okText="Xóa"
        okButtonProps={{
          style: { backgroundColor: "red", borderColor: "red", color: "white" },
        }}
      >
        <p>Bạn có chắc chắn muốn xóa bài viết này không?</p>
      </Modal>
    </div>
  );
}
