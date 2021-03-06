import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Login } from '../Login/Login.js';
import { Dashboard } from '../Dashboard/Dashboard.js';
import { useToken } from '../../api/useToken.js';
import { About } from '../About/About.js';
import { NavBar } from './NavBar.js';
import { Account } from '../Account/Account.js';
import { Transactions } from '../Transactions/Transactions.js';
import { Orders } from '../Orders/Orders.js';
import { ToastContainer } from 'react-toastify';
import { api as Api } from '../../api/api.js';

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
              <Route exact path={["/dashboard"]}>
                <Dashboard setToken={setToken}/>
              </Route>
              <Route path="/account">
                <Account/>
              </Route>
              <Route path="/orders">
                <Orders/>
              </Route>
              <Route path="/transactions">
                <Transactions/>
              </Route>
              <Route path="/about">
                <About />
              </Route>
            </Switch>
          </div>
        }
      </BrowserRouter>
      <ToastContainer/>
    </div>
  );
}
