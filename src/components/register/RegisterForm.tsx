import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useAuth } from "../../context/useAuth";
import styles from "./RegisterForm.module.css";

interface RegisterFormProps {
  onClose: () => void;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required"),

  email: yup
    .string()
    .trim()
    .email("Enter a valid email")
    .required("Email is required"),

  password: yup
    .string()
    .min(
      6,
      "Password must contain at least 6 characters"
    )
    .required("Password is required"),
});

const RegisterForm = ({
  onClose,
}: RegisterFormProps) => {
  const { register: registerUser } = useAuth();

  const [firebaseError, setFirebaseError] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (
    data: RegisterFormData
  ) => {
    try {
      setFirebaseError(null);

      await registerUser(
        data.name,
        data.email,
        data.password
      );

      onClose();
    } catch (error) {
      console.error(error);

      setFirebaseError(
        "Registration failed. Please try again."
      );
    }
  };

  return (
    <>
      <h2 className={styles.title}>
        Registration
      </h2>

      <p className={styles.description}>
        Thank you for your interest in our platform!
        In order to register, we need some information.
        Please provide us with the following information.
      </p>

      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className={styles.field}>
          <input
            type="text"
            placeholder="Name"
            autoComplete="name"
            {...register("name")}
          />

          {errors.name && (
            <p className={styles.error}>
              {errors.name.message}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            {...register("email")}
          />

          {errors.email && (
            <p className={styles.error}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <input
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            {...register("password")}
          />

          {errors.password && (
            <p className={styles.error}>
              {errors.password.message}
            </p>
          )}
        </div>

        {firebaseError && (
          <p className={styles.error}>
            {firebaseError}
          </p>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Creating account..."
            : "Sign Up"}
        </button>
      </form>
    </>
  );
};

export default RegisterForm;