"use client";

import React, { useState, useEffect } from "react";
import { MenuOutlined, CaretDownOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SubCategory {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  children?: SubCategory[];
}

const MenuComponent: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [hoveredCategoryMenu, setHoveredCategoryMenu] = useState<number | null>(null);
  const [hoveredCategoryIndex, setHoveredCategoryIndex] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/categories/");
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (err) {
        console.log("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement>, categoryId: number) => {
    e.preventDefault();
    router.push(`/category/${categoryId}`);
  };

  return (
    <div className="max-w-screen-xl mx-auto flex items-center">
      <ul className="flex items-center w-full space-x-4 xl:flex-row xl:space-x-8 xl:flex">
        <li className="z-[1] flex items-center relative">
          <MenuOutlined
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="text-3xl text-gray-800 hover:text-green-400 cursor-pointer transition-all duration-300"
          />
          {isModalOpen && (
            <div className="absolute top-full left-1 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-10 transition-all transform ease-out">
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li
                    key={category.id}
                    className="flex items-center hover:text-green-400 cursor-pointer relative group"
                    onMouseEnter={() => setHoveredCategoryMenu(index)}
                    onMouseLeave={() => setHoveredCategoryMenu(null)}
                  >
                    <span className="flex items-center cursor-pointer">
                      <CaretDownOutlined className="mr-2 transition-all duration-300 group-hover:rotate-180" />
                      <Link
                        href={`/${category.id}`}
                        className="hover:text-green-400 text-xl font-normal transition-all duration-300"
                      >
                        {category.name}
                      </Link>
                    </span>
                    {hoveredCategoryMenu === index && category.children && (
                      <ul className="absolute left-full top-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-md transition-all transform ease-out opacity-0 group-hover:opacity-100">
                        {category.children.map((subCategory) => (
                          <li
                            key={subCategory.id}
                            className="p-2 text-sm text-gray-600 hover:bg-gray-200 hover:underline cursor-pointer"
                          >
                            <Link
                              href={`/category/${category.id}/subcategory/${subCategory.id}`}
                              className="block"
                            >
                              {subCategory.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
        {categories.slice(0, 10).map((category, index) => (
          <li
            key={category.id}
            className="relative h-full leading-loose text-center inline-block whitespace-nowrap"
            onMouseEnter={() => setHoveredCategoryIndex(index)}
            onMouseLeave={() => setHoveredCategoryIndex(null)}
          >
            <Link
              href={`/${category.id}`}
              onClick={(e) => handleCategoryClick(e, category.id)}
              className="hover:text-green-400 hover:cursor-pointer h-full no-underline text-xl font-normal transition-all duration-300"
            >
              {category.name}
            </Link>
            {hoveredCategoryIndex === index && category.children && (
              <div className="absolute z-[1] min-w-[150px] bg-white border border-gray-300 rounded-lg shadow-md mt-2 transition-all ease-in-out opacity-0 hover:opacity-100">
                {category.children.map((subCategory) => (
                  <Link
                    key={subCategory.id}
                    href={`/${category.id}/${subCategory.id}`}
                    className="block p-2 text-sm text-gray-600 hover:bg-gray-200 hover:underline hover:cursor-pointer"
                  >
                    {subCategory.name}
                  </Link>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuComponent;