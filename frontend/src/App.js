import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard, Login, NotFound } from "./pages";
import { Main } from "./layouts";
import Register from "./pages/Register";
import Mcqs from "./pages/Mcqs";


function App() {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('role') === 'Admin';

  return (<BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      {token !== null ? (
        <Route path="/" element={<Main isAdmin={isAdmin} />}> {/* Pass isAdmin to Main */}
          <Route exact path="/" element={<Dashboard />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          {isAdmin && <Route exact path="/mcqs" element={<Mcqs />} />}{/* Show if isAdmin */}
          {isAdmin && <Route exact path="/register" element={<Register />} />} {/* Show if isAdmin */}
        </Route>
      ) : (
        <>
          <Route exact path="*" element={<NotFound />} />
        </>
      )}
      <Route path="*" element={<NotFound />} />
      {/* <Route path="/500" element={<SomethingWentWrong />} /> */}
    </Routes>
  </BrowserRouter>
  );
}

export default App;
