import { useEffect, useState } from "react";

import TeacherCatalog from "../../components/teacher-catalog/TeacherCatalog";

import { useAuth } from "../../context/useAuth";

import { getFavorites } from "../../firebase/favorites";
import { getAllTeachers } from "../../firebase/teachers";

import type { Teacher } from "../../types/teacher";

const FavoritesPage = () => {
  const { user } = useAuth();

  const [favoriteTeachers, setFavoriteTeachers] = useState<Teacher[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadFavorites = async () => {
      try {
        const [teachers, favoriteIds] = await Promise.all([
          getAllTeachers(),
          getFavorites(user.uid),
        ]);

        const favorites = teachers.filter((teacher) =>
          favoriteIds.includes(teacher.id),
        );

        setFavoriteTeachers(favorites);
      } catch (error) {
        console.error("Failed to load favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  const handleFavoriteChange = (teacherId: string, isFavorite: boolean) => {
    if (isFavorite) {
      return;
    }

    setFavoriteTeachers((previousTeachers) =>
      previousTeachers.filter((teacher) => teacher.id !== teacherId),
    );
  };

  return (
    <TeacherCatalog
      teachers={favoriteTeachers}
      filterTeachers={favoriteTeachers}
      isLoading={isLoading}
      onFavoriteChange={handleFavoriteChange}
      emptyMessage="You have no favorite teachers matching the selected filters."
    />
  );
};

export default FavoritesPage;
