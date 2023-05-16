import React, { useState, useEffect, useContext } from 'react';
import { database } from '../../../fireBase/config';
import { AuthContext } from '../../../store/Context';
import { Table, Spinner } from 'react-bootstrap';
import './livePass.css'


function Passenger() {
  const [customers, setCustomers] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const customersRef = database.ref('Customers');
      customersRef
        .orderByChild('id')
        .equalTo(user.uid)
        .on('value', (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const customerList = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setCustomers(customerList);
          } else {
            setCustomers([]);
          }
        });
    }
  }, [user]);

  if (!customers.length) {
    return <Spinner animation="grow" />;
  }

  return (
    <div className="container top">
      <Table striped bordered>
        <thead>
          <tr>
            <th>Username</th>
            <th>Status</th>
            <th>Tag</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.Username}</td>
              <td>{customer.Status}</td>
              <td>{customer.tag}</td>
              <td>
                <button
                  className="btn btn-primary"
                //   onClick={() => handleDownload(customer.id)}
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Passenger;
