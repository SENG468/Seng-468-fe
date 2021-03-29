import React from 'react';
import { Modal, Header, Button, Divider } from 'semantic-ui-react';

export function CancelModal({ open, cancelOrder, handleClose, transaction }) {

  return (
    <Modal
      onClose={cancelOrder}
      open={open}
      dimmer="blurring"
      size="tiny"
    >
      <Modal.Header children={<Header color="teal" as="h1" content="Cancel Trigger Order" />} />
      <Modal.Content>
        <Modal.Description>
          <Header color="grey" as="h3" content="Order details:" />
          <Header color="grey" as="h4" content={`Trigger Price: $${transaction.unitPrice}`} />
          <Header color="grey" as="h4" content={`Number of Shares: ${transaction.stockAmount}`} />
          <Header color="grey" as="h4" content={`Total Cost: $${transaction.cashAmount}`} />
          <Divider/>
          <p>
            Are you sure you would like to cancel your order?
        </p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
      <Button
          content="Return"
          labelPosition='left'
          floated='left'
          icon='send'
          onClick={handleClose}
          color='grey'
        />
        <Button content="Cancel Order" color='red' onClick={cancelOrder} />
      </Modal.Actions>
    </Modal>
  )
}