import { useState } from "react";
import "./App.css";
import { HomePage } from "./pages/Home/HomePage";
import { MinhasPlaylistsPage } from "./pages/MinhasPlaylists/MinhasPlaylistsPage";
import { Register } from "./pages/Register/register"; // 1. Importe a sua tela novamente

// 2. Adicione "register" às opções de páginas permitidas
type CurrentPage = "home" | "playlists" | "register";

function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>("home");

  const currentUser = {
    id: "Victoria",
    name: "Victoria",
  };

  // 3. Renderização da sua tela de cadastro
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

  return (
    <div>
      {/* Botão provisório para você testar a sua tela */}
      <button onClick={() => setCurrentPage("register")} style={{ margin: '20px', padding: '10px', background: '#e50914', color: 'white', cursor: 'pointer' }}>
        Ir para Cadastro 
      </button>
      
      <HomePage
        userId={currentUser.id}
        onGoToPlaylists={() => setCurrentPage("playlists")}
      />
    </div>
  );
}

export default App;