import { Category, Subcategory } from "@/types/category";

export let categories: Category[] = [
    {
        id: 1,
        name: "Thể thao",
        description: "Thể thao trong nước và thế giới",
        created_date: "2024-12-02T06:51:52.546301Z",
        updated_date: "2024-12-02T06:51:52.552514Z",
        subcategories: [
            {
                id: 1,
                sub: "Bóng đá",
                description: "Thông tin về bóng đá",
                category: 1
            },
            {
                id: 2,
                sub: "Bóng rổ",
                description: "Thông tin về NBA và VBA",
                category: 1
            }
        ]
    },
    {
        id: 2,
        name: "Thời sự",
        description: "Tin tức thời sự nóng hổi",
        created_date: "2024-12-17T08:26:22.004425Z",
        updated_date: "2024-12-17T08:26:22.004425Z",
        subcategories: []
    }
];

export const addCategory = (category: Omit<Category, 'id' | 'created_date' | 'updated_date' | 'subcategories'>): Category => {
    const newCategory: Category = {
        ...category,
        id: Math.max(...categories.map(c => c.id), 0) + 1,
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
        subcategories: []
    };
    categories.push(newCategory);
    return newCategory;
};

export const updateCategory = (id: number, updates: Partial<Category>): Category | null => {
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
        categories[index] = { ...categories[index], ...updates, updated_date: new Date().toISOString() };
        return categories[index];
    }
    return null;
};

export const deleteCategory = (id: number): void => {
    categories = categories.filter(c => c.id !== id);
};

export const addSubcategory = (categoryId: number, subcategory: Omit<Subcategory, 'id'>): Subcategory | null => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
        const newSubcategory: Subcategory = {
            ...subcategory,
            id: Math.max(...category.subcategories.map(s => s.id), 0) + 1,
            category: categoryId
        };
        category.subcategories.push(newSubcategory);
        return newSubcategory;
    }
    return null;
};

export const updateSubcategory = (categoryId: number, subcategoryId: number, updates: Partial<Subcategory>): Subcategory | null => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
        const index = category.subcategories.findIndex(s => s.id === subcategoryId);
        if (index !== -1) {
            category.subcategories[index] = { ...category.subcategories[index], ...updates };
            return category.subcategories[index];
        }
    }
    return null;
};

export const deleteSubcategory = (categoryId: number, subcategoryId: number): void => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
        category.subcategories = category.subcategories.filter(s => s.id !== subcategoryId);
    }
};

