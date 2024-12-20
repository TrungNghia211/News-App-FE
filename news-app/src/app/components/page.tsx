import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { clientSessionToken } from "@/lib/http";
import useCustomToast from "../../../utils/toast";
import jwt from 'jsonwebtoken';

interface Comment {
  id: string;
  title: string;
  author: string;
  authorName: string; 
  created_date: string;
  updated_date: string;
}

interface CommentedFormProps {
  articleId: string;
}

const CommentedForm: React.FC<CommentedFormProps> = ({ articleId }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedComment, setEditedComment] = useState("");
  const router = useRouter();
  
  const { success, error } = useCustomToast();

  const sessionToken = clientSessionToken.value;
  const decoded = jwt.decode(sessionToken);
  
  const fetchComments = useCallback(async () => {
    
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/comments/articles/${articleId}/`
      );

      if (!response.ok) throw new Error("Failed to fetch comments.");

      const data = await response.json();
      const formattedComments = await Promise.all(
        data.map(async (item: any) => {
          try {
            const userResponse = await fetch(
              `http://127.0.0.1:8000/api/users/${item.author}/`
            );
  
            if (!userResponse.ok) throw new Error("Failed to fetch user data.");
  
            const userData = await userResponse.json();
  
            return {
              id: item.id.toString(),
              title: item.title,
              author: userData.username || "Unknown", 
              authorName: userData.username || "Unknown", 
              created_date: item.created_date,
              updated_date: item.updated_date,
            };
          } catch (error) {
            console.error("Error fetching user data:", error);
            return {
              id: item.id.toString(),
              title: item.title,
              author: "Unknown", 
              authorName: "Unknown", 
              created_date: item.created_date,
              updated_date: item.updated_date,
            };
          }
        })
      );
      setComments(formattedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [articleId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);
  

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionToken) {
      alert("Bạn cần đăng nhập để gửi bình luận.");
      router.push("/login");
      return;
    }
  
    if (!newComment.trim() ) {
      alert("Cả trường bình luận và tác giả đều cần được điền.");
      return;
    }
  
    try {
      const payload = { 
        title: newComment,
        author: decoded.user_id, 
        article: articleId
      };
      console.log(payload);
      
      const response = await fetch(
        `http://127.0.0.1:8000/api/comments/articles/${articleId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify(payload),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        if (response.status === 401) {
          alert("Token không hợp lệ hoặc hết hạn. Vui lòng đăng nhập lại.");
          router.push("/login");
        } else {
          alert("Có lỗi xảy ra khi gửi bình luận.");
        }
        return;
      }
  
      success("Bình luận đã được đăng thành công.");
      setNewComment(""); 
      fetchComments(); 
    } catch (error) {
      error("Có lỗi xảy ra khi gửi bình luận.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!sessionToken) {
      alert("You need to login first.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/comments/${commentId}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${sessionToken}` },
        }
      );

      if (response.ok) {
        setComments((prev) => prev.filter((comment) => comment.id !== commentId));
        success("Comment deleted successfully!");
      } else {
        error("Failed to delete comment.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      error("An error occurred while deleting the comment.");
    }
  };

  const handleEditComment = (commentId: string, title: string) => {
    setEditingCommentId(commentId);
    setEditedComment(title);
  };
  
  const handleUpdateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionToken) {
      alert("Bạn cần đăng nhập để sửa bình luận.");
      return;
    }
    
    if (!editedComment.trim()) {
      error("Comment cannot be empty.");
      return;
    }

      const currentComment = comments.find((comment) => comment.id === editingCommentId);

      if (!currentComment) {
        error("Comment not found.");
        return;
      }

      const updatedComment = {
        title: editedComment,
        author: decoded.user_id,  
        article: articleId, 
      };
      
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/comments/${editingCommentId}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionToken}`,
            },
            body: JSON.stringify(updatedComment),
          }
        );
    
        if (!response.ok) {
          const data = await response.json();
          console.error("Failed to update comment:", data);
          error(data?.message || "Failed to update comment.");
          return;
        }
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === editingCommentId
              ? { ...comment, title: editedComment }
              : comment
          )
        );
        setEditingCommentId(null);
        setEditedComment("");
        success("Comment updated successfully!");
    
      } catch (error) {
      console.error("An error occurred:", error);
      error("An error occurred while updating the comment.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bình Luận</h2>
      <div className="flex">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-grow w-64 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Viết bình luận..."
        />
        <button
          onClick={handleCommentSubmit}
          className="ml-4 px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500"
        >
          Gửi Bình Luận
        </button>
      </div>
      <div className="mt-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border-b py-2 flex justify-between items-center">
              {editingCommentId === comment.id ? (
                <div>
                  <textarea
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <button onClick={handleUpdateComment} className="text-blue-500 mt-2">
                    Cập Nhật
                  </button>
                  <button onClick={() => setEditingCommentId(null)} className="text-gray-500 ml-2">
                    Hủy
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-700">{comment.title}</p>
                  <p className="text-sm text-gray-500">
                    Tác giả: {comment.authorName} 
                    {/* | Ngày: {new Date(comment.created_date).toLocaleString()} */}
                  </p>
                </div>
              )}
              <Dropdown
                menu={{
                  items: [
                    { key: "edit", label: "Sửa", onClick: () => handleEditComment(comment.id, comment.title) },
                    { key: "delete", label: "Xóa", onClick: () => handleDeleteComment(comment.id) },
                  ],
                }}
                trigger={["click"]}
              >
                <MoreOutlined className="cursor-pointer text-gray-500" />
              </Dropdown>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Chưa có bình luận nào.</p>
        )}
      </div>
    </div>
  );
};

export default CommentedForm;
