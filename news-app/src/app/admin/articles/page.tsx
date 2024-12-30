"use client";
import React, { useEffect, useState, useMemo } from "react";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar, Card, Row, Col, Typography, Button, Modal, Input, Pagination } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header";
import debounce from "lodash.debounce";
import { clientSessionToken } from "@/lib/http";
import jwt from 'jsonwebtoken';
import { apiFetch } from "../../../../utils/api";
import useCustomToast from "../../../../utils/toast";


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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(30);
  const sessionToken = clientSessionToken.value;
  const decoded = jwt.decode(sessionToken);
  const {success} = useCustomToast();

  useEffect(() => {
    const fetchUserAndArticles = async () => {
      if (!decoded) {
        return router.push("/");
      }
      try {
        const user = await apiFetch(`/api/users/${decoded.user_id}/`);
        if (user.is_staff === true) {
          const data = await apiFetch("/api/articles/all/");
          const activeArticles = data.filter((article) => article.active === true);
          const sortedArticles = activeArticles.sort((a, b) => {
            const dateA = new Date(a.updated_date);
            const dateB = new Date(b.updated_date);
            return dateB - dateA;
          });
  
          setArticles(sortedArticles);
          setDisplayedArticles(sortedArticles.slice(0, pageSize));
        } else {
          router.push("/");
        }
      } catch (err) {
        console.error("Error fetching user and articles:", err);
      }
    };
  
    fetchUserAndArticles();
  }, [decoded, router, pageSize]);
  

  const filteredArticles = useMemo(() => {
    return articles.filter((article) =>
      article.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [articles, searchValue]);

  const onSearch = debounce((value) => {
    setSearchValue(value);
  }, 500);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const offset = (page - 1) * pageSize;
    const paginatedArticles = filteredArticles.slice(offset, offset + pageSize);
    setDisplayedArticles(paginatedArticles);
  };

  const handleAddNew = () => {
    router.push("/admin/articles/add");
  };

  const showDeleteModal = (articleId) => {
    setArticleToDelete(articleId);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await apiFetch(`/api/articles/${articleToDelete}/`, "DELETE");
      const updatedArticles = articles.filter(
        (article) => article.id !== articleToDelete
      );
      setArticles(updatedArticles);
      setDisplayedArticles(updatedArticles.slice(0, pageSize));
      setIsDeleteModalVisible(false);
      setArticleToDelete(null);
      success("Xóa Bài Viết Thành Công !");
      
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

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>List Articles </Title>
        <div className="flex items-center">
          <Search
            placeholder="Search articles"
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            className="mr-4 w-72 text-lg p-3"
          />
          <Button
            type="primary"
            onClick={handleAddNew}
            className="bg-yellow-400 text-white text-lg py-2 px-4 w-auto flex items-center justify-center mx-auto"
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
                  className="h-[180px] md:h-[200px] w-full md:w-[500px] object-cover object-cover"
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
                  title={<div className="break-words">{article.title}</div>}
                />
              </Link>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredArticles.length > pageSize && (
        <div className="flex justify-center mt-8">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredArticles.length}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper
          />
        </div>
      )}

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
