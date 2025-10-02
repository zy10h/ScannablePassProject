import { FormProvider, useForm } from "react-hook-form";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import InputField from "../textfield";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../axiosConfig";

const AuthForm = () => {
    const methods = useForm();
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    const formType = location.pathname === "/login" ? "login" : "register";

    const passwordValue = methods.watch("password", "");
    const [showPassword, setShowPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [notification, setNotification] = useState(null);

    const getStrengthLevel = (password) => {
        let score = 0;
        if (password.length >= 6) score++;
        if (password.match(/[A-Z]/)) score++;
        if (password.match(/[0-9]/)) score++;
        if (password.match(/[^A-Za-z0-9]/)) score++;
        return score;
    };

    const strengthLevel = getStrengthLevel(passwordValue);

    const onSubmit = async (formData, e) => {
        e.preventDefault();
        if (formType === "login") {
            try {
                const response = await axiosInstance.post("/auth/login", formData);
                login(response.data);
                setNotification({ message: "Login successful!", type: "success" });
                setTimeout(() => {
                    if (response.data.role === "admin") {
                        navigate("/admin-dashboard", { replace: true });
                    } else {
                        navigate("/eventListing", { replace: true });
                    }
                }, 1000);
            } catch (error) {
                const message =
                    error.response?.data?.message || "Login failed. Please try again.";
                setNotification({ message, type: "error" });
            }
        } else {
            try {
                await axiosInstance.post("/auth/register", formData);
                setNotification({
                    message: "Registration successful. Please log in.",
                    type: "success",
                });
                setTimeout(() => navigate("/login"), 1000);
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    "Registration failed. Please try again.";
                setNotification({ message, type: "error" });
            }
        }
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="p-4 lg:p-6 flex flex-col gap-4 w-full"
            >
                <div className="mb-4">
                    <p className="font-poppins text-[24px] lg:text-[28px] font-semibold text-[#1D1D1D]">
                        {formType === "login" ? "Login" : "Create account"}
                    </p>
                    <p className="font-poppins text-[12px] lg:text-[14px] text-[#2D3748]">
                        {formType === "login"
                            ? "Welcome back!"
                            : "Register to get started."}
                    </p>
                </div>

                <div className="w-full max-w-[511px] flex flex-col gap-[24px] lg:gap-[32px]">
                    <div className="flex flex-col gap-[20px] lg:gap-[24px]">
                        {formType === "register" && (
                            <InputField
                                label="First Name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                rules={{ required: "Name is required" }}
                            />
                        )}

                        <InputField
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="bill.sanders@example.com"
                            rules={{
                                required: "Email is required",
                                pattern: {
                                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                                    message: "Please enter a valid email address",
                                },
                            }}
                        />

                        <div className="relative">
                            {formType === "register" && (
                                <div className="flex justify-end gap-1 mb-1">
                                    {[1, 2, 3].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-1.5 w-8 rounded ${strengthLevel >= level
                                                ? level === 1
                                                    ? "bg-red-500"
                                                    : level === 2
                                                        ? "bg-orange-400"
                                                        : level === 3
                                                            ? "bg-yellow-400"
                                                            : "bg-green-500"
                                                : "bg-gray-200"
                                                }`}
                                        ></div>
                                    ))}
                                </div>
                            )}
                            <InputField
                                label="Password"
                                name="password"
                                type={
                                    formType === "login"
                                        ? "password"
                                        : showPassword
                                            ? "text"
                                            : "password"
                                }
                                placeholder="••••••••"
                                rules={{
                                    required: "Password is required",
                                    minLength: {
                                        value: 4,
                                        message: "Password must be at least 6 characters",
                                    },
                                }}
                            />
                            {formType === "register" && (
                                <div className="mt-5">

                                    <InputField
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        rules={{
                                            required: "Confirm Password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters",
                                            },
                                        }}
                                    />
                                </div>
                            )}
                            {formType === "register" && (
                                <div className="flex flex-col gap-4 mt-2">
                                    <InputField
                                        label="University"
                                        name="university"
                                        type="text"
                                        placeholder="Your university"
                                        rules={{ required: "University is required" }}
                                    />
                                    <InputField
                                        label="Address"
                                        name="address"
                                        type="text"
                                        placeholder="Your address"
                                        rules={{ required: "Address is required" }}
                                    />
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-11 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>

                        </div>

                        {formType === "login" && (
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-600 underline mt-1 self-end"
                            >
                                Forgot Password?
                            </Link>
                        )}


                    </div>

                    {formType === "register" && (
                        <div className="flex flex-col gap-4">
                            <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                    className="w-4 h-4"
                                />
                                Remember me
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={acceptTerms}
                                    onChange={() => setAcceptTerms(!acceptTerms)}
                                    className="w-4 h-4"
                                />
                                I agree to the{" "}
                                <a href="/terms" className="text-blue-600 underline">
                                    Terms & Conditions
                                </a>
                            </label>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={formType === "register" && !acceptTerms}
                    className={`w-full max-w-[511px] h-[48px] rounded-[6px] font-poppins text-[16px] transition ${formType === "register" && !acceptTerms
                        ? "bg-blue-300 cursor-not-allowed text-white"
                        : "bg-[#007AFF] hover:bg-blue-600 text-white"
                        }`}
                >
                    {formType === "login" ? "Login" : "Register"}
                </button>

                {formType === "login" ? (
                    <p className="text-sm text-gray-600 text-center mt-2">
                        New here?{" "}
                        <Link to="/register" className="text-blue-600 underline">
                            Create an account
                        </Link>
                    </p>
                ) : (
                    <p className="text-sm text-gray-600 text-center mt-2">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 underline">
                            Login
                        </Link>
                    </p>
                )}

                {notification && (
                    <p
                        className={`text-sm mt-2 text-center ${notification.type === "success"
                            ? "text-green-600"
                            : "text-red-600"
                            }`}
                    >
                        {notification.message}
                    </p>
                )}
            </form>
        </FormProvider>
    );
};

export default AuthForm;
