import * as yup from "yup";

const emailRule = yup
  .string()
  .trim()
  .required("Email is required")
  .matches(
    /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/,
    "Email must contain @ and a valid domain, for example .com, .org or .net",
  );

const passwordRule = yup
  .string()
  .required("Password is required")
  .min(8, "Password must contain at least 8 characters")
  .matches(
    /[\d\W_]/,
    "Password must contain at least one number or special character",
  );

const nameRule = yup.string().trim().required("Name is required");

const fullNameRule = yup.string().trim().required("Full name is required");

const phoneRule = yup
  .string()
  .trim()
  .required("Phone number is required")
  .matches(/^\+?[0-9\s()-]{7,20}$/, "Enter a valid phone number");

const languageRule = yup.string().required("Please choose a language");

const reasonRule = yup.string().required("Please choose a reason for learning");

export const loginSchema = yup.object({
  email: emailRule,
  password: passwordRule,
});

export const registerSchema = yup.object({
  name: nameRule,
  email: emailRule,
  password: passwordRule,
});

export const bookingSchema = yup.object({
  language: languageRule,
  reason: reasonRule,
  name: fullNameRule,
  email: emailRule,
  phone: phoneRule,
});
