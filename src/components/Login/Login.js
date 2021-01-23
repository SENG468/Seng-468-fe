import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { api } from '../../api/api';

import './Login.css';

export default function Login({ setToken }) {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [signup, setSignup] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);

  async function handleLogin() {
    try {
      setLoadingLogin(true);
      const token = await api.userLogin({
        username,
        password
      });
      setLoadingLogin(false);
      setToken(token);
    } catch (e) {
      // Handle various errors (invalid name, pw, timeout, etc)
      console.log(e)
    }
  }

  async function handleCreation() {
    try {
      setLoadingRegister(true);
      const token = await api.registerUser({
        username,
        password
      });
      setLoadingRegister(false);
      setToken(token);
    } catch (e) {
      // Handle various errors (invalid name, pw, timeout, etc)
      console.log(e);
    }
  }

  useEffect(() => {
    setPassword('');
    setUserName('');
  }, [signup]);

  return (
    <div>
      { !loadingLogin && !loadingRegister ?
        <div className='login-wrapper'>
          <h1>{signup ? 'Sign Up' : 'Please Log In'}</h1>
          <form>
            <label>
              <p>Username</p>
              <input type="text" value={username} onChange={e => setUserName(e.target.value)} />
            </label>
            <label>
              <p>Password</p>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </label>
            <div>
              {signup ?
                <button onClick={() => handleCreation()} type="button">{'Sign up'}</button> :
                <button onClick={() => handleLogin()} type="button">{'Login'}</button>
              }
            </div>
          </form>
          <br />
          <p>{signup ? 'Already have an account? Log in' : 'No account? Sign up'}</p>
          <button type='button' onClick={() => setSignup(!signup)}>{signup ? 'Login' : 'Sign Up'}</button>
        </div> :
        loadingLogin ? "Logging in..." : "Registering Account..."
      }

    </div>

  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}
