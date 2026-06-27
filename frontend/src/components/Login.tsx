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
        <>
            <div className=" flex items-center justify-center">
                <div className="bg-white p-4 rounded-2xl shadow-xl w-96 border border-slate-200">
                    <form onSubmit={handleSubmit}>
                        <h1 className="text-2xl font-bold text-center text-slate-800 mb-8">
                            {login ? 'Login' : 'Sign Up'}
                        </h1>

                        <label className="block text-slate-700 font-small mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-2 mb-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                        />

                        <label className="block text-slate-700 font-small mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 mb-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                        />

                        {!login && (
                            <>
                                <label className="block text-slate-700 font-small mb-2">
                                    Gmail
                                </label>
                                <input
                                    type="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 mb-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                                />
                            </>)}


                        <div className="mt-1">

                            <button type="submit" className="w-full px-6 py-2 rounded-lg bg-sky-500 hover:bg-green-600 text-white transition-all duration-300 cursor-pointer font-semibold shadow-md hover:shadow-lg">
                                {login ? 'Login' : 'Sign Up'}
                            </button>
                            <p className="text-sky-600 text-center mt-3 ">
                                <button
                                    type="button"
                                    onClick={() => { setLogin(!login); setFormErrors([]); }}
                                    className="font-medium hover:underline focus:outline-none"
                                >
                                    {login ? 'Create a new account' : 'Already have an account?'}
                                </button>
                            </p>
                        </div>
                    </form>
                    {formErrors.length > 0 && (
                        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }} >
                                {formErrors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Login