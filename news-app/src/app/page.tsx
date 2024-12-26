import Header from "./components/Header";
import Homepage from "./components/Homepage/page";
import Menu from "@/app/components/Menu";

export default function Home() {
  return (
    <div>
      <Header />
      <Menu />
      <Homepage />
    </div>
  );
}
