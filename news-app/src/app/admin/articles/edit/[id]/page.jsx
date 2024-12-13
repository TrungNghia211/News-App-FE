"use client";
import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import Header from "../../../../../../components/Header/page";
import { apiFetch } from "../../../../../../utils/api";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const ArticlesEdit = () => {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id;
  const [article, setArticle] = useState(null);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageSource, setImageSource] = useState("url");
  const [category, setCategory] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [subsubcategoryValue, setSubSubCategoryValue] = useState("");
  const [subCategoryValue, setSubCategoryValue] = useState("");
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [fetchedSubcategories, setFetchedSubcategories] = useState([]);
  const [subCategory, setSubCategory] = useState("None");
  const [content, setContent] = useState("");
  const [subOptions, setSubOptions] = useState([]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await apiFetch(`/api/articles/${articleId}`, "GET");
        console.log("res", res);

        const articleData = res;
        setArticle(articleData);
        setTitle(articleData.title);
        setImageUrl(articleData.image_url);
        setImageSource(articleData.image_file);
        setCategory(articleData.category_id);
        setSubCategory(articleData.subcategory_id);
        setContent(articleData.content);
      } catch (error) {
        console.error("Failed to fetch article:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await apiFetch("/api/categories", "GET");
        setFetchedCategories(res);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchArticle();
    fetchCategories();
  }, [articleId]);
  const handleEditArticle = async (e) => {
    e.preventDefault();

    const updatedArticle = {
      title,
      imageUrl,
      category,
      subCategory,
      content,
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await apiFetch(
        `/api/articles/${articleId}/`,
        "PUT",
        updatedArticle
      );

      // router.push("/admin/articles");
      console.log(updatedArticle);
      console.log("Article updated successfully:", res);
    } catch (error) {}
  };
  useEffect(() => {
    if (fetchedCategories) {
      const check = fetchedCategories.filter((cat) => cat.id === category);
      setCategoryValue(check[0]?.name);
      apiFetch(`/api/subcategories/category/${check[0]?.id}`)
        .then((res) => {
          if (res) {
            const arrSub = res.map((cat) => cat.sub);
            setSubOptions(res);
          }
        })
        .catch((err) => {});
    }
  }, [category]);
  useEffect(() => {
    if (fetchedSubcategories) {
      const check = fetchedSubcategories.filter(
        (sub) => sub.id === subCategory
      );
    }
  }, [subCategory, fetchedSubcategories]);

  const handleCategoryChange = (e) => {
    const selectedCategory = fetchedCategories.find(
      (cat) => cat.name === e.target.value
    );

    if (selectedCategory) {
      setCategory(selectedCategory.id);
      setCategoryValue(selectedCategory.name);
    } else {
      setCategoryValue("");
    }
  };

  const handleSubCategoryChange = (e) => {
    const subCategoryOptions = fetchedCategories.find(
      (sub) => sub.name === e.target.value
    );
    if (subCategoryOptions) {
      setSubCategory(subCategoryOptions.id);
      setSubCategoryValue(subCategoryOptions.name);
    } else {
      setSubCategoryValue("");
    }
  };
  const handleClose = () => {
    router.push("/admin/articles");
  };
  const selectedCategoryData = useMemo(() => {
    return fetchedCategories.find((el) => el.name === category) || {};
  }, [category, fetchedCategories]);

  const subCategoryOptions = selectedCategoryData.children || [];
  return (
    <div>
      <Header />
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
                    reader.onloadend = () => setImageUrl(reader.result);
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
              value={categoryValue}
              onChange={handleCategoryChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              {(fetchedCategories || []).map((cat) => (
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
              {subOptions.length > 0 &&
                subOptions.map((sub) => (
                  <option key={sub.id} value={sub.sub}>
                    {sub.sub}
                  </option>
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
