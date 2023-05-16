import { Container, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './balance.css'
import React, { useState, useEffect, useContext } from 'react';
import { database } from '../../fireBase/config';
import { AuthContext } from '../../store/Context';
import Modal from 'react-bootstrap/Modal';
import { loadScript } from 'https://checkout.razorpay.com/v1/checkout.js';

function WithHeaderStyledExample() {
  const [show, setShow] = useState(false);
  const [amount, setAmount] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleAddMoney = () => {
    // Razorpay integration
    const options = {
      key: 'rzp_test_wNhVz81BFxrIrL',
      amount: amount * 100, // amount in paisa
      currency: 'INR',
      name: 'Your Company Name',
      description: 'Add Money to Wallet',
      handler: function (response) {
        // Payment success callback
        handlePaymentSuccess(response.razorpay_payment_id);
      },
      prefill: {
        email: 'user@example.com', // Add customer's email here
      },
      notes: {
        address: 'Customer Address', // Add customer's address here
      },
      theme: {
        color: '#F37254', // Set your desired theme color
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePaymentSuccess = (paymentId) => {
    // Add code to update the customer's wallet with the payment amount
    console.log('Payment successful! Payment ID:', paymentId);
    handleClose();
  };

  const handleAdd100 = () => {
    setAmount(100);
  };

  const handleAdd500 = () => {
    setAmount(500);
  };

  const handleAdd1000 = () => {
    setAmount(1000);
  };

  const [customer, setCustomer] = useState(null);
  const { user } = useContext(AuthContext);
  const [id, setId] = useState(null);

  useEffect(() => {
    if (user) {
      console.log(user.uid);
      const customersRef = database.ref('Customers');
      customersRef
        .orderByChild('id')
        .equalTo(user.uid)
        .once('value', (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const customerId = Object.keys(data)[0];
            const customer = data[customerId];
            console.log(customerId, customer.Wallet);
            setCustomer(customer);
            setId(customerId);
          } else {
            setCustomer(null);
          }
        });

      customersRef
        .orderByChild('id')
        .equalTo(user.uid)
        .on('child_changed', (snapshot) => {
          const customerId = snapshot.key;
          const customer = snapshot.val();
          setCustomer(customer);
          setId(customerId);
        });
    }
  }, [user]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  return (
    <Container className='m=3 balance pt-2'>
      <Card>
        <Card.Header as="h5">Pay balance</Card.Header>
        <Card.Body>
          <Card.Title>Current balance <span> ₹ {(customer) ? (customer.Wallet) : (0)}.00</span></Card.Title>
          <small>You can add upto ₹ 10000.0</small>
          <Card.Text>
            With supporting text below as a natural lead-in to additional content.
          </Card.Text>

          <Button variant="warning" onClick={handleShow}>
            Add money to balance
          </Button>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group controlId="formAmount">
                  <Form.Label>Enter amount to add:</Form.Label>
                  <Form.Control type="number"  value={amount} onChange={handleAmountChange} />
                </Form.Group>
              </Form>
              <div className="mt-3">
            <Button variant="outline-primary" onClick={handleAdd100}>₹ 100</Button>{' '}
            <Button variant="outline-primary" onClick={handleAdd500}>₹ 500</Button>{' '}
            <Button variant="outline-primary" onClick={handleAdd1000}>₹ 1000</Button>{' '}
          </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAddMoney}>
                Pay
              </Button>
            </Modal.Footer>
          </Modal>
          
        </Card.Body>
      </Card>
    </Container>
  );
}



export default WithHeaderStyledExample;
//model