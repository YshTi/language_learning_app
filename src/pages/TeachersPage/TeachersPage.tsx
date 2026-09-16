import { useEffect, useState } from "react";

import TeacherCatalog from "../../components/teacher-catalog/TeacherCatalog";

import { getAllTeachers, getTeachersPage } from "../../firebase/teachers";

import type { Teacher } from "../../types/teacher";


const PAGE_SIZE = 4;

const TeachersPage = () => {
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);

  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [lastKey, setLastKey] = useState<string | null>(null);

  const [hasMore, setHasMore] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Find Language Teachers | LearnLingo";

    const metaDescription = document.querySelector(
      'meta[name="description"]',
    );

    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Browse and filter online language teachers by language, level, and lesson price.",
      );
    }
  }, []);
  
  useEffect(() => {
    const loadInitialTeachers = async () => {
      try {
        setIsLoading(true);

        const [allTeachersData, firstPage] = await Promise.all([
          getAllTeachers(),
          getTeachersPage(PAGE_SIZE),
        ]);

        setAllTeachers(allTeachersData);

        setTeachers(firstPage.teachers);

        setLastKey(firstPage.lastKey);

        setHasMore(firstPage.teachers.length < allTeachersData.length);
      } catch (error) {
        console.error("Failed to load teachers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialTeachers();
  }, []);

  const handleLoadMore = async () => {
    if (!lastKey || !hasMore) {
      return;
    }

    const nextPage = await getTeachersPage(PAGE_SIZE, lastKey);

    const loadedTeachersCount = teachers.length + nextPage.teachers.length;

    setTeachers((previousTeachers) => [
      ...previousTeachers,
      ...nextPage.teachers,
    ]);

    setLastKey(nextPage.lastKey);

    setHasMore(loadedTeachersCount < allTeachers.length);
  };

  return (
    <TeacherCatalog
      teachers={teachers}
      filterTeachers={allTeachers}
      isLoading={isLoading}
      hasMoreFromDatabase={hasMore}
      onLoadMoreRequest={handleLoadMore}
      emptyMessage="No teachers match the selected filters."
    />
  );
};

export default TeachersPage;
