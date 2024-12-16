"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";

interface Comment {
  id: string;
  content: string;
  userName: string;
  createdDate: string;
}

interface CommentedFormProps {
  articleId: string;
}

const CommentedForm: React.FC<CommentedFormProps> = ({ articleId }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedComment, setEditedComment] = useState("");
  // const router = useRouter();

  const fetchComments = useCallback(async () => {
    if (!articleId) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/comments/articles/${articleId}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setComments(data);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  }, [articleId]);

  useEffect(() => {
    fetchComments();
  }, [articleId, fetchComments]);

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newComment.trim()) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user?.uid) {
        const payload = {
          article: articleId,
          content: newComment,
          userName: user.displayName || "Anonymous",
        };

        try {
          const response = await fetch("http://127.0.0.1:8000/api/comments/articles", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          const result = await response.json();
          if (response.ok) {
            alert("Comment posted successfully!");
            setNewComment("");
            fetchComments();
          } else {
            alert("Error posting comment: " + result.message);
          }
        } catch (err) {
          alert("Error posting comment.");
        }
      } else {
        alert("Please log in to post a comment.");
        router.push("/login");
      }
    } else {
      alert("Comment cannot be empty.");
    }
  };

  // Update an existing comment
  const handleUpdateComment = async () => {
    if (editingCommentId) {
      const payload = { content: editedComment };
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/comments/${editingCommentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (response.ok) {
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === editingCommentId ? { ...comment, content: result.content } : comment
            )
          );
          alert("Comment updated successfully!");
          setEditingCommentId(null);
        } else {
          alert("Error updating comment.");
        }
      } catch (err) {
        alert("Error updating comment.");
      }
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/comments/${commentId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
        alert("Comment deleted successfully!");
      } else {
        alert("Error deleting comment.");
      }
    } catch (err) {
      alert("Error deleting comment.");
    }
  };

  // Render menu items for comment actions
  const renderMenuItems = (comment: Comment) => [
    {
      key: "edit",
      label: "Edit",
      onClick: () => handleEditComment(comment.id, comment.content),
    },
    {
      key: "delete",
      label: "Delete",
      onClick: () => handleDeleteComment(comment.id),
    },
  ];

  const handleEditComment = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditedComment(content);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-red-300">Comments List</h2>
      <div className="flex">
        <textarea
          value={newComment}
          onChange={handleCommentChange}
          className="flex-grow w-full h-15 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Write a comment..."
        />
        <button
          onClick={handleCommentSubmit}
          className="ml-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 h-15"
        >
          Send Comment
        </button>
      </div>

      <div className="mt-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border-b py-2 flex justify-between items-center">
              {editingCommentId === comment.id ? (
                <div className="w-full">
                  <textarea
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <button
                    onClick={handleUpdateComment}
                    className="text-blue-500 mt-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setEditingCommentId(null)}
                    className="text-gray-500 ml-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex-grow">
                  <p className="text-gray-700">{comment.content}</p>
                  <p className="text-sm text-gray-500">
                    By: {comment.userName}
                  </p>
                </div>
              )}

              <Dropdown
                menu={{ items: renderMenuItems(comment) }}
                trigger={["click"]}
              >
                <MoreOutlined className="cursor-pointer text-gray-500" />
              </Dropdown>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default CommentedForm;
