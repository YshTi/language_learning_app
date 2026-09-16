import { Route, Routes } from "react-router-dom";

import Header from "./components/header/Header";

import HomePage from "./pages/HomePage/HomePage";
import TeachersPage from "./pages/TeachersPage/TeachersPage";
import FavoritesPage from "./pages/FavoritesPage/FavoritesPage";

import { useAuth } from "./context/useAuth";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <>
      <Header />

      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/teachers"
          element={<TeachersPage />}
        />

        <Route
          path="/favorites"
          element={<FavoritesPage />}
        />
      </Routes>
    </>
  );
}

export default App;