import { router } from "./routes/routes";
import { RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css'

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_LOGIN_GOOGLE}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  )
}

export default App