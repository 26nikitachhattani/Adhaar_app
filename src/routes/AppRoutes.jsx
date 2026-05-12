import {
    Routes,
    Route,
    Navigate
  } from "react-router-dom"
  
  import Home from "../pages/Home"
  import About from "../pages/About"
  import Login from "../pages/Login"
  
  
  function AppRoutes() {
  
    const isLoggedIn = true
  
    return (
      <Routes>
  
        <Route
          path="/"
          element={<Home />}
        />
  
        <Route
          path="/about"
          element={<About />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
  
        <Route
          path="/dashboard"
          element={
            isLoggedIn
              ? <Home />
              : <Navigate to="/login" />
          }
        />
  
      </Routes>
    )
  }
  
  export default AppRoutes