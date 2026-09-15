import * as yup from "yup";

const emailRule = yup
  .string()
  .trim()
  .required("Email is required")
  .matches(
    /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/,
    "Email must contain @ and a valid domain, for example .com, .org or .net"
  );

const passwordRule = yup
  .string()
  .required("Password is required")
  .min(8, "Password must contain at least 8 characters")
  .matches(
    /[\d\W_]/,
    "Password must contain at least one number or special character"
  );

export const loginSchema = yup.object({
  email: emailRule,
  password: passwordRule,
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required"),

  email: emailRule,
  password: passwordRule,
});