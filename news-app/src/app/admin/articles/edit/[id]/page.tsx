"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import Header from "../../../../components/Header";
import "react-quill/dist/quill.snow.css";
import useCustomToast from "../../../../../../utils/toast";
import { apiFetch } from "../../../../../../utils/api";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface Category {
  id: number;
  name: string;
  children: SubCategory[];
}

interface SubCategory {
  id: number;
  sub: string;
}

interface Article {
  id: number;
  title: string;
  image_url: string;
  image_file: string;
  category_id: number;
  subcategory_id: number;
  content: string;
  author: string;
}

const ArticlesEdit: React.FC = () => {
  const router = useRouter();
  const { id: articleId } = useParams();
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageSource, setImageSource] = useState<string>("url");
  const [category, setCategory] = useState<number>(0);
  const [categoryValue, setCategoryValue] = useState<string>("");
  const [subCategory, setSubCategory] = useState<number>(0);
  const [content, setContent] = useState<string>("");
  const [fetchedCategories, setFetchedCategories] = useState<Category[]>([]);
  const [subOptions, setSubOptions] = useState<SubCategory[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const { success, error } = useCustomToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articleData: Article = await apiFetch(`/api/articles/${articleId}/`);
        setArticle(articleData);
        setTitle(articleData.title);
        setImageUrl(articleData.image_url);
        setImageSource(articleData.image_file);
        setCategory(articleData.category_id);
        setSubCategory(articleData.subcategory_id);
        setContent(articleData.content);

        const categoriesData: Category[] = await apiFetch("/api/categories/");
        setFetchedCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [articleId]);

  useEffect(() => {
    if (category) {
      const selectedCategory = fetchedCategories.find((cat) => cat.id === category);
      if (selectedCategory) {
        setCategoryValue(selectedCategory.name);
        setSubCategory(0);
        fetchSubCategories(selectedCategory.id);
      }
    }
  }, [category, fetchedCategories]);

  const fetchSubCategories = async (categoryId: number) => {
    try {
      const subCategories: SubCategory[] = await apiFetch(`/api/subcategories/category/${categoryId}/`);
      setSubOptions(subCategories);
    } catch (err) {
      console.error("Failed to fetch subcategories:", err);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload/", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "X-CSRFTOKEN": process.env.CSRF_TOKEN || "" 
        },
        body: formData
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
  
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Upload to Cloudinary failed:", error);
      throw error;
    }
  };

  const handleEditArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedArticle = {
      title: title || "Untitled Article",
      image_url: file ? await uploadToCloudinary(file) : imageUrl,
      content: content || "<p>No content available</p>",
      author: article?.author || "Unknown",
      active: true,
      category_id: category || 0,
      subcategory_id: subCategory || 1,
    };

    try {
      const res = await apiFetch(`/api/articles/${articleId}/`, "PUT", updatedArticle);
      if (res) {
        success("Article updated successfully!");
        router.push("/admin/articles");
      } else {
        throw new Error("Failed to update article");
      }
    } catch (error) {
      console.error("Error updating article:", error);
      error("Failed to update article!");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = fetchedCategories.find((cat) => cat.name === e.target.value);
    if (selectedCategory) {
      setCategory(selectedCategory.id);
    }
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSubCategory = subOptions.find((sub) => sub.sub === e.target.value);
    if (selectedSubCategory) {
      setSubCategory(selectedSubCategory.id);
    }
  };

  const handleClose = () => {
    router.push("/admin/articles");
  };

  return (
    <div>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Article</h2>
        <form onSubmit={handleEditArticle} className="space-y-4">
          <div>
            <label className="block mb-2">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter article title"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Upload Image:</label>
            <div className="flex items-center mb-4">
              <input
                type="radio"
                id="fileUpload"
                name="imageSource"
                value="file"
                checked={imageSource === "file"}
                onChange={(e) => {
                  setImageSource(e.target.value);
                  setImageUrl("");
                }}
              />
              <label htmlFor="fileUpload" className="ml-2">Choose File</label>

              <input
                type="radio"
                id="urlUpload"
                name="imageSource"
                value="url"
                checked={imageSource === "url"}
                onChange={(e) => {
                  setImageSource(e.target.value);
                  setImageUrl("");
                }}
                className="ml-4"
              />
              <label htmlFor="urlUpload" className="ml-2">Enter URL</label>
            </div>

            {imageSource === "file" ? (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFile(file);
                    const reader = new FileReader();
                    reader.onloadend = () => setImageUrl(reader.result as string);
                    reader.readAsDataURL(file);
                  } else {
                    setImageUrl("");
                  }
                }}
              />
            ) : (
              <input
                type="text"
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter image URL"
              />
            )}

            {imageUrl && (
              <div className="mt-2">
                <p>Image Preview:</p>
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="mt-2"
                  style={{ width: "100px" }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block mb-2">Select Category:</label>
            <select
              value={categoryValue}
              onChange={handleCategoryChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              {fetchedCategories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Select Subcategory:</label>
            <select
              value={subCategory}
              onChange={handleSubCategoryChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {subOptions.length > 0 && subOptions.map((sub) => (
                <option key={sub.id} value={sub.sub}>{sub.sub}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Content:</label>
            <ReactQuill
              style={{ height: "300px" }}
              value={content}
              onChange={setContent}
            />
          </div>

          <div className="flex flex-col items-end mt-10 space-y-2">
            <button className=" py-2 px-4 rounded"></button>
            <button className=" py-2 px-4 rounded"></button>
            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                className="bg-yellow-400 text-white py-2 px-4 rounded"
              >
                Update Article
              </button>
              <button
                type="button"
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticlesEdit;
