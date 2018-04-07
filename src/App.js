import React, { Component } from 'react';
import './App.css';
import web3 from 'web3';
import getWeb3 from './web3';
import contractAbi from './abi.json';

const CONTRACT_ADDRESS = '0xb52305d3acfeecd1ed33e0910dac0d385e1d6158';

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
    const ammountInGwei = ammount * 10 ** 18

    const web3 = await getWeb3();
    const [from] = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
    contract.setProvider(web3.currentProvider);
    contract.methods
      .createRequest(description, ammountInGwei, receiverAddress)
      .send({ from: from })
      .on('transactionHash', txHash => {
        alert('Transaction started!');
      });
  };

  render() {
    return (
      <div className="row">
        <form className="col-xs-12" onSubmit={this.handleSubmit}>
          <h2>
            Spendings<br />
            <small>Put your spendings in the form</small>
          </h2>
          <div className="form-group">
            <label htmlFor="absense">Amount</label>
            <input className="form-control" id="amount" name="amount" required type="number" step="0.001" /> ETH
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
      </div>
    );
  }
}

const Transaction = ({ transaction, transactionIndex, whoami }) => {
  const finalize = async () => {
    const web3 = await getWeb3();
    const [from] = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
    contract.setProvider(web3.currentProvider);
    contract.methods
      .finalizeRequest(transactionIndex)
      .send({ from: from })
      .on('transactionHash', txHash => {
        alert('Transaction finalized!');
      });
  }

  const veto = async () => {
    const web3 = await getWeb3();
    const [from] = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
    contract.setProvider(web3.currentProvider);
    contract.methods
      .vetoRequest(transactionIndex)
      .send({ from: from })
      .on('transactionHash', txHash => {
        alert('Veto finalized!');
      });
  }

  const renderButtons = () => {
    return (
      <React.Fragment>
        {whoami === 'manager' ? <React.Fragment><button className="btn btn-primary" onClick={finalize}>🏁 Finalize</button>{' '}</React.Fragment> : null}
        <button className="btn btn-danger" onClick={veto}>👎 Veto this</button>
      </React.Fragment>
    );
  }

  return (
    <li className="bv-transaction-item">
      <p className="bv-transaction-item--amount">
        <b>{transaction.value * 10 ** -18} ETH</b>
      </p>
      <p>{transaction.description}</p>
      <p>{transaction.recipient}</p>
      {transaction.complete ? <SuccessStatus /> : renderButtons() }
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

const TransactionsList = ({ transactions, whoami }) => {
  return (
    <div>
      <div className="row">
        <div className="col-xs-12">
          <h2>Transactions<br/>
            <small>Here's what happened so far</small>
          </h2>
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12">
          <ul className="list-unstyled">
            {transactions.map((transaction, index) => (
              <Transaction key={index} transaction={transaction} transactionIndex={index} whoami={whoami} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ContributeButton = () => {

  const contribute = async () => {
    const web3 = await getWeb3();
    const [from] = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
    contract.setProvider(web3.currentProvider);
    contract.methods
      .contribute()
      .send({
        from: from,
        value: web3.utils.toWei("0.1")
      })
      .on('transactionHash', txHash => {
        alert('Contribution finalized!');
      });
  }

  return (
    <button className="btn btn-warning btn-block" onClick={contribute}>
      💸 Contribute 0.1 ETH
    </button>
  );
};

class App extends Component {
  state = {
    transactions: []
  };

  componentDidMount() {
    this.getTransactions();
    this.whoAmI();
  }

  getTransactions = async () => {
    const web3 = await getWeb3();
    const [from] = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
    contract.setProvider(web3.currentProvider);
    const requestsCount = await contract.methods.getRequestsCount().call();
    const transactions = await Promise.all(
      Array.from({ length: requestsCount }).map((_, index) => contract.methods.requests(index).call())
    );
    this.setState({ transactions: transactions.reverse() });
  };


  whoAmI = async () => {
    const web3 = await getWeb3();
    const [from] = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
    contract.setProvider(web3.currentProvider);
    const manager = await contract.methods.manager().call();

    if (manager === from) {
      this.setState({whoami: 'manager'})
    } else {
      this.setState({whoami: 'investor'})
    }
  };

  render() {
    return (
      <div className="App container">
        <div className="col-xs-9">
          <div className="page-header">
            <h1>BlockVeto</h1>
          </div>
          <b>You are {this.state.whoami === 'manager' ? 'a manager' : 'an investor'}</b>
          <hr/>
          {
            this.state.whoami === 'manager'
            ? <TransactionForm />
            : <span>Managers can request spendings, you only can vote on them</span>
          }
          <hr />
          <ContributeButton />
        </div>
        <p/>
        <p/>
        <p/>
        <p/>
        <TransactionsList transactions={this.state.transactions} whoami={this.state.whoami} />
      </div>
    );
  }
}

export default App;
