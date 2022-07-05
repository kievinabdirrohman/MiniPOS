import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import SignUp from "./components/auth/Signup";
import SignIn from "./components/auth/Signin";
import Home from "./components/dashboard/Home";
import { PrivateOutlet, PublicOutlet } from "./components/AuthMiddleware";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicOutlet />}>
            <Route path="signup" element={<SignUp />} />
            <Route path="/" element={<SignIn />} />
          </Route>
          <Route element={<PrivateOutlet />}>
            <Route path="home" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
