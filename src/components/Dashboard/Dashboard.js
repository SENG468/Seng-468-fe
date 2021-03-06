import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Grid, Loader, Segment, Dimmer, Header, Divider, Button, Form } from 'semantic-ui-react';
import { api } from '../../api/api';
import './dashboard.css';

export function Dashboard({ setToken }) {
  const history = useHistory();

  const [account, setAccount] = useState({});
  const [loading, setLoading] = useState('');
  const [fundsModal, setFundsModal] = useState(false);
  const [stockSymbol, setStockSymbol] = useState('');
  const [validSymbol, setValidSymbol] = useState(true);

  useEffect(() => {
    async function getAccount() {
      try {
        setLoading('Account');
        let userAccount = await api.getAccount();
        setAccount(userAccount);
        console.log(userAccount);
        setLoading('');
      } catch (e) {
        toast.error("Error Fetching User Account.");
        console.log("Error Fetching User Account. Possible bad JWT, you will be logged out." + e);
        setLoading('');
      }
    };
    getAccount();
  }, []);

  useEffect(() => {
    function validateEmail() {
      let isValid = stockSymbol.length < 4;
      setValidSymbol(isValid);
    }
    validateEmail();
  }, [stockSymbol]);

  async function handleQuoteFetch() {
    try {
      setLoading('Quote');
      // Make call to quote endpoint
      console.log('Get Quote')
      setLoading('');
    } catch (e) {

    }
  }

  async function handleAddFunds() {
    try {
      setLoading('Deposit');
      // Make call to quote endpoint
      console.log('Adding Funds.')
      setLoading('');
    } catch (e) {

    }
  }

  function handleLogout() {
    setToken("");
    sessionStorage.removeItem('access_token');
    history.push('/');
  }

  return (
    <div style={{ padding: "20px" }}>
      <Segment raised padded inverted>
        <Dimmer active={loading !== ''}>
          <Loader>{`Loading ${loading}...`}</Loader>
        </Dimmer>
        <Grid divided columns={2}>
          <Grid.Column width={10} verticalAlign="middle">
            <Header color="teal" as="h1" content="Investing Account" />
            <Divider />
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
            <Header inverted color="grey" as="h3" content={`Available Cash: $${account.balance}`}/>
            <Button color="teal" content="Add Funds" onClick={() => handleAddFunds()}/>
            </div>
            <Divider />
            <Header inverted color="grey" as="h3" content="Portfolio"/>
          </Grid.Column>
          <Grid.Column width={6}>
            <Header color="teal" as="h1" content="Get Quote" />
            <Divider />
            <Form>
              <Form.Input
                fluid
                icon="search"
                iconPosition="left"
                placeholder="Stock Symbol"
                value={stockSymbol}
                onChange={e => setStockSymbol(e.target.value)}
                error={validSymbol ? false : "Symbol too long."}
                action={{
                  color: "teal",
                  labelPosition: "right",
                  icon: "search",
                  content: "Quote",
                  disabled: !(stockSymbol.length > 0 && stockSymbol.length < 4),
                  onClick: () => handleQuoteFetch(),
                }}
              />
            </Form>
          </Grid.Column>
        </Grid>
      </Segment>
    </div>
  )
}
