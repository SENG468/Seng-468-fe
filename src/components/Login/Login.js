import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Dimmer, Form, Grid, Header, Image, Loader, Message, Segment } from 'semantic-ui-react'
import { toast } from 'react-toastify';
import { api } from '../../api/api';


export function Login({ setToken }) {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [invalidEmail, setInvalidEmail] = useState(true);
  const [securityWord, setSecurityWord] = useState('');
  const [signup, setSignup] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const history = useHistory();

  useEffect(() => {
    function validateEmail() {
      // yummy
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (email.match(re) || email === '') {
        setInvalidEmail(false);
      } else {
        setInvalidEmail(true);
      }
    }
    validateEmail()
  }, [email])

  useEffect(() => {
    clearInputs();
  }, [signup]);

  async function handleLogin() {
    try {
      setLoadingLogin(true);
      const request = {
        'username': username,
        'password': password
      };
      const token = await api.userLogin(request);
      console.log(token)
      setLoadingLogin(false);
      setToken(token);
      history.push("/dashboard");
    } catch (e) {
      toast.error("Invalid log-in credentials");
      clearInputs();
      console.log("Invalid Login credentials");
      setLoadingLogin(false);
    }
  }

  async function userSignup() {
    try {
      setLoadingRegister(true);
      const request = {
        'username': username,
        'password': password,
        'email': email,
        'securityCode': securityWord
      };
      await api.userSignup(request);
      await sleep(500);
      setLoadingRegister(false);
      handleLogin();
    } catch (e) {
      toast.error("Username already in use.");
      clearInputs();
      console.log(e);
      setLoadingRegister(false);
    }
  }

  function clearInputs() {
    setPassword('');
    setUserName('');
    setEmail('');
    setSecurityWord('');
    setInvalidEmail(false);
  }

  function enableSubmit() {
    if (signup) {
      return username === '' || password === ''
        || securityWord === '' || email === ''
        || invalidEmail
    } else {
      return username === '' || password === ''
    }
  }

  return (
    <div>
      <Segment inverted>
        <Dimmer active={loadingLogin || loadingRegister}>
          <Loader>{signup ? "Creating Account..." : "Logging In..."}</Loader>
        </Dimmer>
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='teal' textAlign='center'>
              <Image spaced='right' src={signup ? '/favicon_io/rocket-192x192.png' : '/favicon_io/diamond-192x192.png'}/>
              {signup ? " Sign Up To Start Trading! " : " Login To Your Account "}
              <Image spaced='left' src={signup ? '/favicon_io/rocket-192x192.png' : '/favicon_io/diamond-192x192.png'} />
            </Header>
            <Form size='large'>
              <Segment stacked>
                <Form.Input
                  fluid
                  icon='user'
                  iconPosition='left'
                  placeholder='Username'
                  value={username}
                  onChange={e => setUserName(e.target.value)}
                />
                {signup ?
                  <div>
                    <Form.Input
                      fluid
                      icon='mail'
                      iconPosition='left'
                      placeholder='E-mail address'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      error={invalidEmail ? "Invalid Email" : false}
                    />
                    <Form.Input
                      fluid
                      icon='lock'
                      iconPosition='left'
                      placeholder='Security Phrase'
                      value={securityWord}
                      onChange={e => setSecurityWord(e.target.value)}
                    />
                    <br />
                  </div>
                  : ""}
                <Form.Input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                />
                {signup ?
                  <Button
                    fluid
                    content="Sign Up"
                    color='teal'
                    size='large'
                    disabled={enableSubmit()}
                    onClick={() => userSignup()}
                  /> :
                  <Button
                    fluid
                    content="Login"
                    color='teal'
                    size='large'
                    disabled={enableSubmit()}
                    onClick={() => handleLogin()}
                  />
                }
              </Segment>
            </Form>
            <Message>
              {signup ?
                "Already have an account? " :
                "Don't have an account? "}
              <Button
                content={signup ? 'Login' : 'Sign Up'}
                type='text'
                onClick={() => setSignup(!signup)} />
            </Message>
          </Grid.Column>
        </Grid>
      </Segment>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
