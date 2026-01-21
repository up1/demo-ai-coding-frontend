import { useState, useCallback, type FormEvent, type ChangeEvent } from "react";

// Types for form state and API response (rerender-derived-state)
interface FormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
}

interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

interface UserInfo {
  firstName: string;
  lastName: string;
}

// Validation rules as constants (js-hoist-regexp)
const USERNAME_REGEX = /^[A-Za-z]+$/;
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 10;

// Validation function (rerender-functional-setstate)
function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  // Username validation
  if (!data.username) {
    errors.username = "Username is required";
  } else if (data.username.length < USERNAME_MIN_LENGTH || data.username.length > USERNAME_MAX_LENGTH) {
    errors.username = `Username must be ${USERNAME_MIN_LENGTH}-${USERNAME_MAX_LENGTH} characters`;
  } else if (!USERNAME_REGEX.test(data.username)) {
    errors.username = "Username must contain only A-Z and a-z";
  }

  // Password validation
  if (!data.password) {
    errors.password = "Password is required";
  }

  return errors;
}

// SVG Icons as components (rendering-hoist-jsx)
const UserIcon = () => (
  <svg
    className="w-5 h-5 text-white/70"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const LockIcon = () => (
  <svg
    className="w-5 h-5 text-white/70"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const CartIcon = () => (
  <svg
    className="w-24 h-24 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      d="M12 6v4m0 0l2-2m-2 2l-2-2"
    />
  </svg>
);

export default function LoginPage() {
  // State management with proper typing (rerender-lazy-state-init)
  const [formData, setFormData] = useState<FormData>(() => ({
    username: "",
    password: "",
  }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Derived state for form validity (rerender-derived-state)
  const hasErrors = Object.keys(errors).length > 0;

  // Memoized handlers (rerender-functional-setstate)
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    setErrors((prev) => {
      if (prev[name as keyof FormErrors]) {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      }
      return prev;
    });
    setSubmitError("");
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Step 3: Client side validation
      const validationErrors = validateForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setSubmitError("Error na !!");
        return;
      }

      setIsLoading(true);
      setSubmitError("");

      try {
        // Step 4: Call Login API
        const response = await fetch("https://dummyjson.com/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          // Step 4.1: API failure
          setSubmitError("Error again !!");
          return;
        }

        // Step 4.2: API success - show firstname and lastname
        const data: LoginResponse = await response.json();
        setUserInfo({
          firstName: data.firstName,
          lastName: data.lastName,
        });
      } catch {
        // Network or other error
        setSubmitError("Error again !!");
      } finally {
        setIsLoading(false);
      }
    },
    [formData]
  );

  // If logged in successfully, show user info
  if (userInfo) {
    return (
      <div className="min-h-screen bg-[#2148c0] flex items-center justify-center p-4">
        <div className="text-center text-white">
          <div className="mb-8 flex justify-center">
            <CartIcon />
          </div>
          <h1 className="text-2xl font-semibold mb-4">Welcome!</h1>
          <p className="text-xl" data-testid="user-fullname">
            {userInfo.firstName} {userInfo.lastName}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2148c0] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 w-96 h-96 bg-[#1a3a9e] rounded-full opacity-50" />
        <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-[#1a3a9e] rounded-full opacity-50" />
        <div className="absolute left-1/4 top-1/3 w-64 h-64 bg-[#2555d4] rounded-full opacity-30" />
      </div>

      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-[300px]">
        {/* Logo */}
        <div className="mb-12 flex justify-center">
          <CartIcon />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <UserIcon />
            </div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="USERNAME"
              className={`w-full h-[45px] pl-10 pr-4 bg-transparent border rounded text-white placeholder-white/70 text-sm uppercase tracking-wide font-light focus:outline-none focus:border-white/80 transition-colors ${
                errors.username ? "border-red-400" : "border-white/60"
              }`}
              disabled={isLoading}
              aria-label="Username"
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? "username-error" : undefined}
            />
            {errors.username && (
              <p id="username-error" className="text-red-300 text-xs mt-1">
                {errors.username}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <LockIcon />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="PASSWORD"
              className={`w-full h-[45px] pl-10 pr-4 bg-transparent border rounded text-white placeholder-white/70 text-sm uppercase tracking-wide font-light focus:outline-none focus:border-white/80 transition-colors ${
                errors.password ? "border-red-400" : "border-white/60"
              }`}
              disabled={isLoading}
              aria-label="Password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-red-300 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Error Message */}
          {submitError && (
            <div
              role="alert"
              className="text-red-300 text-sm text-center font-medium"
            >
              {submitError}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[45px] bg-white text-[#2148c0] font-semibold uppercase tracking-wide rounded shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Login"}
          </button>

          {/* Forgot Password Link */}
          <div className="text-center pt-2">
            <button
              type="button"
              className="text-white text-sm font-medium hover:underline focus:outline-none focus:underline"
            >
              Forgot password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
