import { useEffect, useState } from 'react';
import { MovieCard } from './components/MovieCard';
import { Register } from './pages/register'; // 1. Importe a sua tela de cadastro aqui
import api from './services/api'; // 2. Importe a sua configuração do Axios
import './App.css';
import type { Movie } from './types';
import cinema_logo from './assets/cinema_logo.png';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Estado simples para controlar qual tela estamos vendo ('home' ou 'register')
  const [currentView, setCurrentView] = useState<'home' | 'register'>('home');

  useEffect(() => {
    // 3. Substituímos o fetch nativo pela nossa instância isolada do Axios (api)
    api.get('/movies')
      .then(response => {
        setMovies(response.data);
      })
      .catch(err => {
        console.error(err);
        setError('Erro ao buscar filmes do catálogo.');
      });
  }, []);

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <img src={cinema_logo} width='200' alt="Logo Cinema"></img>
        
        {/* 4. Botão temporário para alternar entre as telas e testar seu frontend */}
        <button 
          onClick={() => setCurrentView(currentView === 'home' ? 'register' : 'home')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#e50914',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {currentView === 'home' ? 'Ir para Cadastro 👤' : 'Ver Catálogo de Filmes 🎬'}
        </button>
      </header>

      {/* 5. Renderização Condicional baseada na tela selecionada */}
      {currentView === 'register' ? (
        // Se a visualização atual for register, exibe a tela de cadastro
        <Register />
      ) : (
        // Caso contrário, exibe o catálogo de filmes padrão
        <>
          {error && <p className="error">❌ {error}</p>}

          <div className="movie-grid">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;