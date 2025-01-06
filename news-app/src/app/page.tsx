import Header from "./components/Header";
import Homepage from "./components/Homepage/page";
import Menu from "@/app/components/Menu";

export default function Home() {
  return (
    <div className="mx-auto py-3 px-[300px]">
      <Header />
      <Menu />
      <Homepage />
    </div>
  );
}
