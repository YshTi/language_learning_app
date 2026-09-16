import { useEffect, useMemo, useRef, useState } from "react";

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
  filterTeachers?: Teacher[];
  isLoading?: boolean;
  emptyMessage?: string;
  hasMoreFromDatabase?: boolean;
  onLoadMoreRequest?: () => Promise<void>;
  onFavoriteChange?: (teacherId: string, isFavorite: boolean) => void;
}

const PAGE_SIZE = 4;

const TeacherCatalog = ({
  teachers,
  filterTeachers,
  isLoading = false,
  emptyMessage = "No teachers match the selected filters.",
  hasMoreFromDatabase = false,
  onLoadMoreRequest,
  onFavoriteChange,
}: TeacherCatalogProps) => {
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const pendingScrollIndex = useRef<number | null>(null);

  const filterSource = filterTeachers ?? teachers;

  const languageOptions: Option[] = useMemo(() => {
    const uniqueLanguages = [
      ...new Set(filterSource.flatMap((teacher) => teacher.languages)),
    ].sort();

    return uniqueLanguages.map((language) => ({
      label: language,
      value: language,
    }));
  }, [filterSource]);

  const levelOptions: Option[] = useMemo(() => {
    const uniqueLevels = [
      ...new Set(filterSource.flatMap((teacher) => teacher.levels)),
    ].sort();

    return uniqueLevels.map((level) => ({
      label: level,
      value: level,
    }));
  }, [filterSource]);

  const hasActiveFilters =
    Boolean(language) || Boolean(level) || Boolean(price);

  const sourceForFiltering = hasActiveFilters ? filterSource : teachers;

  const filteredTeachers = useMemo(() => {
    return sourceForFiltering.filter((teacher) => {
      const matchesLanguage = !language || teacher.languages.includes(language);

      const matchesLevel = !level || teacher.levels.includes(level);

      let matchesPrice = true;

      if (price) {
        const selectedPrice = Number(price);

        const teacherPrice = teacher.price_per_hour;

        if (selectedPrice === 10) {
          matchesPrice = teacherPrice <= 10;
        } else {
          matchesPrice =
            teacherPrice > selectedPrice - 10 && teacherPrice <= selectedPrice;
        }
      }

      return matchesLanguage && matchesLevel && matchesPrice;
    });
  }, [sourceForFiltering, language, level, price]);

  const visibleTeachers = useMemo(() => {
    return filteredTeachers.slice(0, visibleCount);
  }, [filteredTeachers, visibleCount]);

  const hasMoreFiltered = visibleCount < filteredTeachers.length;

  const hasMore = hasActiveFilters
    ? hasMoreFiltered
    : hasMoreFromDatabase || hasMoreFiltered;

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleLevelChange = (value: string) => {
    setLevel(value);
    setVisibleCount(PAGE_SIZE);
  };

  const handlePriceChange = (value: string) => {
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
    if (isLoadingMore || !hasMore) {
      return;
    }

    try {
      setIsLoadingMore(true);

      pendingScrollIndex.current = visibleCount;

      if (!hasActiveFilters && onLoadMoreRequest && hasMoreFromDatabase) {
        await onLoadMoreRequest();
      }

      setVisibleCount((previousCount) => previousCount + PAGE_SIZE);
    } catch (error) {
      console.error("Failed to load more teachers:", error);

      pendingScrollIndex.current = null;
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const index = pendingScrollIndex.current;

    if (index === null) {
      return;
    }

    const firstNewTeacher = visibleTeachers[index];

    if (!firstNewTeacher) {
      return;
    }

    const element = document.querySelector(
      `[data-teacher-id="${firstNewTeacher.id}"]`,
    );

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      pendingScrollIndex.current = null;
    }
  }, [visibleTeachers]);

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
            <Loader size={220} />
          </div>
        ) : (
          <>
            <div className={styles.cards}>
              {visibleTeachers.length > 0 ? (
                visibleTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    data-teacher-id={teacher.id}
                    className={styles.teacherCardWrapper}
                  >
                    <TeacherCard
                      teacher={teacher}
                      selectedLevel={level}
                      selectedLanguage={language}
                      onFavoriteChange={onFavoriteChange}
                    />
                  </div>
                ))
              ) : (
                <p className={styles.empty}>{emptyMessage}</p>
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
