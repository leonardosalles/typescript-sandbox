const mockUser = {
  name: "Leonardo Salles",
  email: "leo@example.com",
};

export default function Header() {
  return (
    <header className="bg-white shadow z-50 relative">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/">
          <h1 className="text-2xl font-bold">My Store</h1>
        </a>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Hello, {mockUser.name}</span>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
