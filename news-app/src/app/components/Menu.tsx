'use client'

import http from "@/lib/http";
import { Category, Subcategory } from "@/types/category";
import { CaretDownOutlined, MenuOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Menu() {

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [hoveredCategoryMenu, setHoveredCategoryMenu] = useState<number | null>(null);
    const [hoveredCategoryIndex, setHoveredCategoryIndex] = useState<number | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await http.get<any>("/api/categories/");
                setCategories(response.payload);
            } catch (error) {
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="flex items-center justify-center w-full h-[35px] border-b-2 xl:min-h-full">
            <ul className="flex max-w-5xl items-center justify-between w-full space-x-4 ">
                {categories.slice(0, 10).map((category, index) => (
                    <li
                        key={category.id}
                        className="relative h-full leading-loose text-center inline-block whitespace-nowrap"
                        onMouseEnter={() => setHoveredCategoryIndex(index)}
                        onMouseLeave={() => setHoveredCategoryIndex(null)}
                    >
                        <a
                            href={`/category/${category.id}`}
                            // onClick={(e) => handleCategoryClick(e, category.id)}
                            className="hover:text-green-400 hover:cursor-pointer h-full"
                        >
                            {category.name}
                        </a>
                        {hoveredCategoryIndex === index && (
                            <div className="absolute z-[1] min-w-[150px] bg-white border rounded-lg">
                                {category.subcategories.map((subCategory: Subcategory) => (
                                    <Link
                                        key={subCategory.id}
                                        href={`/category/subcategory/${subCategory.id}`}
                                        className="block hover:bg-gray-100 hover:underline hover:cursor-pointer text-left"
                                    >
                                        {subCategory.sub}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </li>
                ))}

                <li className="z-[1] flex items-center relative">
                    <MenuOutlined
                        onClick={() => setIsModalOpen(!isModalOpen)}
                        className="text-2xl text-gray-800 hover:text-green-400 cursor-pointer"
                    />
                    {isModalOpen && (
                        <div className="absolute top-full right-1 mt-2 w-64 bg-white border border-gray-300 rounded shadow-lg p-1 z-1">
                            <ul className="space-y-2">
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
                                                href={`/category/${category.id}`}
                                                className="hover:text-green-400 hover:cursor-pointer h-full"
                                            >
                                                {category.name}
                                            </a>
                                        </span>
                                        {hoveredCategoryMenu === index && (
                                            <ul className="absolute right-[250px] top-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-md">
                                                {(category.subcategories || []).map(
                                                    (subCategory, subIndex) => (
                                                        <li
                                                            key={subCategory.id}
                                                            className="p-2 text-sm text-gray-600 hover:underline cursor-pointer block"
                                                        >
                                                            <Link href={`/category/subcategory/${subCategory.id}`}>
                                                                {subCategory.sub}
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

            </ul>
        </div>
    )
}
