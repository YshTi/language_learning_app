import { useState } from "react";
import { NavLink } from "react-router-dom";
import { CiLogin, CiLogout } from "react-icons/ci";

import Container from "../container/Container";
import Logo from "../logo/Logo";
import Modal from "../modal/Modal";
import LoginForm from "../login/LoginForm";
import RegisterForm from "../register/RegisterForm";
import ButtonLink from "../buttons/Button";

import { useAuth } from "../../context/useAuth";

import styles from "./Header.module.css";

const Header = () => {
  const { user, logout } = useAuth();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <Container className={styles.headerContainer}>
          <Logo />

          <nav className={styles.nav}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/teachers"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              Teachers
            </NavLink>

            {user && (
              <NavLink
                to="/favorites"
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
                  onClick={handleLogout}
                >
                  <CiLogout className={styles.authIcon} />
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className={styles.authButton}
                  onClick={() => setIsLoginOpen(true)}
                >
                  <CiLogin className={styles.authIcon} />
                  Log in
                </button>

                <ButtonLink
                  as="button"
                  variant="secondary"
                  className={styles.registerButton}
                  onClick={() => setIsRegisterOpen(true)}
                >
                  Registration
                </ButtonLink>
              </>
            )}
          </div>
        </Container>
      </header>

      {isLoginOpen && (
        <Modal onClose={() => setIsLoginOpen(false)}>
          <LoginForm onClose={() => setIsLoginOpen(false)} />
        </Modal>
      )}

      {isRegisterOpen && (
        <Modal onClose={() => setIsRegisterOpen(false)}>
          <RegisterForm onClose={() => setIsRegisterOpen(false)} />
        </Modal>
      )}
    </>
  );
};

export default Header;
