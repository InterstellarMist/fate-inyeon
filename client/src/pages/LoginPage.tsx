import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Input, Button, Card, CardBody } from "@heroui/react";
import { useAuth } from "../contexts/AuthContext";
import { WebsiteLogo } from "../components/TopBar";

export const LoginForm = ({
  handleSubmit,
  email,
  setEmail,
  password,
  setPassword,
  error,
  isLoading,
}: {
  handleSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  error: string;
  isLoading: boolean;
}) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        isRequired
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onValueChange={setEmail}
        variant="bordered"
      />
      <Input
        isRequired
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onValueChange={setPassword}
        variant="bordered"
      />

      {error && <div className="text-danger text-sm text-center">{error}</div>}

      <Button
        type="submit"
        color="primary"
        isLoading={isLoading}
        className="w-full"
      >
        Log In
      </Button>
    </form>
  );
};

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid credentials");
        setIsLoading(false);
        return;
      }

      if (data.token) {
        login(data.token);
        navigate("/");
      } else {
        setError("No token received from server");
        setIsLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-screen p-4">
      <WebsiteLogo isStatic className="mt-24" />
      <div className="flex flex-col items-center justify-center h-full w-screen p-4">
        <Card className="w-full max-w-md mb-12">
          <CardBody className="p-6 gap-4">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold">Log In</h1>
              <p className="text-sm text-default-500 mt-1">
                Welcome back! Please sign in to your account
              </p>
            </div>

            <LoginForm
              handleSubmit={handleSubmit}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              error={error}
              isLoading={isLoading}
            />

            <div className="text-center text-sm mt-4">
              <span className="text-default-500">Don't have an account? </span>
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
