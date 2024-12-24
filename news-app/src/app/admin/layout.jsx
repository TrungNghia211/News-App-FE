import Header from "../components/Header";

export default function AdminLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

