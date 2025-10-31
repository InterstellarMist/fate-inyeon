import { HeroUIProvider } from "@heroui/react";
import { useHref, useNavigate, Routes, Route } from "react-router";
import { NavBar } from "./components/NavBar";
import { TopBar } from "./components/TopBar";
import { AuthProvider } from "./contexts/AuthContext";
import { TopBarTabProvider } from "./contexts/TopBarTabContext";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function AppContent() {
  const navigate = useNavigate();

  return (
    <HeroUIProvider
      className="h-screen w-screen overflow-hidden"
      navigate={navigate}
      useHref={useHref}
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <TopBarTabProvider>
                <div className="flex flex-col h-full">
                  <TopBar />
                  <NavBar />
                </div>
              </TopBarTabProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </HeroUIProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
