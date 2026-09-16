import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/private-route/PrivateRoute";

import Header from "./components/header/Header";
import Loader from "./components/loader/Loader";

import { useAuth } from "./context/useAuth";

const HomePage = lazy(() => import("./pages/HomePage/HomePage"));

const TeachersPage = lazy(() => import("./pages/TeachersPage/TeachersPage"));

const FavoritesPage = lazy(() => import("./pages/FavoritesPage/FavoritesPage"));

function App() {
  const { loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <>
      <Header />

      <Suspense
        fallback={
          <div
            style={{
              minHeight: "70vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loader size={120} />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/teachers" element={<TeachersPage />} />

          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <FavoritesPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
