import CategoryManager from "@/app/components/AdminCategory/CategoryManager";

export default function Category() {
  return (
    <main className="container mx-auto py-3 px-[300px]">
      <h1 className="text-3xl font-bold mb-2">Quản lý danh mục</h1>
      <CategoryManager />
    </main>
  );
}
