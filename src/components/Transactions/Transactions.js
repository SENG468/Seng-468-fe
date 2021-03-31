import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Grid, Loader, Segment, Dimmer, Header, Divider, Card, CardDescription, Button } from 'semantic-ui-react';
import { api } from '../../api/api';
import { CancelModal } from '../common/cancelModal';


export function Transactions() {
  const [loading, setLoading] = useState('Transactions');
  const [summary, setSummary] = useState({});
  const [activeTransaction, setActiveTransaction] = useState({});
  const [cancelModal, setCancelModal] = useState(false);
  const [summaryFlag, setSummaryFlag] = useState(false);

  useEffect(() => {
    async function getSummary() {
      try {
        setLoading('Transactions');
        let summary = await api.getSummary();
        summary.allOpen = summary.openTriggers?.concat(summary.pendingTransactions);
        setSummary(summary);
        setLoading('');
      } catch (e) {
        toast.error('Error fetching account summary.');
        console.log('Error fetching account summary' + e);
        setLoading('');
      }
    };
    getSummary();
  }, [summaryFlag]);

  async function cancelTrigger() {
    try {
      setLoading('order cancel');
      await api.cancelTrigger(activeTransaction.type, activeTransaction.stockCode);
      setSummaryFlag(!summaryFlag);
    } catch (e) {
      toast.error('Failed to cancel order');
      console.log('Failed to cancel order.' + e);
    }
    setCancelModal(false);
    setLoading('');
  }

  function handleCancelModal(transaction) {
    setActiveTransaction(transaction);
    setCancelModal(true);
  }

  function friendlyTime(timestamp) {
    let time = timestamp.split(":", 2);
    let date = time[0].split('T');
    return `${date[1]}:${time[1]}, ${date[0]}`;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Segment raised padded inverted className='main-segment-style'>
        <Dimmer active={loading !== ''}>
          <Loader>{`Loading ${loading}...`}</Loader>
        </Dimmer>
        <Grid divided columns={2}>
          <Grid.Column width={8}>
            <Header color="teal" as="h1" content="Open Transactions" />
            <Divider />
            {summary.allOpen?.length > 0 ?
              <Card.Group color="green" centered items={summary.allOpen.slice(0).reverse().map((transaction, i) => {
                return {
                  children: <div className='portfolio-card-container'>
                    <div style={{ flexBasis: '25%' }}>
                      <CardDescription content={`Type: ${transaction.type}`} />
                      <CardDescription content={`Status: ${transaction.status}`} />
                    </div>
                    <div style={{ flexBasis: '45%' }}>
                      <CardDescription content={`Trigger Order: ${transaction.stockAmount} ${transaction.stockCode} @ ${transaction.unitPrice}`} />
                      <CardDescription content={`Total Amount: $${transaction.cashAmount}`} />
                    </div>
                    {transaction.status === 'PENDING' ?
                      <Button color='grey' content='Cancel' onClick={() => handleCancelModal(transaction)} /> :
                      <CardDescription content={friendlyTime(transaction.createdDate)} />
                    }
                  </div>,
                  color: 'teal',
                  fluid: true,
                  className: "portfolio-cards",
                  key: i
                }
              })} /> : "No Open Transactions"
            }
          </Grid.Column>
          <Grid.Column width={8}>
            <Header color="teal" as="h1" content="Closed Transactions" />
            <Divider />
            {summary.closedTransactions?.length > 0 ?
              <Card.Group color="green" centered items={summary.closedTransactions.slice(0).reverse().map((transaction, i) => {
                return {
                  children: <div className='portfolio-card-container'>
                    <div style={{ flexBasis: '25%' }}>
                      <CardDescription content={`Type: ${transaction.type}`} />
                      <CardDescription content={`Status: ${transaction.status}`} />
                    </div>
                    <div style={{ flexBasis: '45%' }}>
                      <CardDescription content={`Order: ${transaction.stockAmount} ${transaction.stockCode} @ ${transaction.unitPrice}`} />
                      <CardDescription content={`Total Amount: $${transaction.cashAmount}`} />
                    </div>
                    <CardDescription content={friendlyTime(transaction.createdDate)} />
                  </div>,
                  color: 'teal',
                  fluid: true,
                  className: "portfolio-cards",
                  key: i
                }
              })} /> : "No Closed Transactions."
            }
          </Grid.Column>
        </Grid>
        <CancelModal open={cancelModal} transaction={activeTransaction} cancelOrder={() => cancelTrigger()} handleClose={() => setCancelModal(false)} />
      </Segment>
    </div>
  )
}