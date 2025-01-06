import UserManagement from "@/app/components/UserManagents/page";

export default function Category() {
  return (
    <main className=" mx-auto py-3 px-[300px]">
      <h1 className="text-3xl font-bold mb-2">Quản lý người dùng</h1>
      <UserManagement/>
    </main>
  );
}
