import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Notification from "./components/Notification";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/Home",
    element: <Home />
  },
  {
    path: "/Notification",
    element: <Notification />
  }
]);

export default router;