import Login from "./components/Login";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-800 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col md:flex-row">

        {/* Left Section */}
        <div className="flex-1 p-10 flex flex-col justify-center text-white">
          <h1 className="text-5xl font-bold mb-4">
            Media<span className="text-red-400">Fetch</span>
          </h1>

          <p className="text-gray-300 text-lg max-w-md">
            Stay updated with new releases, track ongoing series,
            and never lose your watch progress.
          </p>

          <div className="mt-8 flex gap-3 flex-wrap">
            <span className="px-4 py-2 bg-sky-400 rounded-full text-sm font-medium hover:bg-red-500">
              New Releases
            </span>
            <span className="px-4 py-2 bg-sky-400 rounded-full text-sm font-medium hover:bg-red-500">
              Episode Tracking
            </span>
            <span className="px-4 py-2 bg-sky-400 rounded-full text-sm font-medium hover:bg-red-500">
              Progress Sync
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 bg-white p-2 md:p-4 flex justify-center">
          <Login />
        </div>

      </div>
    </div>
  );
}

export default App;