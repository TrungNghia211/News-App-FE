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
    // <div className="max-w-screen-xl mx-auto flex items-center">
    //   <ul className="flex items-center w-full space-x-4 xl:flex-row xl:space-x-8 xl:flex">
    //     <li className="z-[1] flex items-center relative">
    //       <MenuOutlined
    //         onClick={() => setIsModalOpen(!isModalOpen)}
    //         className="text-3xl text-gray-800 hover:text-green-400 cursor-pointer transition-all duration-300"
    //       />
    //       {isModalOpen && (
    //         <div className="absolute top-full left-1 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-10 transition-all transform ease-out">
    //           <ul className="space-y-2">
    //             {categories.map((category, index) => (
    //               <li
    //                 key={category.id}
    //                 className="flex items-center hover:text-green-400 cursor-pointer relative group"
    //                 onMouseEnter={() => setHoveredCategoryMenu(index)}
    //                 onMouseLeave={() => setHoveredCategoryMenu(null)}
    //               >
    //                 <span className="flex items-center cursor-pointer">
    //                   <CaretDownOutlined className="mr-2 transition-all duration-300 group-hover:rotate-180" />
    //                   <Link
    //                     href={`/category/${category.id}`}
    //                     className="hover:text-green-400 text-xl font-normal transition-all duration-300"
    //                   >
    //                     {category.name}
    //                   </Link>
    //                 </span>
    //                 {hoveredCategoryMenu === index && category.children && (
    //                   <ul className="absolute left-full top-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-md transition-all transform ease-out opacity-0 group-hover:opacity-100">
    //                     {category.children.map((subCategory) => (
    //                       <li
    //                         key={subCategory.id}
    //                         className="p-2 text-sm text-gray-600 hover:bg-gray-200 hover:underline cursor-pointer"
    //                       >
    //                         <Link
    //                           href={`/category/${category.id}/subcategory/${subCategory.id}`}
    //                           className="block"
    //                         >
    //                           {subCategory.name}
    //                         </Link>
    //                       </li>
    //                     ))}
    //                   </ul>
    //                 )}
    //               </li>
    //             ))}
    //           </ul>
    //         </div>
    //       )}
    //     </li>
    //     {categories.slice(0, 10).map((category, index) => (
    //       <li
    //         key={category.id}
    //         className="relative h-full leading-loose text-center inline-block whitespace-nowrap"
    //         onMouseEnter={() => setHoveredCategoryIndex(index)}
    //         onMouseLeave={() => setHoveredCategoryIndex(null)}
    //       >
    //         <Link
    //           href={`/${category.id}`}
    //           onClick={(e) => handleCategoryClick(e, category.id)}
    //           className="hover:text-green-400 hover:cursor-pointer h-full no-underline text-xl font-normal transition-all duration-300"
    //         >
    //           {category.name}
    //         </Link>
    //         {hoveredCategoryIndex === index && category.children && (
    //           <div className="absolute z-[1] min-w-[150px] bg-white border border-gray-300 rounded-lg shadow-md mt-2 transition-all ease-in-out opacity-0 hover:opacity-100">
    //             {category.children.map((subCategory) => (
    //               <Link
    //                 key={subCategory.id}
    //                 href={`/${category.id}/${subCategory.id}`}
    //                 className="block p-2 text-sm text-gray-600 hover:bg-gray-200 hover:underline hover:cursor-pointer"
    //               >
    //                 {subCategory.name}
    //               </Link>
    //             ))}
    //           </div>
    //         )}
    //       </li>
    //     ))}
    //   </ul>
    // </div>

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