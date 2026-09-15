import { useEffect } from "react";
import { getTeachers } from "../../firebase/teachers";

const TeachersPage = () => {
  useEffect(() => {
    const loadTeachers = async () => {
      const data = await getTeachers();
      console.log(data);
    };

    loadTeachers();
  }, []);

  return <h1>Teachers</h1>;
};

export default TeachersPage;