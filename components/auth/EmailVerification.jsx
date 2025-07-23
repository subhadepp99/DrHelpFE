import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { authAPI } from "../../lib/api";
import { toast } from "react-toastify";

const EmailVerification = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { verifyEmail } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await verifyEmail({
      userId,
      otp: data.otp,
    });

    if (result.success) {
      router.push("/");
    }
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    try {
      await authAPI.resendOTP({ userId });
      toast.success("OTP sent successfully!");
      setCountdown(60); // 60 seconds countdown
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
    setIsResending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a verification code to your email address. Please enter
            the code below to verify your account.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Verification Code
            </label>
            <input
              {...register("otp", {
                required: "Verification code is required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "Please enter a valid 6-digit code",
                },
              })}
              type="text"
              maxLength="6"
              className="appearance-none relative block w-full px-3 py-3 text-center border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-2xl tracking-widest"
              placeholder="000000"
            />
            {errors.otp && (
              <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={countdown > 0 || isResending}
                className="font-medium text-primary-600 hover:text-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending
                  ? "Sending..."
                  : countdown > 0
                  ? `Resend in ${countdown}s`
                  : "Resend Code"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;
