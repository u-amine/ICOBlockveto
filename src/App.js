import React, { Component } from 'react';
import './App.css';

const TransactionForm = () => {
  return (
    <form class="col-md-6 col-md-offset-3">
      <h2>
        Spendings<br />
        <small>Put your spendings in the form</small>
      </h2>
      <div className="form-group">
        <label htmlFor="absense">Amount</label>
        <input className="form-control" name="amount" required="" type="number" /> ETH
      </div>
      <div className="form-group">
        <label htmlFor="receiveaddress">Receive Address</label>
        <input className="form-control" name="receiveaddress" required="" type="text" />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea className="form-control" name="description" required="" type="text" />
      </div>

      <div className="col-md-12">
        <button id="requestSpending" type="button" className="btn btn-lg btn-primary">
          Request spending
        </button>
      </div>
    </form>
  );
};

const Transaction = ({ status }) => {
  const color = status === 'success' ? 'green' : 'red';
  return (
    <li className="bv-transaction-item">
      <p className="bv-transaction-item--amount">
        <b style={{ color: color }}>10 ETH</b>
      </p>
      <p>For a pc</p>
      <p>0x8d12a197cb00d4747a1fe03395095c0000000000</p>
      <div className="bv-transaction-item--status" style={{ color: color }}>
        {status === 'success' ? '✓' : 'x'}
      </div>
    </li>
  );
};

const TransactionsList = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-xs-12">
          <h1>Transactions</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12">
          <ul className="list-unstyled">
            <Transaction status="success" />
            <Transaction status="failure" />
            <Transaction status="success" />
          </ul>
        </div>
      </div>
    </div>
  );
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <TransactionForm />
        <TransactionsList />
      </div>
    );
  }
}

export default App;
