import { useNavigate } from 'react-router-dom';
import { useState } from 'react'

function Login() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [login , setLogin] = useState(false)

    const handlesubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (login) {
            console.log('Logging in with:', username, password)
            navigate('/Home')
        }
        else {
            console.log('Signing up with:', username, password,email)
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, email })
            })
            const data = await response.text()
            console.log('Response:', data)
            setLogin(true)
        }
    }
    return (
        <>
            <div className=" flex items-center justify-center">
                <div className="bg-white p-4 rounded-2xl shadow-xl w-96 border border-slate-200">
                    <form onSubmit={handlesubmit}>
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

                        <label className="block text-slate-700 font-small mb-2">
                            Gmail
                        </label>
                        <input
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 mb-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                        />


                        <div className="mt-1">

                            <button type="submit" className="w-full px-6 py-2 rounded-lg bg-sky-500 hover:bg-green-600 text-white transition-all duration-300 cursor-pointer font-semibold shadow-md hover:shadow-lg">
                            {login ? 'Login' : 'Sign Up'}
                            </button>
                            <p className="text-sky-600 text-center mt-3 ">
                                <button
                                    type="button"
                                    onClick={() => setLogin(!login)}
                                    className="font-medium hover:underline focus:outline-none"
                                >
                                    {login ? 'Create a new account' : 'Already have an account?'}
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login