import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LuEye, LuEyeOff } from "react-icons/lu";

import { useAuth } from "../../context/useAuth";
import { registerSchema } from "../../utils/validationSchemas";

import ButtonLink from "../buttons/Button";

import styles from "./RegisterForm.module.css";

interface RegisterFormProps {
  onClose: () => void;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

const RegisterForm = ({ onClose }: RegisterFormProps) => {
  const { register: registerUser } = useAuth();

  const [firebaseError, setFirebaseError] =
    useState<string | null>(null);

  const [showPassword, setShowPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
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
        Thank you for your interest in our platform! In order to
        register, we need some information. Please provide us with
        the following information.
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
            className={
              errors.name
                ? `${styles.input} ${styles.inputError}`
                : styles.input
            }
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
            className={
              errors.email
                ? `${styles.input} ${styles.inputError}`
                : styles.input
            }
            {...register("email")}
          />

          {errors.email && (
            <p className={styles.error}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="new-password"
              className={
                errors.password
                  ? `${styles.input} ${styles.inputError}`
                  : styles.input
              }
              {...register("password")}
            />

            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() =>
                setShowPassword(prev => !prev)
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <LuEye />
              ) : (
                <LuEyeOff />
              )}
            </button>
          </div>

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

        <ButtonLink
          as="button"
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting
            ? "Creating account..."
            : "Sign Up"}
        </ButtonLink>
      </form>
    </>
  );
};

export default RegisterForm;