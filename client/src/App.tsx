import { HeroUIProvider } from "@heroui/react";
// import { useState, useEffect } from "react";
import { useHref, useNavigate } from "react-router";
import { NavBar } from "./components/NavBar";
import { TopBar } from "./components/TopBar";

function App() {
  const navigate = useNavigate();
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   fetch(`${import.meta.env.VITE_API_URL}/api/hello`)
  //     .then((response) => response.json())
  //     .then((data) => setMessage(JSON.stringify(data)))
  //     .catch((error) => console.error("Error:", error));
  // }, []);

  return (
    <HeroUIProvider
      className="h-screen w-screen overflow-hidden"
      navigate={navigate}
      useHref={useHref}
    >
      <div className="flex flex-col h-full">
        <TopBar />
        <NavBar />
      </div>
    </HeroUIProvider>
  );
}

export default App;
