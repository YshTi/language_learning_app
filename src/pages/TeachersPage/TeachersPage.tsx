import { useEffect, useState } from "react";

import { getTeachers } from "../../firebase/teachers";
import styles from "./TeachersPage.module.css";
import Container from "../../components/container/Container";
import TeacherCard from "../../components/teacher-card/TeacherCard";
import type { Teacher } from "../../types/teacher";

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const loadTeachers = async () => {
      const data = await getTeachers();

      setTeachers(data);
    };

    loadTeachers();
  }, []);

  return (
    <main className={styles.teachersPage}>
      <h1>Teachers</h1>

      {teachers.length > 0 && (
        <Container className={styles.teachersContainer}>
          <TeacherCard teacher={teachers[0]} />
        </Container>
      )}
    </main>
  );
};

export default TeachersPage;