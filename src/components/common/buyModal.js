import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Modal, Header, Button, Form, Dimmer, Loader, Dropdown, Divider } from 'semantic-ui-react';
import { ConfirmModal } from './confirmModal.js';
import { api } from '../../api/api';

const buyTypes = [
  { key: 'simple', text: 'Simple', value: 'simple' },
  { key: 'trigger', text: 'Trigger', value: 'trigger' }
]

export function BuyModal({ open, handleClose, account, updateAccount, quote }) {
  const [loading, setLoading] = useState(false);
  const [buyType, setBuyType] = useState('simple')
  const [stockAmount, setStockAmount] = useState(0); // For triggers (number of shares)
  const [stockValue, setStockValue] = useState(0); // For triggers (price per share)
  const [buyDollarAmount, setBuyDollarAmount] = useState(0); // For simple buy/sell
  const [confirmModal, setConfirmModal] = useState(false);

  async function handleSimpleBuy() {
    try {
      setLoading(true);
      let transaction = await api.submitSimpleOrder('BUY', quote.symbol, buyDollarAmount);
      toast.success('Buy Order Submitted');
      console.log('Simple Buy.');
      setConfirmModal(true);
    } catch (e) {
      toast.error("Error processing order.");
      console.log("Error processing: " + e);
    }
    setLoading(false);
  }

  async function handleSimpleBuyCommit() {
    try {
      setLoading(true);
      let freshAccount = await api.commitSimpleBuy();
      updateAccount(freshAccount);
      toast.success("Buy Order Completed");
      console.log('Simple Buy.');
    } catch (e) {
      toast.error("Error committing buy order.");
      console.log("Error processing: " + e);
    }
    clearAndClose();
  }

  async function handleSimpleBuyCancel() {
    try {
      setLoading(true);
      let transaction = await api.cancelSimpleBuy();
      toast.success("Buy Order Cancelled");
      console.log('Simple Buy Cancel.');
    } catch (e) {
      toast.error("Error cancelling buy order.");
      console.log("Error cancelling buy order: " + e);
    }
    clearAndClose();
  }

  function clearAndClose() {
    setStockAmount(0);
    setStockValue(0);
    setBuyDollarAmount(0);
    setConfirmModal(false);
    setLoading(false);
    setBuyType('simple')
    handleClose();
  }

  function checkBuyError() {
    if (buyDollarAmount >= account.balance) {
      return "Insufficient funds.";
    }
    if(buyDollarAmount < 0){
      return "Invalid buy amount"
    }
    if(buyDollarAmount < quote.price && buyDollarAmount > 0){
      return "Quote higher than funds"
    }
    return false;
  }


  return (
    <Modal
      onClose={() => clearAndClose()}
      open={open}
      dimmer="blurring"
      size="tiny"
    >
      <Dimmer active={loading}>
        <Loader>{"Processing Order..."}</Loader>
      </Dimmer>
      <Modal.Header children={<Header color="teal" as="h1" content={`Buy ${quote.symbol}  ${buyType === 'simple' ? `at $${quote.price}` : ''}`  } />} />
      <Modal.Content>
        <Modal.Description>
          <Header color="grey" as="h3" content={`Current Balance: $${account.balance ? (account.balance).toFixed(2) : 0}`} />
          <Header color="grey" as="h4" content={'Select Buy Type: '} />
          <Dropdown placeholder="Buy Type" labeled selection options={buyTypes} value={buyType} onChange={(e) => setBuyType(e.target.value)} />
          <Divider />
          <p>
            Please enter the dollar amount of stock you would like to buy:
        </p>
          <Form>
            <Form.Input
              icon="dollar"
              iconPosition="left"
              label="Amount: "
              labelPosition="right"
              placeholder="0"
              type="number"
              min="0"
              value={buyDollarAmount}
              onChange={e => setBuyDollarAmount(e.target.value)}
              error={checkBuyError()}
              disabled={loading}
              focus
            />
            {buyType === 'trigger' ?
                <Form.Input
                icon="dollar"
                iconPosition="left"
                label="Trigger Amount: "
                labelPosition="right"
                placeholder="0"
                type="number"
                value={buyDollarAmount}
                onChange={e => setBuyDollarAmount(e.target.value)}
                error={buyDollarAmount <= account.balance ? false : "Insufficient funds."}
                disabled={loading}
                focus
            /> : '' }
          </Form>
          <br />
          <p>{`Total Shares to purchase: ${Math.floor(buyDollarAmount / quote.price)}`}</p>
          <br />
          <p>{`Note: Number of shares may not be partial. Order will be rounded down to nearest full share, extra funds will be refunded to your account.`}</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button floated="left" content="Cancel" color='red' onClick={() => clearAndClose()} />
        <Button
          content="Submit Buy"
          labelPosition='right'
          icon='send'
          onClick={() => handleSimpleBuy()}
          positive
          disabled={buyDollarAmount < quote.price}
        />
      </Modal.Actions>
      <ConfirmModal open={confirmModal} totalPrice={buyDollarAmount} quote={quote} cancelOrder={() => handleSimpleBuyCancel()} confirmOrder={() => handleSimpleBuyCommit()} />
    </Modal>
  )
}
