import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/Home/HomePage";
import { MinhasPlaylistsPage } from "./pages/MinhasPlaylists/MinhasPlaylistsPage";
import { HistoryPage } from "./pages/History/HistoryPage"; 
import { MovieDetailsPage } from "./pages/MovieDetails/MovieDetailsPage";
import { Register } from "./pages/Register/register";
import { AccountPage } from "./pages/Account/AccountPage";
import type { Movie } from "./types";

function App() {
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Set the currentUserId to "1" to match Carlos (from the seeded database), ensuring full BDD/manual testing compatibility
  const currentUserId = "1";

  return (
    <Routes>
      {/* 1. ROTA DE CADASTRO */}
      <Route
        path="/register"
        element={
          <Register 
            onGoToHome={() => navigate("/")} 
          />
        }
      />

      {/* 2. ROTA DA HOME */}
      <Route
        path="/"
        element={
          <div>
            <button 
              onClick={() => navigate("/register")} 
              style={{ margin: '20px', padding: '10px', background: '#FBBF24', color: 'black', fontWeight: 'bold', cursor: 'pointer', border: 'none', borderRadius: '4px', position: 'absolute', zIndex: 50 }}
            >
              Ir para Cadastro 👤
            </button>

            <HomePage
              userId={currentUserId}
              onGoToPlaylists={() => navigate("/playlists")}
              onGoToHome={() => navigate("/")}
              onGoToHistory={() => navigate("/history")}
              onSelectMovie={(movie) => {
                setSelectedMovie(movie);
                navigate(`/movies/${movie.id}`);
              }}
              onGoToProfile={() => navigate("/perfil")}
            />
          </div>
        }
      />

      {/* 3. RESTANTE DAS ROTAS DA EQUIPA */}
      <Route
        path="/playlists"
        element={
          <MinhasPlaylistsPage
            userId={currentUserId}
            onGoToHome={() => navigate("/")}
          />
        }
      />
      <Route
        path="/history"
        element={
          <HistoryPage
            userId={currentUserId}
            onGoToHome={() => navigate("/")}
            onGoToPlaylists={() => navigate("/playlists")}
            onGoToHistory={() => navigate("/history")}
            onGoToProfile={() => navigate("/perfil")}
          />
        }
      />
      <Route
        path="/movies/:id"
        element={
          selectedMovie ? (
            <MovieDetailsPage
              movie={selectedMovie}
              userId={currentUserId}
              onGoToHome={() => navigate("/")}
            />
          ) : (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
              <p className="text-gray-400 font-semibold text-lg">Filme não selecionado.</p>
              <button 
                onClick={() => navigate("/")} 
                className="px-6 py-2 bg-[#FFC107] text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Voltar para a Página Principal
              </button>
            </div>
          )
        }
      />
      <Route
        path="/perfil"
        element={
          <AccountPage
            userId={currentUserId}
            onGoToHome={() => navigate("/")}
            onGoToPlaylists={() => navigate("/playlists")}
            onGoToHistory={() => navigate("/history")}
            onLogout={() => {
              console.log("Logout executado");
              navigate("/");
            }}
          />
        }
      />
    </Routes>
  );
}

export default App;