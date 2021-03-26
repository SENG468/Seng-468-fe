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
  const [stockValue, setStockValue] = useState(0); // For triggers (price per share)
  const [sellDollarAmount, setSellDollarAmount] = useState(0); // For simple buy/sell
  const [confirmModal, setConfirmModal] = useState(false);

  async function handleSimpleSell() {
    try {
      setLoading(true);
      let transaction = await api.submitSimpleOrder('SELL', quote.symbol, sellDollarAmount);
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
      let transaction = await api.cancelSimpleSell();
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
    setStockValue(0);
    setSellDollarAmount(0);
    setLoading(false);
    handleClose();
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
        <Modal.Header children={<Header color="teal" as="h1" content={`Sell ${quote.symbol}  ${sellType === 'simple' ? `at $${quote.price}` : ''}`  } />} />
        <Modal.Content>
          <Modal.Description>
            <Header color="grey" as="h3" content={`Current Balance: $${account.balance ? (account.balance).toFixed(2) : 0}`} />
            <Header color="grey" as="h4" content={'Select Sell Type: '} />
            <Dropdown placeholder="Sell Type" labeled selection options={sellTypes} value={sellType} onChange={(e) => setSellType(e.target.value)} />
            <Divider />
            <p>
              Please enter the dollar amount of stock you would like to sell:
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
                  value={sellDollarAmount}
                  onChange={e => setSellDollarAmount(e.target.value)}
                  disabled={loading}
                  focus
              />
              {sellType === 'trigger' ?
                  <Form.Input
                      icon="dollar"
                      iconPosition="left"
                      label="Trigger Amount: "
                      labelPosition="right"
                      placeholder="0"
                      type="number"
                      value={sellDollarAmount}
                      onChange={e => setSellDollarAmount(e.target.value)}
                      error={sellDollarAmount <= account.balance ? false : "Insufficient funds."}
                      disabled={loading}
                      focus
                  /> : '' }
            </Form>
            <br />
            <p>{`Total Shares to sell: ${Math.floor(sellDollarAmount / quote.price)}`}</p>
            <br />
            <p>{`Note: Number of shares may not be partial. Order will be rounded down to nearest full share, extra funds will be refunded to your account.`}</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button floated="left" content="Cancel" color='red' onClick={() => clearAndClose()} />
          <Button
              content="Submit Sell"
              labelPosition='right'
              icon='send'
              onClick={async() => await handleSimpleSell()}
              positive
              disabled={sellDollarAmount < quote.price}
          />
        </Modal.Actions>
        <ConfirmModal open={confirmModal} totalPrice={sellDollarAmount} quote={quote} cancelOrder={() => handleSimpleSellCancel()} confirmOrder={() => handleSimpleSellCommit()} />
      </Modal>
  )
}
