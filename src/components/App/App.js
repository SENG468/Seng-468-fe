import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from '../Login/Login.js';
import Dashboard from '../Dashboard/Dashboard.js';
import useToken from '../../api/useToken';
import About from '../About/About';

function App() {

  const { token, setToken } = useToken()

  if (!token) {
    return (
      <Login setToken={setToken} />
    );
  }

  return (
    <div className="App">
      <h1>Application</h1>
      <BrowserRouter>
        <Switch>
          <Route path={["/dashboard", "/"]}>
            <Dashboard />
          </Route>
          <Route path="/about">
            <About />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
