import { useEffect, useMemo, useState } from "react";

import Container from "../../components/container/Container";
import Filters from "../../components/filters/Filters";
import TeacherCard from "../../components/teacher-card/TeacherCard";

import { getTeachers } from "../../firebase/teachers";

import type { Teacher } from "../../types/teacher";

import styles from "./TeachersPage.module.css";

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const data = await getTeachers();
        setTeachers(data);
      } catch (error) {
        console.error("Failed to load teachers:", error);
      }
    };

    loadTeachers();
  }, []);

  const languageOptions = useMemo(() => {
    const uniqueLanguages = [
      ...new Set(
        teachers.flatMap((teacher) => teacher.languages)
      ),
    ].sort();

    return uniqueLanguages.map((language) => ({
      label: language,
      value: language,
    }));
  }, [teachers]);

  const levelOptions = useMemo(() => {
    const uniqueLevels = [
      ...new Set(
        teachers.flatMap((teacher) => teacher.levels)
      ),
    ];

    return uniqueLevels.map((level) => ({
      label: level,
      value: level,
    }));
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    return teachers
      .filter((teacher) => {
        const matchesLanguage =
          !language ||
          teacher.languages.includes(language);

        const matchesLevel =
          !level ||
          teacher.levels.includes(level);

        let matchesPrice = true;

        if (price) {
          const selectedPrice = Number(price);
          const teacherPrice = teacher.price_per_hour;

          if (selectedPrice === 10) {
            matchesPrice = teacherPrice <= 10;
          } else {
            matchesPrice =
              teacherPrice > selectedPrice - 10 &&
              teacherPrice <= selectedPrice;
          }
        }

        return (
          matchesLanguage &&
          matchesLevel &&
          matchesPrice
        );
      })
      .sort(
        (a, b) =>
          a.price_per_hour - b.price_per_hour
      );
  }, [teachers, language, level, price]);

  const hasActiveFilters =
    Boolean(language) ||
    Boolean(level) ||
    Boolean(price);

  const handleResetFilters = () => {
    setLanguage("");
    setLevel("");
    setPrice("");
  };

  return (
    <main className={styles.teachersPage}>
      <Container className={styles.teachersContainer}>
        <Filters
          language={language}
          level={level}
          price={price}
          languageOptions={languageOptions}
          levelOptions={levelOptions}
          onLanguageChange={setLanguage}
          onLevelChange={setLevel}
          onPriceChange={setPrice}
          hasActiveFilters={hasActiveFilters}
          onReset={handleResetFilters}
        />

        <div className={styles.cards}>
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                selectedLevel={level}
              />
            ))
          ) : (
            <p className={styles.empty}>
              No teachers match the selected filters.
            </p>
          )}
        </div>
      </Container>
    </main>
  );
};

export default TeachersPage;