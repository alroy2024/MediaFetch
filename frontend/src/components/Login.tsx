import { Link } from 'react-router-dom';
import { useState } from 'react'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    return (
        <>
            <div className=" flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-96 border border-slate-200">
                    <form>
                        <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">
                            Login
                        </h1>

                        <label className="block text-slate-700 font-medium mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-3 mb-5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                        />

                        <label className="block text-slate-700 font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 mb-6 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                        />

                        <div className="mt-4">
                            <Link to="/Home">
                                <div className="w-full px-6 py-3 rounded-lg bg-sky-500 hover:bg-green-600 text-white transition-all duration-300 cursor-pointer font-semibold shadow-md hover:shadow-lg text-center">
                                    Login In
                                </div>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login