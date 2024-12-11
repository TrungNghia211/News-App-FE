import Header from "../../components/Header/page";
import MenuComponent from "../../components/Menu/page";
import Homepage from "../../components/Homepage/page";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-w-[100px]">
      <Header />
      <MenuComponent />
      <Homepage />
    </div>
  );
}
