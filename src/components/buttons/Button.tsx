import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import Loader from "../loader/Loader";

import styles from "./Button.module.css";

interface BaseProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

interface ButtonProps extends BaseProps {
  as?: "button";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

interface LinkProps extends BaseProps {
  as: "link";
  to: string;
}

type ButtonLinkProps = ButtonProps | LinkProps;

const ButtonLink = (props: ButtonLinkProps) => {
  const {
    children,
    variant = "primary",
    className = "",
  } = props;

  const classes =
    `${styles.base} ${styles[variant]} ${className}`;

  if (props.as === "link") {
    return (
      <Link
        to={props.to}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  const isLoading = props.isLoading ?? false;

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={
        props.disabled || isLoading
      }
      className={classes}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <Loader size={28} />
      ) : (
        children
      )}
    </button>
  );
};

export default ButtonLink;