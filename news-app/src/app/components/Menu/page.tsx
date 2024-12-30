'use client'

import React, { useState, useEffect } from "react";
import { MenuOutlined, CaretDownOutlined } from "@ant-design/icons";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import http from "@/lib/http";
import { ChevronDown, ChevronRight } from "lucide-react";


const MenuComponent = () => {

  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [hoveredCategoryMenu, setHoveredCategoryMenu] = useState<number | null>(null);
  const [hoveredCategoryIndex, setHoveredCategoryIndex] = useState<number | null>(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await http.get<any>("api/categories/");
        setCategories(response.payload);
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
    <div className="xl:flex xl:min-h-full max-w-screen w-screen xl:justify-center xl:h-[35px] xl:border-y-[2px]">
      <ul className="flex max-w-5xl items-center justify-between w-full space-x-4">
        <li className=" z-[1] flex items-center relative">
          <MenuOutlined
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="text-2xl text-gray-800 hover:text-green-400 cursor-pointer"
          />
          {isModalOpen && (
            <div className="absolute top-full left-1 mt-2 w-64 bg-white border border-gray-300 rounded shadow-lg p-1 z-1">
              <ul className="space-y-2 relative">
                {categories.map((category, index) => (
                  <li
                    key={category.id}
                    className="flex items-center hover:text-green-400 cursor-pointer relative"
                    onMouseEnter={() => setHoveredCategoryMenu(index)}
                    onMouseLeave={() => setHoveredCategoryMenu(null)}
                  >
                    <span className="flex items-center cursor-pointer">
                      <CaretDownOutlined className="mr-2" />
                      <a
                        href={`/${category.id}`}
                        className="hover:text-green-400 hover:cursor-pointer h-full"
                      >
                        {category.name}
                      </a>
                    </span>
                    {hoveredCategoryMenu === index && (
                      <ul className="absolute left-full top-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-md">
                        {(category.subcategories || []).map(
                          (subCategory: any, subIndex: any) => (
                            <li
                              key={subIndex}
                              className="p-2 text-sm text-gray-600 hover:underline cursor-pointer block"
                            >
                              {/* <Link href={`/${category.id}/${subCategory}`}>
                                {subCategory}
                              </Link> */}
                              <Link href="">
                                {subCategory}
                              </Link>
                            </li>
                          )
                        )}
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
            <a
              // href={`/${category.id}`}
              href=""
              onClick={(e) => handleCategoryClick(e, category.id)}
              className="hover:text-green-400 hover:cursor-pointer h-full"
            >
              {category.name}
            </a>
            {hoveredCategoryIndex === index && (
              <div className="absolute z-[1] min-w-[150px] bg-white border">
                {category.subcategories.map((subCategory) => (
                  <Link
                    key={subCategory}
                    href={`/${category.id}/${subCategory}`}
                    className="block hover:bg-gray-100 hover:underline hover:cursor-pointer text-left"
                  >
                    {subCategory}
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