import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import SignUp from "./components/auth/Signup";
import SignIn from "./components/auth/Signin";
import Home from "./components/dashboard/Home";
import ProductHome from "./components/product/Product";
import CustomerHome from "./components/customer/Customer";
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
            <Route path="product" element={<ProductHome />} />
            <Route path="customer" element={<CustomerHome />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
