const Header = ({ showAbout, onToggleAbout, onAnalyse, showAboutButton = true }) => (
  <div className="bg-blue-950">
    <header className="container mx-auto text-white flex items-center justify-between px-8 py-3">
      <div className="flex items-center">
        <span className="font-bold text-xl">
          <span className="text-red-700">S</span>mart Resume Analyser
        </span>
      </div>

      <nav className="flex items-center space-x-4">
        {showAboutButton && (
          <button
            onClick={onToggleAbout}
            className="font-medium hover:underline flex items-center space-x-1"
          >
            <span>About Us</span>
            <span
              className={`transition-transform duration-200 ${
                showAbout ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>
        )}

        <button
          onClick={onAnalyse}
          className="bg-purple-600 hover:bg-purple-500 font-semibold py-1 px-4 rounded-lg flex items-center space-x-2"
        >
          <span>★</span>
          <span>Get a free resume review</span>
        </button>
      </nav>
    </header>
  </div>
);

export default Header;
