import React, { Component } from 'react';
import './App.css';
import getWeb3 from './web3';
import contractAbi from './abi.json';

class TransactionForm extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = async event => {
    event.preventDefault();
    const data = new FormData(event.target);
    const description = data.get('description');
    const receiverAddress = data.get('receiveaddress');
    const ammount = data.get('amount');

    const web3 = await getWeb3();
    const [from] = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractAbi, '0xb6163aa9130c019fa4b6f58e0024a44d71181393');
    contract.setProvider(web3.currentProvider);
    contract.methods
      .createRequest(description, ammount, receiverAddress)
      .send({ from: from })
      .on('transactionHash', txHash => { alert('Transaction started!') });
  };

  render() {
    return (
      <form className="col-md-6 col-md-offset-3" onSubmit={this.handleSubmit}>
        <h2>
          Spendings<br />
          <small>Put your spendings in the form</small>
        </h2>
        <div className="form-group">
          <label htmlFor="absense">Amount</label>
          <input className="form-control" id="amount" name="amount" required type="number" /> ETH
        </div>
        <div className="form-group">
          <label htmlFor="receiveaddress">Receive Address</label>
          <input className="form-control" id="receiveaddress" name="receiveaddress" required type="text" />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea className="form-control" id="description" name="description" required type="text" />
        </div>

        <div className="col-md-12">
          <button id="requestSpending" type="submit" className="btn btn-lg btn-primary">
            Request spending
          </button>
        </div>
      </form>
    );
  }
}

const Transaction = ({ status }) => {
  return (
    <li className="bv-transaction-item">
      <p className="bv-transaction-item--amount">
        <b>10 ETH</b>
      </p>
      <p>For a pc</p>
      <p>0x8d12a197cb00d4747a1fe03395095c0000000000</p>
      {status}
    </li>
  );
};

const SuccessStatus = () => (
  <div className="bv-transaction-item--status" style={{ color: 'green' }}>
    ✓
  </div>
);

const FailureStatus = () => (
  <div className="bv-transaction-item--status" style={{ color: 'red' }}>
    x
  </div>
);

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
            <Transaction status={<SuccessStatus />} />
            <Transaction status={<FailureStatus />} />
            <Transaction status={<SuccessStatus />} />
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
