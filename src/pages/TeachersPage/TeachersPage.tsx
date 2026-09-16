import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Container from "../../components/container/Container";
import Filters from "../../components/filters/Filters";
import TeacherCard from "../../components/teacher-card/TeacherCard";
import Loader from "../../components/loader/Loader";
import LoadMore from "../../components/load-more/LoadMore";

import { getAllTeachers } from "../../firebase/teachers";

import type { Teacher } from "../../types/teacher";

import styles from "./TeachersPage.module.css";

interface Option {
  label: string;
  value: string;
}

const PAGE_SIZE = 4;

const TeachersPage = () => {
  const [allTeachers, setAllTeachers] =
    useState<Teacher[]>([]);

  const [languageOptions, setLanguageOptions] =
    useState<Option[]>([]);

  const [levelOptions, setLevelOptions] =
    useState<Option[]>([]);

  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");

  const [visibleCount, setVisibleCount] =
    useState(PAGE_SIZE);

  const [isInitialLoading, setIsInitialLoading] =
    useState(true);

  const [isLoadingMore, setIsLoadingMore] =
    useState(false);

  const pendingScrollTeacherId =
    useRef<string | null>(null);

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        setIsInitialLoading(true);

        const data = await getAllTeachers();

        setAllTeachers(data);

        const uniqueLanguages = [
          ...new Set(
            data.flatMap(
              (teacher) => teacher.languages
            )
          ),
        ].sort();

        const uniqueLevels = [
          ...new Set(
            data.flatMap(
              (teacher) => teacher.levels
            )
          ),
        ];

        setLanguageOptions(
          uniqueLanguages.map((language) => ({
            label: language,
            value: language,
          }))
        );

        setLevelOptions(
          uniqueLevels.map((level) => ({
            label: level,
            value: level,
          }))
        );
      } catch (error) {
        console.error(
          "Failed to load teachers:",
          error
        );
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadTeachers();
  }, []);

  const filteredTeachers = useMemo(() => {
    return allTeachers.filter((teacher) => {
      const matchesLanguage =
        !language ||
        teacher.languages.includes(language);

      const matchesLevel =
        !level ||
        teacher.levels.includes(level);

      let matchesPrice = true;

      if (price) {
        const selectedPrice = Number(price);
        const teacherPrice =
          teacher.price_per_hour;

        if (selectedPrice === 10) {
          matchesPrice =
            teacherPrice <= 10;
        } else {
          matchesPrice =
            teacherPrice >
              selectedPrice - 10 &&
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
    allTeachers,
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
    visibleCount <
    filteredTeachers.length;

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

      const freshTeachers =
        await getAllTeachers();

      setAllTeachers(freshTeachers);

      const freshFilteredTeachers =
        freshTeachers.filter((teacher) => {
          const matchesLanguage =
            !language ||
            teacher.languages.includes(
              language
            );

          const matchesLevel =
            !level ||
            teacher.levels.includes(
              level
            );

          let matchesPrice = true;

          if (price) {
            const selectedPrice =
              Number(price);

            const teacherPrice =
              teacher.price_per_hour;

            if (
              selectedPrice === 10
            ) {
              matchesPrice =
                teacherPrice <= 10;
            } else {
              matchesPrice =
                teacherPrice >
                  selectedPrice - 10 &&
                teacherPrice <=
                  selectedPrice;
            }
          }

          return (
            matchesLanguage &&
            matchesLevel &&
            matchesPrice
          );
        });

      const firstNewTeacher =
        freshFilteredTeachers[
          visibleCount
        ];

      if (firstNewTeacher) {
        pendingScrollTeacherId.current =
          firstNewTeacher.id;
      }

      setVisibleCount(
        (previousCount) =>
          Math.min(
            previousCount + PAGE_SIZE,
            freshFilteredTeachers.length
          )
      );
    } catch (error) {
      console.error(
        "Failed to load more teachers:",
        error
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

      pendingScrollTeacherId.current =
        null;
    }
  }, [visibleTeachers]);

  const hasActiveFilters =
    Boolean(language) ||
    Boolean(level) ||
    Boolean(price);

  return (
    <main
      className={styles.teachersPage}
    >
      <Container
        className={styles.teachersContainer}
      >
        <Filters
          language={language}
          level={level}
          price={price}
          languageOptions={
            languageOptions
          }
          levelOptions={
            levelOptions
          }
          onLanguageChange={
            handleLanguageChange
          }
          onLevelChange={
            handleLevelChange
          }
          onPriceChange={
            handlePriceChange
          }
          hasActiveFilters={
            hasActiveFilters
          }
          onReset={
            handleResetFilters
          }
        />

        {isInitialLoading ? (
          <div
            className={
              styles.loaderWrapper
            }
          >
            <Loader size={120} />
          </div>
        ) : (
          <>
            <div
              className={
                styles.cards
              }
            >
              {visibleTeachers.length >
              0 ? (
                visibleTeachers.map(
                  (teacher) => (
                    <div
                      key={
                        teacher.id
                      }
                      data-teacher-id={
                        teacher.id
                      }
                      className={
                        styles.teacherCardWrapper
                      }
                    >
                      <TeacherCard
                        teacher={
                          teacher
                        }
                        selectedLevel={
                          level
                        }
                      />
                    </div>
                  )
                )
              ) : (
                <p
                  className={
                    styles.empty
                  }
                >
                  No teachers match the selected filters.
                </p>
              )}
            </div>

            <LoadMore
              isLoading={
                isLoadingMore
              }
              hasMore={hasMore}
              onLoadMore={
                handleLoadMore
              }
            />
          </>
        )}
      </Container>
    </main>
  );
};

export default TeachersPage;