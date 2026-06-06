import { useState } from "react";
import { Header } from "../../components/Header";
import "./HistoryPage.css";

interface HistoryPageProps {
  onGoToHome: () => void;
  onGoToPlaylists: () => void;
  onGoToHistory: () => void;
}

interface HistoryItem {
  id: number;
  date: string;
  title: string;
}

export function HistoryPage({ onGoToHome, onGoToPlaylists, onGoToHistory }: HistoryPageProps) {
  // Lista inicial com dados fictícios baseada nos seus componentes de filmes
  const [historyList, setHistoryList] = useState<HistoryItem[]>([
    { id: 1, date: "21/05/2026", title: "O Poderoso Chefão" },
    { id: 2, date: "02/05/2026", title: "Casablanca" },
    { id: 3, date: "02/05/2026", title: "Cantando na Chuva" },
    { id: 4, date: "01/05/2026", title: "Psicose" },
    { id: 5, date: "26/04/2026", title: "13 Going on 30" },
    { id: 6, date: "26/04/2026", title: "Twilight" },
  ]);

  function handleHideItem(id: number) {
    setHistoryList(prev => prev.filter(item => item.id !== id));
  }

  function handleHideAll() {
    setHistoryList([]);
  }

  return (
    <div className="home-page">
      <Header 
        activePage="history" 
        onGoToHome={onGoToHome}
        onGoToPlaylists={onGoToPlaylists}
        onLogout={() => console.log("Usuário deslogado do histórico")}
        onGoToHistory={onGoToHistory}
      />

      <main className="home-content">
        <section className="home-hero-history">
          <div className="home-hero-text">
            <p className="home-eyebrow">Usuário</p>
            <h1>Histórico de Filmes</h1>
            <p>Aqui você poderá visualizar todos os filmes que já assistiu.</p>
          </div>
          
          {historyList.length > 0 && (
            <button 
              type="button" 
              className="btn-hide-all-dark"
              onClick={handleHideAll}
            >
              Ocultar tudo
            </button>
          )}
        </section>

        {historyList.length > 0 ? (
          /* Lista com scroll caso fique muito grande */
          <div className="history-scroll-container">
            <div className="history-list-dark">
              {historyList.map((item) => (
                <div key={item.id} className="history-item-row">
                  <span className="history-date">{item.date}</span>
                  <span className="history-title">{item.title}</span>
                  <button 
                    type="button" 
                    className="btn-hide-item-dark"
                    title="Esconder do histórico"
                    onClick={() => handleHideItem(item.id)}
                  >
                    {/* Ícone de Proibido/Ocultar */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Caixa pontilhada original mantendo o seu estilo */
          <div className="history-empty-box">
            Nenhum filme assistido recentemente.
          </div>
        )}
      </main>
    </div>
  );
}