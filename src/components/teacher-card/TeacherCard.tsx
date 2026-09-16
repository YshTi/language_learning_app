import { useEffect, useState } from "react";

import { FiBookOpen } from "react-icons/fi";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";

import type { Teacher } from "../../types/teacher";

import { useAuth } from "../../context/useAuth";

import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../../firebase/favorites";

import ButtonLink from "../buttons/Button";

import styles from "./TeacherCard.module.css";

interface TeacherCardProps {
  teacher: Teacher;
  selectedLevel?: string;
  onBookTrial?: () => void;
}

const TeacherCard = ({
  teacher,
  selectedLevel = "",
  onBookTrial,
}: TeacherCardProps) => {
  const { user } = useAuth();

  const [isExpanded, setIsExpanded] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);

  const [isFavoriteLoading, setIsFavoriteLoading] =
    useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user || !teacher.id) {
        setIsFavorite(false);
        return;
      }

      try {
        const favorites = await getFavorites(user.uid);

        setIsFavorite(
          favorites.includes(teacher.id)
        );
      } catch (error) {
        console.error(
          "Failed to load favorites:",
          error
        );
      }
    };

    checkFavorite();
  }, [user, teacher.id]);

  const handleToggleFavorite = async () => {
    if (!user) {
      alert(
        "This functionality is available only for authorized users."
      );
      return;
    }

    if (!teacher.id) {
      return;
    }

    try {
      setIsFavoriteLoading(true);

      if (isFavorite) {
        await removeFavorite(
          user.uid,
          teacher.id
        );

        setIsFavorite(false);
      } else {
        await addFavorite(
          user.uid,
          teacher.id
        );

        setIsFavorite(true);
      }
    } catch (error) {
      console.error(
        "Failed to update favorite:",
        error
      );
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  return (
    <article className={styles.card}>
      <div className={styles.avatarWrapper}>
        <img
          src={teacher.avatar_url}
          alt={`${teacher.name} ${teacher.surname}`}
          className={styles.avatar}
        />

        <span
          className={styles.onlineIndicator}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <p className={styles.label}>
              Languages
            </p>

            <h2 className={styles.name}>
              {teacher.name}{" "}
              {teacher.surname}
            </h2>
          </div>

          <div className={styles.teacherStats}>
            <div className={styles.stat}>
              <FiBookOpen />

              <span>Lessons online</span>
            </div>

            <div className={styles.stat}>
              <span>
                Lessons done:{" "}
                {teacher.lessons_done}
              </span>
            </div>

            <div className={styles.stat}>
              <FaStar
                className={styles.starIcon}
              />

              <span>
                Rating: {teacher.rating}
              </span>
            </div>

            <div className={styles.stat}>
              <span>
                Price / 1 hour:{" "}
                <strong
                  className={styles.price}
                >
                  {teacher.price_per_hour}$
                </strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            className={styles.favoriteButton}
            onClick={handleToggleFavorite}
            disabled={isFavoriteLoading}
            aria-label={
              isFavorite
                ? "Remove teacher from favorites"
                : "Add teacher to favorites"
            }
          >
            {isFavorite ? (
              <FaHeart
                className={styles.favoriteActive}
              />
            ) : (
              <FaRegHeart />
            )}
          </button>
        </div>

        <div className={styles.details}>
          <p className={styles.infoRow}>
            <span
              className={styles.detailLabel}
            >
              Speaks:
            </span>{" "}
            <span className={styles.languages}>
              {teacher.languages.join(", ")}
            </span>
          </p>

          <p className={styles.infoRow}>
            <span
              className={styles.detailLabel}
            >
              Lesson Info:
            </span>{" "}
            {teacher.lesson_info}
          </p>

          <p className={styles.infoRow}>
            <span
              className={styles.detailLabel}
            >
              Conditions:
            </span>{" "}
            {teacher.conditions.join(" ")}
          </p>

          {!isExpanded && (
            <button
              type="button"
              className={styles.readMore}
              onClick={() =>
                setIsExpanded(true)
              }
            >
              Read more
            </button>
          )}

          {isExpanded && (
            <div
              className={
                styles.expandedContent
              }
            >
              <p
                className={
                  styles.experience
                }
              >
                {teacher.experience}
              </p>

              <div
                className={styles.reviews}
              >
                {teacher.reviews.map(
                  (review, index) => (
                    <div
                      className={
                        styles.review
                      }
                      key={`${review.reviewer_name}-${index}`}
                    >
                      <div
                        className={
                          styles.reviewHeader
                        }
                      >
                        <div
                          className={
                            styles.reviewAvatar
                          }
                        >
                          {review.reviewer_name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p
                            className={
                              styles.reviewerName
                            }
                          >
                            {
                              review.reviewer_name
                            }
                          </p>

                          <div
                            className={
                              styles.reviewRating
                            }
                          >
                            <FaStar />

                            <span>
                              {review.reviewer_rating.toFixed(
                                1
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p
                        className={
                          styles.reviewComment
                        }
                      >
                        {review.comment}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <ul className={styles.levels}>
            {teacher.levels.map((level) => {
              const isActive =
                selectedLevel === level;

              return (
                <li
                  key={level}
                  className={`${styles.level} ${
                    isActive
                      ? styles.levelActive
                      : ""
                  }`}
                >
                  #{level}
                </li>
              );
            })}
          </ul>

          {isExpanded && (
            <ButtonLink
              as="button"
              variant="primary"
              className={styles.bookButton}
              onClick={onBookTrial}
            >
              Book trial lesson
            </ButtonLink>
          )}
        </div>
      </div>
    </article>
  );
};

export default TeacherCard;