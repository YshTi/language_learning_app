import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import type { Teacher } from "../../types/teacher";

import { bookingSchema } from "../../utils/validationSchemas";
import { createBooking } from "../../firebase/bookings";

import ButtonLink from "../buttons/Button";
import FilterSelect from "../filter-select/FilterSelect";

import styles from "./BookTrialForm.module.css";

interface BookTrialFormProps {
  teacher: Teacher;
  selectedLanguage?: string;
  onClose: () => void;
}

interface BookTrialFormData {
  language: string;
  reason: string;
  name: string;
  email: string;
  phone: string;
}

const reasons = [
  "Career and business",
  "Lesson for kids",
  "Living abroad",
  "Exams and coursework",
  "Culture, travel or hobby",
];

const BookTrialForm = ({
  teacher,
  selectedLanguage = "",
  onClose,
}: BookTrialFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookTrialFormData>({
    resolver: yupResolver(bookingSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      language: selectedLanguage,
      reason: "",
      name: "",
      email: "",
      phone: "",
    },
  });

  const bookingLanguage = useWatch({
    control,
    name: "language",
  });

  const languageOptions = teacher.languages.map((language) => ({
    label: language,
    value: language,
  }));

  const onSubmit = async (data: BookTrialFormData) => {
    try {
      const bookingData = {
        teacherId: teacher.id,
        teacherName: `${teacher.name} ${teacher.surname}`,
        ...data,
      };

      await createBooking(bookingData);

      toast.success("Your trial lesson request was submitted successfully.");

      onClose();
    } catch (error) {
      console.error("Failed to book trial lesson:", error);

      toast.error("Could not submit your booking. Please try again.");
    }
  };

  return (
    <>
      <h2 className={styles.title}>Book trial lesson</h2>

      <p className={styles.description}>
        Our experienced tutor will assess your current language level, discuss
        your learning goals, and tailor the lesson to your specific needs.
      </p>

      <div className={styles.teacher}>
        <img
          src={teacher.avatar_url}
          alt={`${teacher.name} ${teacher.surname}`}
          className={styles.avatar}
        />

        <div>
          <p className={styles.teacherLabel}>Your teacher</p>

          <p className={styles.teacherName}>
            {teacher.name} {teacher.surname}
          </p>
        </div>
      </div>

      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {!selectedLanguage && (
          <div className={styles.languageField}>
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <FilterSelect
                  label="Language"
                  value={field.value}
                  options={languageOptions}
                  onChange={field.onChange}
                  placeholder="Choose language"
                />
              )}
            />

            {errors.language && (
              <p className={styles.error}>{errors.language.message}</p>
            )}
          </div>
        )}

        <fieldset className={styles.reasonGroup}>
          <legend className={styles.question}>
            {bookingLanguage
              ? `What is your main reason for learning ${bookingLanguage}?`
              : "What is your main reason for learning this language?"}
          </legend>

          <div className={styles.radioList}>
            {reasons.map((reason) => (
              <label key={reason} className={styles.radioLabel}>
                <input type="radio" value={reason} {...register("reason")} />

                <span className={styles.customRadio} />

                <span>{reason}</span>
              </label>
            ))}
          </div>

          {errors.reason && (
            <p className={styles.error}>{errors.reason.message}</p>
          )}
        </fieldset>

        <div className={styles.field}>
          <input
            type="text"
            placeholder="Full Name"
            autoComplete="name"
            className={
              errors.name
                ? `${styles.input} ${styles.inputError}`
                : styles.input
            }
            {...register("name")}
          />

          {errors.name && <p className={styles.error}>{errors.name.message}</p>}
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
            <p className={styles.error}>{errors.email.message}</p>
          )}
        </div>

        <div className={styles.field}>
          <input
            type="tel"
            placeholder="Phone number"
            autoComplete="tel"
            className={
              errors.phone
                ? `${styles.input} ${styles.inputError}`
                : styles.input
            }
            {...register("phone")}
          />

          {errors.phone && (
            <p className={styles.error}>{errors.phone.message}</p>
          )}
        </div>

        <ButtonLink
          as="button"
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          className={styles.submitButton}
        >
          Book
        </ButtonLink>
      </form>
    </>
  );
};

export default BookTrialForm;
