import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Login } from '../Login/Login.js';
import { Dashboard } from '../Dashboard/Dashboard.js';
import { useToken } from '../../api/useToken.js';
import { NavBar } from './NavBar.js';
import { Logs } from '../Logs/Logs.js';
import { Transactions } from '../Transactions/Transactions.js';
import { ToastContainer } from 'react-toastify';

export function App() {
  const { token, setToken } = useToken();

  return (
    <div style={{ backgroundColor: "#333", height: "100%" }}>
      <BrowserRouter>
        {!token ?
          <Login setToken={setToken} /> :
          <div>
            <NavBar setToken={setToken}/>
            <Switch>
              <Route exact path={["/dashboard","/"]}>
                <Dashboard setToken={setToken}/>
              </Route>
              <Route path="/logs">
                <Logs/>
              </Route>
              <Route path="/transactions">
                <Transactions/>
              </Route>
            </Switch>
          </div>
        }
      </BrowserRouter>
      <ToastContainer/>
    </div>
  );
}
