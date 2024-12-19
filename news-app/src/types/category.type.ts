interface ISubcategory {
    name: string;
}

interface ICategory {
    id: number;
    name: string;
    description: string;
    subcategory: ISubcategory[];
}