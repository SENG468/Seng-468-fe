import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Grid, Loader, Segment, Dimmer, Header, Divider, Button, Form, Card, CardDescription } from 'semantic-ui-react';
import { api } from '../../api/api';
import { FundsModal } from "../common/fundsModal.js";
import { BuyModal } from "../common/buyModal.js"
import { SellModal } from '../common/sellModal';

import './dashboard.css';

export function Dashboard() {

  const [account, setAccount] = useState({});
  const [loading, setLoading] = useState('');
  const [fundsModal, setFundsModal] = useState(false);
  const [buyModal, setBuyModal] = useState(false);
  const [sellModal, setSellModal] = useState(false);
  const [activeQuote, setActiveQuote] = useState({});
  const [stockSymbol, setStockSymbol] = useState('');
  const [validSymbol, setValidSymbol] = useState(true);
  const [quotes, setQuotes] = useState([]);
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    async function getAccount() {
      try {
        setLoading('Account');
        let userAccount = await api.getAccount();
        console.log(userAccount)
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

  useEffect(() => {
    function managePortfolio() {
      if (account.portfolio) {
        let parsedPortfolio = Object.entries(account.portfolio).map(stock => {
          return {
            symbol: stock[0],
            quantity: stock[1]
          }
        })
        setPortfolio(parsedPortfolio.reverse());
      }
    }
    managePortfolio();
  }, [account])


  async function getStockPrice(symbol) {
    let q =  await api.getQuote(symbol);
    return q[symbol];
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
              <Header inverted color="grey" as="h3" content={`Available Cash: $${account.balance ? (account.balance).toFixed(2) : 0}`} />
              <Button color="teal" content="Add Funds" onClick={() => setFundsModal(true)} />
            </div>
            <Divider />
            <Header inverted color="grey" as="h3" content="Portfolio" />
            <Card.Group color="green" centered items={portfolio.map((stock, i) => {
              return {
                children: <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "10px", verticalAlign: "center" }}>
                  <Header content={stock.symbol} color="teal" />
                  <CardDescription content={`Quantity: ${stock.quantity}`} />
                  <div>
                    <Button onClick={async () => {stock.price = await getStockPrice(stock.symbol); setActiveQuote(stock);setSellModal(true)}} color="grey" floated="right" content="Sell" />
                    <Button onClick={async () => {stock.price = await getStockPrice(stock.symbol); setActiveQuote(stock);setBuyModal(true)}} color="teal" floated="right" content="Buy" />
                  </div>
                </div>,
                color: 'teal',
                fluid: true,
                className: "portfolio-cards",
                key: i
              }
            })} />
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
                children: <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "10px" }}>
                  <Header content={quote.symbol} color="teal" />
                  <CardDescription content={`Price: $${quote.price}`} />
                  <Button color="teal" floated="right" content="Buy" onClick={() => { setActiveQuote(quote); setBuyModal(true) }} />
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
        <BuyModal  quote={activeQuote} updateAccount={(updatedAccount) => setAccount(updatedAccount)} account={account} open={buyModal} handleClose={() => setBuyModal(false)} />
        <SellModal quote={activeQuote} updateAccount={(updatedAccount) => setAccount(updatedAccount)} account={account} open={sellModal} handleClose={() => setSellModal(false)} />
      </Segment>
    </div>
  )
}
