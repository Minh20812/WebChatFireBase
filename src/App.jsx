import Routers from "./routers/Routers.jsx";
import React from "react";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routers />
      </BrowserRouter>
    </>
  );
};

export default App;
