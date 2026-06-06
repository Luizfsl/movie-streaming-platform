import { useState } from "react";
import "./App.css";
import { HomePage } from "./pages/Home/HomePage";
import { MinhasPlaylistsPage } from "./pages/MinhasPlaylists/MinhasPlaylistsPage";
import { HistoryPage } from "./pages/History/HistoryPage"; 
import { MovieDetailsPage } from "./pages/MovieDetails/MovieDetailsPage";
import { Register } from "./pages/Register/register"; // 1. IMPORTAÇÃO ADICIONADA
import type { Movie } from "./types";

// 2. ADICIONADO "register" NAS OPÇÕES DE TELA
type CurrentPage = "home" | "playlists" | "history" | "movie-details" | "register";

function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>("home");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const currentUser = {
    id: "Victoria",
    name: "Victoria",
  };

  // Renderização da sua tela de cadastro
  if (currentPage === "register") {
    return (
      <div style={{ padding: '20px' }}>
        <button onClick={() => setCurrentPage("home")}>⬅ Voltar para Home</button>
        <Register />
      </div>
    );
  }

  if (currentPage === "playlists") {
    return (
      <MinhasPlaylistsPage
        userId={currentUser.id}
        onGoToHome={() => setCurrentPage("home")}
      />
    );
  }

  if (currentPage === "history") {
    return (
      <HistoryPage
        onGoToHome={() => setCurrentPage("home")}
        onGoToPlaylists={() => setCurrentPage("playlists")}
        onGoToHistory={() => setCurrentPage("history")}
      />
    );
  }
  
  if (currentPage === "movie-details" && selectedMovie) {
    return (
      <MovieDetailsPage
        movie={selectedMovie}
        userId={currentUser.id}
        onGoToHome={() => setCurrentPage("home")}
      />
    );
  }

  // 3. RETORNADO O BOTÃO E ENVOLVIDO TUDO NUMA DIV
  return (
    <div>
      <button 
        onClick={() => setCurrentPage("register")} 
        style={{ margin: '20px', padding: '10px', background: '#FBBF24', color: 'black', fontWeight: 'bold', cursor: 'pointer', border: 'none', borderRadius: '4px' }}
      >
        Ir para Cadastro 👤
      </button>

      <HomePage
        userId={currentUser.id}
        onGoToPlaylists={() => setCurrentPage("playlists")}
        onGoToHome={() => setCurrentPage("home")}
        onGoToHistory={() => setCurrentPage("history")}
        onSelectMovie={(movie) => {
          setSelectedMovie(movie);
          setCurrentPage("movie-details");
        }}
      />
    </div>
  );
}

export default App;