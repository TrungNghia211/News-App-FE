import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { clientSessionToken } from "@/lib/http";
import useCustomToast from "../../../utils/toast";
import jwt from 'jsonwebtoken';
import { apiFetch } from "../../../utils/api";

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
      const response = await apiFetch(`/api/comments/articles/${articleId}/`);
      if (!Array.isArray(response)) {
        throw new Error("Invalid response format.");
      }
  
      const formattedComments = await Promise.all(
        response.map(async (item: any) => {
          try {
            const userResponse = await apiFetch(`/api/users/${item.author}/`);
            if (!userResponse) throw new Error("Failed to fetch user data.");
  
            return {
              id: item.id.toString(),
              title: item.title,
              author: userResponse.username || "Unknown", 
              authorName: userResponse.username || "Unknown", 
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
  
    if (!newComment.trim()) {
      alert("Cả trường bình luận và tác giả đều cần được điền.");
      return;
    }
  
    try {
      const payload = { 
        title: newComment,
        author: decoded.user_id, 
        article: articleId,
      };
      const response = await apiFetch(
        `/api/comments/articles/${articleId}/`,
        "POST",
        payload,
        sessionToken
      );
  
      success("Bình luận đã được đăng thành công.");
      setNewComment(""); 
      fetchComments(); 
  
    } catch (error) {
      error("Có lỗi xảy ra khi gửi bình luận.");
      console.error("Error during comment submission:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!sessionToken) {
      alert("You need to login first.");
      return;
    }
    try {
      const response = await apiFetch(
        `/api/comments/${commentId}/`,
        "DELETE",
        null,
        sessionToken
      );
  
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      success("Comment deleted successfully!");
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
      const response = await apiFetch(
        `/api/comments/${editingCommentId}/`,
        "PUT",
        updatedComment,
        sessionToken
      );
  
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
