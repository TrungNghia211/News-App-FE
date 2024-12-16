"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Header from "../../../../../components/Header/page";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  sub: string;
}

interface User {
  id: number;
  name: string;
}

const ArticlesAdd = () => {
  const [fetchedCategories, setFetchedCategories] = useState<Category[]>([]);
  const [fetchedSubCategories, setFetchedSubCategories] = useState<SubCategory[]>([]);
  const [title, setTitle] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [category, setCategory] = useState<Category | null>(null);
  const [subCategory, setSubCategory] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [imageSource, setImageSource] = useState<string>("file");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user"); 
        const userData: User = await res.json();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/categories");
        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categories: Category[] = await res.json();
        setFetchedCategories(categories);
        if (categories.length > 0) {
          setCategory(categories[0]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (category) {
      const fetchSubCategories = async () => {
        try {
          const res = await fetch(`/api/subcategories/category/${category.id}`);
          if (!res.ok) {
            throw new Error("Failed to fetch subcategories");
          }
          const subcategories: SubCategory[] = await res.json();
          setFetchedSubCategories(subcategories);
        } catch (error) {
          console.error("Failed to fetch subcategories:", error);
        }
      };
      fetchSubCategories();
    }
  }, [category]);

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: title,
        imageUrl: file
          ? await uploadImageToFirebase(file)
              .then((url) => url)
              .catch(() => "")
          : imageUrl,
        content: content,
        category: category?.name || "",
        subCategory: subCategory === "None" ? "" : subCategory,
        authorId: user?.id || 0, 
      };

      console.log("Payload:", payload);
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/articles");
      } else {
        throw new Error("Failed to add article");
      }
    } catch (error) {
      console.error("Failed to add article:", error);
    }
  };

  const handleClose = () => {
    router.push("/admin/articles");
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Article</h2>
        <form onSubmit={handleAddArticle} className="space-y-4">
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
                onChange={(e) => setImageSource(e.target.value)}
              />
              <label htmlFor="fileUpload" className="ml-2">
                Choose File
              </label>

              <input
                type="radio"
                id="urlUpload"
                name="imageSource"
                value="url"
                checked={imageSource === "url"}
                onChange={(e) => setImageSource(e.target.value)}
                className="ml-4"
              />
              <label htmlFor="urlUpload" className="ml-2">
                Enter URL
              </label>
            </div>

            {imageSource === "file" ? (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImageUrl(reader.result as string);
                    };
                    reader.readAsDataURL(file);
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
              <img
                src={imageUrl}
                alt="Uploaded"
                className="mt-2"
                style={{ width: "100px" }}
              />
            )}
          </div>

          <div>
            <label className="block mb-2">Select Category:</label>
            <select
              value={category ? category.name : ""}
              onChange={(e) => {
                const selectedCategory = fetchedCategories.find(
                  (el) => el.name === e.target.value
                );
                setCategory(selectedCategory || null);
              }}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              {fetchedCategories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Select Subcategory:</label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              {fetchedSubCategories.length > 0 ? (
                fetchedSubCategories.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.sub}>
                    {subCategory.sub}
                  </option>
                ))
              ) : (
                <option disabled>No subcategories available</option>
              )}
            </select>
          </div>

          <div>
            <label className="block mb-2">Content:</label>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              style={{ height: "300px" }}
            />
          </div>

          <div className="flex flex-col items-end mt-10 space-y-2">
            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                className="bg-yellow-400 text-white py-2 px-4 rounded"
              >
                Add Article
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
    </>
  );
};

export default ArticlesAdd;
