import React from "react";
import "./App.css";
import 'styles/main.scss';
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
