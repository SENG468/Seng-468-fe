import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Grid, Loader, Segment, Dimmer, Header, Divider, Button, Form, Card, CardDescription } from 'semantic-ui-react';
import { api } from '../../api/api';
import { FundsModal } from "./fundsModal.js"
import './dashboard.css';

export function Dashboard({ setToken }) {
  const history = useHistory();

  const [account, setAccount] = useState({});
  const [loading, setLoading] = useState('');
  const [fundsModal, setFundsModal] = useState(false);
  const [stockSymbol, setStockSymbol] = useState('');
  const [validSymbol, setValidSymbol] = useState(true);
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    async function getAccount() {
      try {
        setLoading('Account');
        let userAccount = await api.getAccount();
        setAccount(userAccount);
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
      let quote = await api.getQuote(stockSymbol);
      manageQuotes(quote);
    } catch (e) {
      toast.error("Error Fetching Quote.");
      console.log('Error fetching quote.' + e);
    }
    setLoading('');
  }

  function manageQuotes(quote) {
    let quotesArr = [...quotes];
    quotesArr.unshift({
      symbol: stockSymbol,
      price: quote[stockSymbol]
    });
    if (quotesArr.length >= 7) {
      quotesArr.pop();
    }
    setStockSymbol('');
    setQuotes(quotesArr);
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
          <Grid.Column width={10} verticalAlign="top">
            <Header color="teal" as="h1" content="Investing Account" />
            <Divider />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Header inverted color="grey" as="h3" content={`Available Cash: $${account.balance}`} />
              <Button color="teal" content="Add Funds" onClick={() => setFundsModal(true)} />
            </div>
            <Divider />
            <Header inverted color="grey" as="h3" content="Portfolio" />
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
                type="text"
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
            <Divider />
            <Card.Group color="green" centered items={quotes.map((quote, i) => {
              return {
                children: <div style={{margin: "10px"}}>
                  <Header content={quote.symbol} color="teal" />
                  <CardDescription content={`Price: $${quote.price}`} />
                </div>,
                color: 'teal',
                fluid: true,
                className: "quote-cards",
                key: i
              }
            })} />
          </Grid.Column>
        </Grid>
        <FundsModal updateAccount={(updatedAccount) => setAccount(updatedAccount)} account={account} open={fundsModal} handleClose={() => setFundsModal(false)} />
      </Segment>
    </div>
  )
}
