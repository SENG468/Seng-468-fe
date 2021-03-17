import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Modal, Header, Button, Form, Dimmer, Loader } from 'semantic-ui-react';
import { api } from '../../api/api';


export function SellModal({ open, handleClose, account, updateAccount, stockSymbol }) {
  const [loading, setLoading] = useState(false);
  const [stockAmount, setStockAmount] = useState(0); // For triggers (number of shares)
  const [stockValue, setStockValue] = useState(0); // For triggers (price per share)
  const [sellDollarAmount, setSellDollarAmount] = useState(0); // For simple buy/sell

  async function handleSimpleSell() {
    try {
      setLoading(true);
      // Make call to simple sell endpoint
      console.log('Simple Buy.');
    } catch (e) {
      toast.error("Error processing order.");
      console.log("Error processing: " + e);
    }
    clearAndClose();
  }

  async function handleCancelSimpleBuy() {
    try {
      setLoading(true);
      // Make call to cancel simple sell endpoint
      console.log('Simple Buy Cancel.');
    } catch (e) {
      toast.error("Error processing order.");
      console.log("Error processing: " + e);
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
      <Modal.Header children={<Header color="teal" as="h1" content={`Buy ${stockSymbol}`} />} />
      <Modal.Content>
        <Modal.Description>
          <Header color="grey" as="h3" content={`Current Balance: $${account.balance}`} />
          <p>
            TODO: add simple sell and trigger buy functionality
        </p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button floated="left" content="Cancel" color='red' onClick={() => clearAndClose()} />
      </Modal.Actions>
    </Modal>
  )
}
