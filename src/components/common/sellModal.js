import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {Modal, Header, Button, Form, Dimmer, Loader, Dropdown, Divider} from 'semantic-ui-react';
import { api } from '../../api/api';
import {ConfirmModal} from "./confirmModal";

const sellTypes = [
  { key: 'simple', text: 'Simple', value: 'simple' },
  { key: 'trigger', text: 'Trigger', value: 'trigger' }
]
export function SellModal({ open, handleClose, account, updateAccount, quote }) {
  const [loading, setLoading] = useState(false);
  const [sellType, setSellType] = useState('simple')
  const [stockAmount, setStockAmount] = useState(0); // For triggers (number of shares)
  const [sellDollarAmount, setSellDollarAmount] = useState(0); // For simple buy/sell
  const [confirmModal, setConfirmModal] = useState(false);
  const [triggerAmount, setTriggerAmount] = useState(0);

  async function handleSimpleSell() {
    try {
      setLoading(true);
      await api.submitSimpleOrder('SELL', quote.symbol, sellDollarAmount);
      setConfirmModal(true);
      console.log('Simple Sell.');
    } catch (e) {
      toast.error("Error processing order.");
      console.log("Error processing: " + e);
    }
    setLoading(false);
  }

  async function handleSimpleSellCommit() {
    try {
      setLoading(true);
      let freshAccount = await api.commitSimpleSell();
      updateAccount(freshAccount);
      toast.success("Sell Order Completed");
      console.log('Simple Sell.');
    } catch (e) {
      toast.error("Error committing Sell order.");
      console.log("Error processing: " + e);
    }
    clearAndClose();
  }

  async function handleSimpleSellCancel() {
    try {
      setLoading(true);
      await api.cancelSimpleSell();
      toast.success("Sell Order Cancelled");
      console.log('Simple Sell Cancel.');
    } catch (e) {
      toast.error("Error cancelling Sell order.");
      console.log("Error cancelling Sell order: " + e);
    }
    clearAndClose();
  }

  function clearAndClose() {
    setStockAmount(0);
    setSellDollarAmount(0);
    setConfirmModal(false);
    setLoading(false);
    setTriggerAmount(0);
    setSellType('simple')
    handleClose();
  }

  async function handleTriggerSell() {
    setLoading(true);
    await api.submitLimitOrder('SELL_AT', quote.symbol, stockAmount);
    toast.success('Sell Order Submitted');
    console.log('Trigger Sell.');
    setConfirmModal(true);
  }

  async function handleTriggerSellCommit() {
    try {
      setLoading(true);
      let freshAccount = await api.commitLimitSell(triggerAmount,quote.symbol);
      updateAccount(freshAccount);
      toast.success("Sell Order Completed");
      console.log('Trigger Sell Commit.');
    } catch (e) {
      toast.error("Error committing sell order.");
      console.log("Error processing: " + e);
    }
    clearAndClose();
  }

  async function handleTriggerSellCancel() {
    try {
      setLoading(true);
      await api.cancelLimitSell(quote.symbol);
      toast.success("Sell Order Cancelled");
      console.log('Trigger Sell Cancel.');
    } catch (e) {
      toast.error("Error cancelling sell order.");
      console.log("Error cancelling sell order: " + e);
    }
    clearAndClose();
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
        <Modal.Header children={<Header color="teal" as="h1" content={`Sell ${quote.symbol}  ${sellType === 'simple' ? `at $${quote.price}` : `- Current Price: $${quote.price}`}`  } />} />
        <Modal.Content>
          <Modal.Description>
            <Header color="grey" as="h3" content={`Current Balance: $${account.balance ? (account.balance).toFixed(2) : 0}`} />
            <Header color="grey" as="h4" content={'Select Sell Type: '} />
            <Dropdown placeholder="Sell Type" labeled selection options={sellTypes} value={sellType} onChange={(e,{value}) => setSellType(value)} />
            <Divider />
            <p>
              Please enter the dollar amount of stock you would like to sell:
            </p>
            <Form>
              {sellType === 'trigger' ?
                  <Form.Input
                      label="Stock Amount: "
                      labelPosition="right"
                      placeholder="0"
                      type="number"
                      value={stockAmount}
                      min="0"
                      onChange={e => setStockAmount(e.target.value)}
                      error={stockAmount >= 0 ? false : "Invalid number of stocks."}
                      disabled={loading}
                      focus/>
                  : '' }
              {sellType === 'trigger' ?
                  <Form.Input
                      icon="dollar"
                      iconPosition="left"
                      label="Trigger Amount: "
                      labelPosition="right"
                      placeholder="0"
                      type="number"
                      value={triggerAmount}
                      onChange={e => {setTriggerAmount(e.target.value);setSellDollarAmount(parseFloat(e.target.value) * stockAmount)}}
                      error={sellDollarAmount <= account.balance ? false : "Insufficient funds."}
                      disabled={loading}
                      focus
                  /> : <Form.Input
                      icon="dollar"
                      iconPosition="left"
                      label="Amount: "
                      labelPosition="right"
                      placeholder="0"
                      type="number"
                      min="0"
                      value={sellDollarAmount}
                      onChange={e => setSellDollarAmount(e.target.value)}
                      disabled={loading}
                      focus
                  /> }
            </Form>
            <br />
            { sellType === 'simple' ? <p>{`Total Shares to sell: ${Math.floor(sellDollarAmount / quote.price)}`}  </p> : ''}
            <br />
            <p>{`Note: Number of shares may not be partial. Order will be rounded down to nearest full share, extra funds will be refunded to your account.`}</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button floated="left" content="Cancel" color='red' onClick={() => clearAndClose()} />
          { sellType === 'trigger' ? <Button
                  content="Submit Sell"
                  labelPosition='right'
                  icon='send'
                  onClick={() => handleTriggerSell()}
                  positive
                  disabled={triggerAmount < 0 || stockAmount < 1} />
              : ''}
          { sellType === 'simple' ?
              <Button
                  content="Submit Sell"
                  labelPosition='right'
                  icon='send'
                  onClick={() =>  handleSimpleSell()}
                  positive
                  disabled={sellDollarAmount < quote.price} /> : ''}
        </Modal.Actions>
        <ConfirmModal open={confirmModal} totalPrice={sellDollarAmount} quote={quote} cancelOrder={() => sellType === 'simple' ? handleSimpleSellCancel() : handleTriggerSellCancel()} confirmOrder={() => sellType === 'simple' ? handleSimpleSellCommit() : handleTriggerSellCommit()} />
      </Modal>
  )
}
