import { useState } from "react";

import Container from "../../components/container/Container";
import ButtonLink from "../../components/buttons/Button";
import Modal from "../../components/modal/Modal";
import RegisterForm from "../../components/register/RegisterForm";

import { useAuth } from "../../context/useAuth";

import styles from "./HomePage.module.css";

const HomePage = () => {
  const { user } = useAuth();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <>
      <main className={styles.home}>
        <Container className={styles.homeContainer}>
          <div className={styles.heroTop}>
            <div className={styles.heroText}>
              <h1 className={styles.title}>
                Unlock your potential with the best{" "}
                <span className={styles.highlight}>language</span> tutors
              </h1>

              <p className={styles.description}>
                Embark on an exciting language journey with expert language
                tutors. Elevate your language proficiency to new heights by
                connecting with highly qualified and experienced tutors.
              </p>

              {user ? (
                <ButtonLink
                  as="link"
                  to="/teachers"
                  variant="primary"
                  className={styles.startButton}
                >
                  Get Started
                </ButtonLink>
              ) : (
                <ButtonLink
                  as="button"
                  variant="primary"
                  className={styles.startButton}
                  onClick={() => setIsRegisterOpen(true)}
                >
                  Get Started
                </ButtonLink>
              )}
            </div>

            <div className={styles.heroImage}>
              <img
                src="/images/teacher.webp"
                alt="Online language teacher"
                className={styles.teacherImage}
              />

              <img
                src="/images/laptop.webp"
                alt="Laptop"
                className={styles.laptopImage}
              />
            </div>
          </div>

          <div className={styles.statistics}>
            <ul className={styles.statisticsList}>
              <li className={styles.statItem}>
                <span className={styles.statNumber}>32,000 +</span>

                <span className={`${styles.statLabel} ${styles.wideLabel}`}>
                  Experienced tutors
                </span>
              </li>

              <li className={styles.statItem}>
                <span className={styles.statNumber}>300,000 +</span>

                <span className={`${styles.statLabel} ${styles.wideLabel}`}>
                  5-star tutor reviews
                </span>
              </li>

              <li className={styles.statItem}>
                <span className={styles.statNumber}>120 +</span>

                <span className={styles.statLabel}>Subjects taught</span>
              </li>

              <li className={styles.statItem}>
                <span className={styles.statNumber}>200 +</span>

                <span className={styles.statLabel}>Tutor nationalities</span>
              </li>
            </ul>
          </div>
        </Container>
      </main>

      {isRegisterOpen && (
        <Modal onClose={() => setIsRegisterOpen(false)}>
          <RegisterForm onClose={() => setIsRegisterOpen(false)} />
        </Modal>
      )}
    </>
  );
};

export default HomePage;
