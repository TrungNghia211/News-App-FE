export interface Subcategory {
    id: number;
    sub: string;
    description: string;
    category: number;
}

export interface Category {
    id: number;
    name: string;
    description: string;
    created_date: string;
    updated_date: string;
    subcategories: Subcategory[];
}

