import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Header from "components/Header";
import Home from "components/Home/Home";
import { Switch, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route to="/" component={Home} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
