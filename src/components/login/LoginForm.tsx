import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useAuth } from "../../context/useAuth";
import styles from "./LoginForm.module.css";

interface LoginFormProps {
  onClose: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),

  password: yup
    .string()
    .required("Password is required"),
});

const LoginForm = ({ onClose }: LoginFormProps) => {
  const { login } = useAuth();

  const [firebaseError, setFirebaseError] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setFirebaseError(null);

      await login(data.email, data.password);

      onClose();
    } catch {
      setFirebaseError("Invalid email or password");
    }
  };

  return (
    <>
      <h2 className={styles.title}>Log In</h2>

      <p className={styles.description}>
        Welcome back! Please enter your credentials to access your
        account and continue your search for a teacher.
      </p>

      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
          />

          {errors.email && (
            <p className={styles.error}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
          />

          {errors.password && (
            <p className={styles.error}>
              {errors.password.message}
            </p>
          )}
        </div>

        {firebaseError && (
          <p className={styles.error}>{firebaseError}</p>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
      </form>
    </>
  );
};

export default LoginForm;