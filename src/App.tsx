import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import SignUp from "./components/auth/Signup";
import SignIn from "./components/auth/Signin";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route element={<RequireAuth isAuthenticated={false} />}> */}
          <Route path="signup" element={<SignUp />} />
          <Route path="/" element={<SignIn />} />
          {/* </Route>
          <Route element={<RequireAuth isAuthenticated={true} />}>
            <Route path="home" element={<Home />} />
          </Route> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
