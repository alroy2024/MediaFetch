import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { authenticate } from '../services/auth';

function Login() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [login, setLogin] = useState(false)
    const [formErrors, setFormErrors] = useState<string[]>([]);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormErrors([]);

        try {
            const { response, data } = await authenticate(username, password, email, login);
            if (!response.ok) {
                setFormErrors(data.message.split(","));
                return
            }
            localStorage.setItem("token", data.token);
            navigate("/Home")
        }
        catch {
            setFormErrors(["Cannot connect to the server"]);
        }
    }
    return (
        <div className="flex items-center justify-center text-slate-100 w-full">
            <div className="bg-slate-905 bg-slate-900 p-8 rounded-2xl shadow-xl w-full border border-slate-800/80">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <h1 className="text-2xl font-bold text-center text-white tracking-tight">
                        {login ? 'Sign in to MediaFetch' : 'Create your account'}
                    </h1>

                    <div>
                        <label className="block text-slate-400 font-semibold text-xs uppercase tracking-wider mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-950/60 hover:bg-slate-950 transition-all text-sm text-white"
                            placeholder="e.g. janesmith"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 font-semibold text-xs uppercase tracking-wider mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-950/60 hover:bg-slate-950 transition-all text-sm text-white"
                            placeholder="••••••••"
                        />
                    </div>

                    {!login && (
                        <div>
                            <label className="block text-slate-400 font-semibold text-xs uppercase tracking-wider mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-950/60 hover:bg-slate-950 transition-all text-sm text-white"
                                placeholder="name@example.com"
                            />
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-600/10 cursor-pointer hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98]"
                        >
                            {login ? 'Sign In' : 'Register Account'}
                        </button>
                        
                        <p className="text-center mt-4">
                            <button
                                type="button"
                                onClick={() => { setLogin(!login); setFormErrors([]); }}
                                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline focus:outline-none"
                            >
                                {login ? "New here? Create a new account" : "Already have an account? Sign in"}
                            </button>
                        </p>
                    </div>
                </form>

                {formErrors.length > 0 && (
                    <div className="mt-5 p-4 bg-rose-950/40 border border-rose-900/50 text-rose-200 rounded-xl text-xs">
                        <ul className="list-disc pl-4 space-y-1">
                            {formErrors.map((error, index) => (
                                <li key={index} className="font-medium">{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Login