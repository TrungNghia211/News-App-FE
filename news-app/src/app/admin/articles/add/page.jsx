"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Header from "../../../../../components/Header/page";
import { apiFetch } from "../../../../../utils/api";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const ArticlesAdd = () => {
  const [fetchedCategories, setFetchedCategories] = useState([]); // Khởi tạo là mảng rỗng
  const [fetchedSubCategories, setFetchedSubCategories] = useState([]); // Lưu trữ các subcategories
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState(null); // Khởi tạo là null
  const [subCategory, setSubCategory] = useState("None");
  const [content, setContent] = useState("");
  const [imageSource, setImageSource] = useState("file");
  const router = useRouter();
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiFetch("/api/categories", "GET");
        const categories = res.data || []; // Đảm bảo là mảng
        setFetchedCategories(categories);
        if (categories.length > 0) {
          setCategory(categories[0]); // Chọn category mặc định nếu có
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Lấy subcategories khi category thay đổi
  useEffect(() => {
    if (category) {
      const fetchSubCategories = async () => {
        try {
          const res = await apiFetch(
            `/api/subcategories?category_id=${category.id}`,
            "GET"
          );
          const subcategories = res.data || [];
          setFetchedSubCategories(subcategories);
        } catch (error) {
          console.error("Failed to fetch subcategories:", error);
        }
      };
      fetchSubCategories();
    }
  }, [category]); // Chỉ gọi API khi category thay đổi

  const handleAddArticle = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: title,
        imageUrl: file
          ? await uploadImageToFirebase(file)
              .then((url) => {
                return url;
              })
              .catch()
          : imageUrl,
        content: content,
        category: category.name,
        subCategory: subCategory === "None" ? "" : subCategory,
        author: {
          id: user.uid,
          name: userData.username,
        },
      };
      const res = await apiFetch("/api/articles/new", "POST", payload);
      router.push("/admin/articles");
    } catch (error) {
      console.error("Failed to add article:", error);
    }
  };

  const handleClose = () => {
    router.push("/admin/articles");
  };

  const handleChangeImageSource = (e) => {
    if (e.target.value === "url") {
      setImageSource("url");
    } else {
      setImageSource("file");
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = fetchedCategories.find(
      (el) => el.name === e.target.value
    );
    setCategory(selectedCategory);
    setSubCategory("None"); // Reset subcategory khi thay đổi category
  };

  const handleSubCategoryChange = (e) => {
    setSubCategory(e.target.value);
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
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImageUrl(reader.result);
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
              onChange={handleCategoryChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              {fetchedCategories && fetchedCategories.length > 0 ? (
                fetchedCategories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option disabled>No categories available</option>
              )}
            </select>
          </div>

          <div>
            <label className="block mb-2">Select Subcategory:</label>
            <select
              value={subCategory}
              onChange={handleSubCategoryChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {fetchedSubCategories.length > 0 ? (
                fetchedSubCategories.map((subCategory) => (
                  <option key={subCategory.sub} value={subCategory.sub}>
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
