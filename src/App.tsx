import { Outlet } from "react-router-dom";
import NavHeader from "./components/NavHeader";

const App: React.FC = () => {
  const supportLink = {
    name: "Támogasd a Tilos Rádiót!",
    url: "https://tilos.hu/tamogatas",
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <header className="bg-card border-b border-border shadow-sm">
        <NavHeader />
        <a
          href={supportLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-main hover:bg-main text-background font-bold text-center py-2 px-4 transition-colors duration-200 underline"
        >
          💰 {supportLink.name} ❤️
        </a>
      </header>
      <main className="container mx-auto px-2 py-2">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 fixed bottom-0 w-full">
        <div className="container mx-auto px-2 py-2">
          <div className="text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Tilos Rádió.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
