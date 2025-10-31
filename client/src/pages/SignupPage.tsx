import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Button, Card, CardBody, Input } from "@heroui/react";
import { useAuth } from "../contexts/AuthContext";
import { WebsiteLogo } from "../components/TopBar";

export const SignupForm = ({
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
        pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
        description="Please enter a valid email address"
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onValueChange={setEmail}
        variant="bordered"
      />
      <Input
        isRequired
        minLength={8}
        label="Password"
        type="password"
        placeholder="Enter your password"
        description={"Password must be at least 8 characters long"}
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
        Sign Up
      </Button>
    </form>
  );
};

export const SignupPage = () => {
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
      const response = await fetch(`${API_URL}/api/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account");
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
    } catch (err) {
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
              <h1 className="text-2xl font-bold">Sign Up</h1>
              <p className="text-sm text-default-500 mt-1">
                Create your account to get started
              </p>
            </div>

            <SignupForm
              handleSubmit={handleSubmit}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              error={error}
              isLoading={isLoading}
            />

            <div className="text-center text-sm mt-4">
              <span className="text-default-500">
                Already have an account?{" "}
              </span>
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
