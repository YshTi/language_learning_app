import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { CiLogin, CiLogout } from "react-icons/ci";

import Logo from "../logo/Logo";
import ButtonLink from "../buttons/Button";

import type { AppUser } from "../../context/authContext";

import styles from "./MobileMenu.module.css";

interface MobileMenuProps {
  user: AppUser | null;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
}

const MobileMenu = ({
  user,
  onClose,
  onLogin,
  onRegister,
  onLogout,
}: MobileMenuProps) => {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className={styles.menu}>
      <div className={styles.top}>
        <Logo />

        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close menu"
        >
          <IoClose />
        </button>
      </div>

      <nav className={styles.nav}>
        <NavLink
          to="/"
          onClick={onClose}
          className={({ isActive }) =>
            isActive
              ? `${styles.navLink} ${styles.active}`
              : styles.navLink
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/teachers"
          onClick={onClose}
          className={({ isActive }) =>
            isActive
              ? `${styles.navLink} ${styles.active}`
              : styles.navLink
          }
        >
          Teachers
        </NavLink>

        {user && (
          <NavLink
            to="/favorites"
            onClick={onClose}
            className={({ isActive }) =>
              isActive
                ? `${styles.navLink} ${styles.active}`
                : styles.navLink
            }
          >
            Favorites
          </NavLink>
        )}
      </nav>

      <div className={styles.actions}>
        {user ? (
          <>
            <span className={styles.userName}>
              {user.displayName || user.email}
            </span>

            <button
              type="button"
              className={styles.authButton}
              onClick={onLogout}
            >
              <CiLogout />
              Log out
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className={styles.authButton}
              onClick={onLogin}
            >
              <CiLogin />
              Log in
            </button>

            <ButtonLink
              as="button"
              variant="secondary"
              className={styles.registerButton}
              onClick={onRegister}
            >
              Registration
            </ButtonLink>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;