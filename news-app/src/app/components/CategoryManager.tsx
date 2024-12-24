'use client'

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import http from '@/lib/http';
import { Pagination } from '@/app/components/Pagination';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Category } from '@/types/category';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CategoryForm } from '@/app/components/CategoryForm';
import SearchBar from '@/app/components/SearchBar';
import useCustomToast from '../../../utils/toast';

const ITEMS_PER_PAGE = 6;

export default function CategoryManager() {

    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isEditingCategory, setIsEditingCategory] = useState<Category | null>(null);
    const [subcategoryErrors, setSubcategoryErrors] = useState<{ [key: number]: string | null }>({});
    const [newSubcategoryNames, setNewSubcategoryNames] = useState<{ [key: number]: string }>({});

    const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
    const { success, error } = useCustomToast();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await http.get<any>("/api/categories/");
                setCategories(response.payload);
            } catch (error) {
                console.log("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const paginatedCategories = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return categories.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [categories, currentPage]);


    const toggleCategory = (categoryId: number) => {
        setExpandedCategories(prev => prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]);
    };

    const handleDeleteCategory = async (id: number) => {
        const result = await http.delete<any>(`/api/categories/${id}/`);
        success("Categories đã được xóa thành công.");
        setCategories(categories.filter(c => c.id !== id));
        if (paginatedCategories.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleAddCategory = async (data: Pick<Category, 'name' | 'description'>) => {
        const body = {
            name: data.name,
            description: data.description,
        }
        const result = await http.post<any>('/api/categories/', JSON.stringify(body));
        const newCategory = result.payload;
        success("Categories đã được tạo thành công.");
        setCategories(prevCategories => [...prevCategories, newCategory]);
        setIsAddingCategory(false);
        const newTotalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
        setCurrentPage(newTotalPages);
    }

    const handleAddSubCategory = async (categoryId: number) => {
        if (newSubcategoryNames[categoryId].trim()) {
            try {
                const body = {
                    sub: newSubcategoryNames[categoryId].trim(),
                    category: categoryId,
                }
                const result = await http.post<any>('/api/subcategories/', JSON.stringify(body));
                if (result.status === 201) {
                    const newSubcategory = result.payload;
                    setCategories(categories.map(c =>
                        c.id === categoryId
                            ? { ...c, subcategories: [...c.subcategories, newSubcategory] }
                            : c
                    ));
                    success("Subcategories đã được tạo thành công.");
                    setNewSubcategoryNames(prev => ({ ...prev, [categoryId]: '' }));
                    setSubcategoryErrors(prev => ({ ...prev, [categoryId]: null }));
                }
            } catch (error) {
                error("Subcategories đã được tạo thất bại.");                
                setSubcategoryErrors(prev => ({
                    ...prev,
                    [categoryId]: `Tên "${newSubcategoryNames[categoryId]}" đã tồn tại`,
                }));
            }
        }
    }

    const handleEditCategory = async (data: Pick<Category, 'name' | 'description'>) => {
        const body = {
            name: data.name,
            description: data.description,
        }
        const result = await http.put<any>(`/api/categories/${isEditingCategory.id}/`, JSON.stringify(body));
        const updatedCategory = result.payload;
        success("Categories đã được cập nhật thành công.");
        setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
        setIsEditingCategory(null)
    }

    const handleDeleteSubcategory = async (categoryId: number, subcategoryId: number) => {
        const result = await http.delete<any>(`/api/subcategories/${subcategoryId}/`);
        setCategories(prevCategories => prevCategories.map(c =>
            c.id === categoryId
                ? { ...c, subcategories: c.subcategories.filter(s => s.id !== subcategoryId) }
                : c
        ));
        success("Subcategories đã xóa thành công.");

    }

    return (
        <>
            <div className="space-y-[15px]">
                <div className="flex items-center justify-between">
                    <Button
                        className='bg-[#3498db] hover:bg-[#2980b9] font-semibold'
                        onClick={() => setIsAddingCategory(true)}
                    >
                        Thêm danh mục mới
                    </Button>
                    <SearchBar />
                </div>
                {paginatedCategories.map(category => (
                    <Card key={category.id} className="overflow-hidden">

                        <CardHeader
                            className="cursor-pointer flex flex-row items-center justify-between"
                            onClick={() => toggleCategory(category.id)}
                        >
                            <CardTitle className='text-xl'>{category.name}</CardTitle>
                            <div className="flex items-center space-x-2">
                                <Button
                                    className='hover:bg-[#3498db]'
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsEditingCategory(category)
                                    }}
                                >
                                    <Edit size={20} />
                                </Button>
                                <Button
                                    className='hover:bg-[#3498db]'
                                    variant="ghost" size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteCategory(category.id);
                                    }}
                                >
                                    <Trash2 size={20} />
                                </Button>
                                {expandedCategories.includes(category.id) ? <ChevronUp /> : <ChevronDown />}
                            </div>
                        </CardHeader>

                        {expandedCategories.includes(category.id) && (
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Danh mục con:</h4>
                                    <div className="flex flex-wrap gap-2 box-border">
                                        {category.subcategories.map((subcategory: any) => (
                                            <Badge key={subcategory.id} variant="secondary" className="flex items-center space-x-1 font-normal text-[15px]">
                                                <span>{subcategory.sub}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-4 w-4 p-0"
                                                    onClick={() => handleDeleteSubcategory(category.id, subcategory.id)}
                                                >
                                                    <Trash2 size={11} />
                                                </Button>
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex-grow">
                                            <Input
                                                value={newSubcategoryNames[category.id] || ''}
                                                onChange={(e) => {
                                                    setNewSubcategoryNames(prev => ({ ...prev, [category.id]: e.target.value }))
                                                    setSubcategoryErrors(prev => ({ ...prev, [category.id]: null }));
                                                }}
                                                placeholder="Tên danh mục con mới"
                                                className={subcategoryErrors[category.id] ? "border-red-500" : ""}
                                            />
                                            {subcategoryErrors[category.id] && (
                                                <p className="text-red-500 text-sm mt-1">{subcategoryErrors[category.id]}</p>
                                            )}
                                        </div>
                                        <Button
                                            className='bg-[#3498db] hover:bg-[#2980b9]'
                                            onClick={() => handleAddSubCategory(category.id)}
                                        >
                                            <Plus size={20} />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        )}

                    </Card>
                ))}
                <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Thêm danh mục mới</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <CategoryForm onSubmit={handleAddCategory} />
                    </DialogContent>
                </Dialog>
                <Dialog open={!!isEditingCategory} onOpenChange={() => setIsEditingCategory(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        {isEditingCategory && (
                            <CategoryForm
                                onSubmit={handleEditCategory}
                                initialData={{ name: isEditingCategory.name, description: isEditingCategory.description }}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
            {categories.length > 6 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </>
    );
};

