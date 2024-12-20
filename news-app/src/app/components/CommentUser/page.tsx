import React, { useState, useEffect } from "react";
import Link from "next/link";
import { clientSessionToken } from "@/lib/http";
import jwt from "jsonwebtoken";
interface Comment {
    id: string;
    title: string;
    article: string;
  }
  interface Article {
    id: string;
    title: string;
  }
  const CommentedList: React.FC = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const sessionToken = clientSessionToken.value;
    const decoded = jwt.decode(sessionToken);
    const userId = decoded?.user_id; 
  
    useEffect(() => {
      const fetchArticlesAndComments = async () => {
        if (!userId) {
          console.error("User ID is missing.");
          return;
        }
  
        try {
          const commentRes = await fetch(`http://127.0.0.1:8000/api/comments/user/${userId}/`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionToken}`,
            },
          });
  
          const commentData = await commentRes.json();
          setComments(commentData.comments);
          const articlePromises = commentData.comments.map((comment: Comment) =>
            fetch(`http://127.0.0.1:8000/api/articles/${comment.article}/`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionToken}`,
              },
            }).then((res) => res.json())
          );
          const articleResponses = await Promise.all(articlePromises);
        setArticles(articleResponses.map((response: any) => response));
  
        } catch (error) {
          console.error("Failed to fetch articles and comments:", error);
        }
      };
  
      if (userId) {
        fetchArticlesAndComments();
      }
    }, [userId, sessionToken]);
  return (
    <div className=" p-4 mb-4">
      <h3 className="text-3xl font-semibold mb-8">Commented Articles</h3>
      <ul className="list-disc pl-5">
        {comments.map((comment) => {
          const article = articles.find((art) => art.id === comment.article);

          return (
            <li key={comment.id} className="mb-4">
              {article ? (
                <Link href={`/articles/${article.id}`} passHref>
                  <div>
                    <p className="cursor-pointer font-bold text-black">
                      {article.title}
                    </p>
                    <h3 className="text-gray-600">Bình Luận: {comment.title}</h3>
                  </div>
                </Link>
              ) : (
                <div>
                  <h3 className="text-gray-600">Bình Luận: {comment.title}</h3>
                </div>
              )}
            </li>
          );
          
        })}
      </ul>
    </div>
  );
};

export default CommentedList;
