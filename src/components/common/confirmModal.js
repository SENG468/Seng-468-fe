import React, { useEffect, useState } from 'react';
import { Modal, Header, Button, Divider } from 'semantic-ui-react';

export function ConfirmModal({ open, cancelOrder, confirmOrder, unitPrice, totalPrice, type }) {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        clearInterval(myInterval);
        cancelOrder();
      }
    }, 850)
    return () => {
      clearInterval(myInterval);
    }
  });

  return (
    <Modal
      onClose={cancelOrder}
      open={open}
      dimmer="blurring"
      size="tiny"
    >
      <Modal.Header children={<Header color="teal" as="h1" content="Confirm Order" />} />
      <Modal.Content>
        <Modal.Description>
          <Header color="grey" as="h3" content="Order details:" />
          <Header color="grey" as="h4" content={`Price per share: $${unitPrice}`} />
          <Header color="grey" as="h4" content={`Total Shares: ${Math.floor(totalPrice / unitPrice)}`} />
          <Header color="grey" as="h4" content={`Order Total: $${Math.floor(totalPrice / unitPrice) * unitPrice}`} />
          {type === 'simple' ? <Header color="grey" as="h4" content={`Amount returned to account: $${(totalPrice - (Math.floor(totalPrice / unitPrice) * unitPrice)).toFixed(2)}`} /> : ''}
          <Divider />
          <p>
            {`Please confirm your order. If you do not confirm in ${seconds} seconds, your order will be cancelled`}
          </p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button floated="left" content="Cancel Order" color='red' onClick={cancelOrder} />
        <Button
          content="Confirm Order"
          labelPosition='right'
          icon='send'
          onClick={confirmOrder}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}