import React from "react";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { useHref, useNavigate, Routes, Route } from "react-router";
import { SWRConfig } from "swr";
import { NavBar } from "./components/NavBar";
import { TopBar } from "./components/TopBar";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { TopBarTabProvider } from "./contexts/TopBarTabContext";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { CreateProfilePage } from "./pages/CreateProfilePage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { createAuthFetcher } from "./lib/dataFetch";

// SWRConfig wrapper that has access to AuthContext
function SWRConfigWithAuth({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();

  return (
    <SWRConfig
      value={{
        fetcher: createAuthFetcher(() => token),
      }}
    >
      {children}
    </SWRConfig>
  );
}

function AppContent() {
  const navigate = useNavigate();

  return (
    <SWRConfigWithAuth>
      <HeroUIProvider
        className="h-screen w-screen overflow-hidden"
        navigate={navigate}
        useHref={useHref}
      >
        <ToastProvider placement="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/create-profile"
            element={
              <ProtectedRoute>
                <CreateProfilePage />
              </ProtectedRoute>
            }
          />
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
    </SWRConfigWithAuth>
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
