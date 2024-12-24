import Header from "./components/Header";
import MenuComponent from "./components/Menu/page";
import Homepage from "./components/Homepage/page";

export default function Home() {
  return (
    <div>
      <Header />
      <MenuComponent />
      <Homepage />
    </div>
  );
}
