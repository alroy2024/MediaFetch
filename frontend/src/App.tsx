import { Link } from 'react-router-dom';

function App() {

  return (
    <>
    <div className=" h-screen flex justify-center items-center gap-10">
      <h1 className="text-red-400 text-xl">Welcome to MediaFetch</h1>
      <Link to="/login" >Click Me</Link>
    </div>

    </>
  )
}

export default App
