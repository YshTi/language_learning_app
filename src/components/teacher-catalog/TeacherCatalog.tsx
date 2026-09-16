import {
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";

import Container from "../container/Container";
import Filters from "../filters/Filters";
import TeacherCard from "../teacher-card/TeacherCard";
import Loader from "../loader/Loader";
import LoadMore from "../load-more/LoadMore";

import type { Teacher } from "../../types/teacher";

import styles from "./TeacherCatalog.module.css";

interface Option {
  label: string;
  value: string;
}

interface TeacherCatalogProps {
  teachers: Teacher[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const PAGE_SIZE = 4;

const TeacherCatalog = ({
  teachers,
  isLoading = false,
  emptyMessage = "No teachers match the selected filters.",
}: TeacherCatalogProps) => {
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");

  const [visibleCount, setVisibleCount] =
    useState(PAGE_SIZE);

  const [isLoadingMore, setIsLoadingMore] =
    useState(false);

  const pendingScrollTeacherId =
    useRef<string | null>(null);

  const languageOptions: Option[] = useMemo(() => {
    const uniqueLanguages = [
      ...new Set(
        teachers.flatMap(
          teacher => teacher.languages
        )
      ),
    ].sort();

    return uniqueLanguages.map(language => ({
      label: language,
      value: language,
    }));
  }, [teachers]);

  const levelOptions: Option[] = useMemo(() => {
    const uniqueLevels = [
      ...new Set(
        teachers.flatMap(
          teacher => teacher.levels
        )
      ),
    ];

    return uniqueLevels.map(level => ({
      label: level,
      value: level,
    }));
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(teacher => {
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
    });
  }, [
    teachers,
    language,
    level,
    price,
  ]);

  const visibleTeachers = useMemo(() => {
    return filteredTeachers.slice(
      0,
      visibleCount
    );
  }, [
    filteredTeachers,
    visibleCount,
  ]);

  const hasMore =
    visibleCount < filteredTeachers.length;

  const handleLanguageChange = (
    value: string
  ) => {
    setLanguage(value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleLevelChange = (
    value: string
  ) => {
    setLevel(value);
    setVisibleCount(PAGE_SIZE);
  };

  const handlePriceChange = (
    value: string
  ) => {
    setPrice(value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleResetFilters = () => {
    setLanguage("");
    setLevel("");
    setPrice("");
    setVisibleCount(PAGE_SIZE);
  };

  const handleLoadMore = async () => {
    if (
      isLoadingMore ||
      !hasMore
    ) {
      return;
    }

    try {
      setIsLoadingMore(true);

      const firstNewTeacher =
        filteredTeachers[visibleCount];

      if (firstNewTeacher) {
        pendingScrollTeacherId.current =
          firstNewTeacher.id;
      }

      setVisibleCount(previousCount =>
        Math.min(
          previousCount + PAGE_SIZE,
          filteredTeachers.length
        )
      );
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const teacherId =
      pendingScrollTeacherId.current;

    if (!teacherId) {
      return;
    }

    const element =
      document.querySelector(
        `[data-teacher-id="${teacherId}"]`
      );

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      pendingScrollTeacherId.current = null;
    }
  }, [visibleTeachers]);

  const hasActiveFilters =
    Boolean(language) ||
    Boolean(level) ||
    Boolean(price);

  return (
    <main className={styles.page}>
      <Container className={styles.teachersContainer}>
        <Filters
          language={language}
          level={level}
          price={price}
          languageOptions={languageOptions}
          levelOptions={levelOptions}
          onLanguageChange={handleLanguageChange}
          onLevelChange={handleLevelChange}
          onPriceChange={handlePriceChange}
          hasActiveFilters={hasActiveFilters}
          onReset={handleResetFilters}
        />

        {isLoading ? (
          <div className={styles.loaderWrapper}>
            <Loader size={120} />
          </div>
        ) : (
          <>
            <div className={styles.cards}>
              {visibleTeachers.length > 0 ? (
                visibleTeachers.map(teacher => (
                  <div
                    key={teacher.id}
                    data-teacher-id={teacher.id}
                    className={
                      styles.teacherCardWrapper
                    }
                  >
                    <TeacherCard
                      teacher={teacher}
                      selectedLevel={level}
                    />
                  </div>
                ))
              ) : (
                <p className={styles.empty}>
                  {emptyMessage}
                </p>
              )}
            </div>

            <LoadMore
              isLoading={isLoadingMore}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
            />
          </>
        )}
      </Container>
    </main>
  );
};

export default TeacherCatalog;