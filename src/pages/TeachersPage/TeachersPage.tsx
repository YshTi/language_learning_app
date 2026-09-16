import {
  useEffect,
  useState,
} from "react";

import TeacherCatalog from "../../components/teacher-catalog/TeacherCatalog";

import { getAllTeachers } from "../../firebase/teachers";

import type { Teacher } from "../../types/teacher";

const TeachersPage = () => {
  const [teachers, setTeachers] =
    useState<Teacher[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        setIsLoading(true);

        const data = await getAllTeachers();

        setTeachers(data);
      } catch (error) {
        console.error(
          "Failed to load teachers:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadTeachers();
  }, []);

  return (
    <TeacherCatalog
      teachers={teachers}
      isLoading={isLoading}
      emptyMessage="No teachers match the selected filters."
    />
  );
};

export default TeachersPage;