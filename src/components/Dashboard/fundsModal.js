import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Modal, Header, Button, Form, Dimmer, Loader } from 'semantic-ui-react';
import { api } from '../../api/api';


export function FundsModal({ open, handleClose, account, updateAccount }) {
  const [loading, setLoading] = useState(false);
  const [funds, setFunds] = useState(0);

  async function handleAddFunds() {
    try {
      setLoading(true);
      // Make call to add endpoint
      let updatedAccount = await api.addFunds(account.name, funds);
      console.log('Adding Funds.');
      updateAccount(updatedAccount);
    } catch (e) {
      toast.error("Error depositing funds.");
      console.log("Error depositing funds: " + e);
    }
    clearAndClose();
  }

  function clearAndClose() {
    setFunds(0);
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
        <Loader>{"Processing Deposit..."}</Loader>
      </Dimmer>
      <Modal.Header children={<Header color="teal" as="h1" content="Add Funds to Investing Account" />} />
      <Modal.Content>
        <Modal.Description>
          <Header color="grey" as="h3" content={`Current Balance: $${account.balance}`} />
          <p>
            Add funds to your investing account. These funds will be available immediately.
        </p>
          <Form>
            <Form.Input
              icon="dollar"
              iconPosition="left"
              label="Amount: "
              labelPosition="right"
              placeholder="0"
              type="number"
              value={funds}
              onChange={e => setFunds(e.target.value)}
              error={funds < Number.MAX_SAFE_INTEGER ? false : "Get out of here..."}
              disabled={loading}
              focus
            />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button floated="left" content="Cancel" color='red' onClick={() => clearAndClose()} />
        <Button
          content="Add Funds"
          labelPosition='right'
          icon='dollar'
          onClick={() => handleAddFunds()}
          positive
          disabled={funds < 1}
        />
      </Modal.Actions>
    </Modal>
  )
}
