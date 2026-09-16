import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAuth } from "../../context/useAuth";
import { loginSchema } from "../../utils/validationSchemas";

import ButtonLink from "../buttons/Button";

import styles from "./LoginForm.module.css";

interface LoginFormProps {
  onClose: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm = ({ onClose }: LoginFormProps) => {
  const { login } = useAuth();

  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
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
        Welcome back! Please enter your credentials to access your account and
        continue your search for a teacher.
      </p>

      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
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
            <p className={styles.error}>{errors.email.message}</p>
          )}
        </div>

        <div className={styles.field}>
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            className={
              errors.password
                ? `${styles.input} ${styles.inputError}`
                : styles.input
            }
            {...register("password")}
          />

          {errors.password && (
            <p className={styles.error}>{errors.password.message}</p>
          )}
        </div>

        {firebaseError && <p className={styles.error}>{firebaseError}</p>}

        <ButtonLink
          as="button"
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          className={styles.submitButton}
        >
          Log In
        </ButtonLink>
      </form>
    </>
  );
};

export default LoginForm;
