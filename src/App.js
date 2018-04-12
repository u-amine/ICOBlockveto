import React, { Component } from 'react';
import './App.css';
import getWeb3 from './web3';
import contractAbi from './abi.json';
import {Tab, Tabs, Panel, Table} from 'react-bootstrap';

const CONTRACT_ADDRESS = '0x204befc8d8f16cf0732c2eedbdf5ec6f047c3764';


// 0xdFB0D1e360D16396a92d1e29908FefA08Eed0EB6
// 0xdFB0D1e360D16396a92d1e29908FefA08Eed0EB6
// 0x908fefa08eed0eb6000000000000000000000000


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
            <small>Your contribution to pension per month</small>
          </h2>
          <div className="form-group">
            <label htmlFor="absense">Compulsory amount (18% of your salary)</label>&nbsp;
            <input className="form-control disabled" disabled id="amount" name="amount" required type="number" step="1" value="450"/>
            &nbsp;+ voluntary&nbsp;
            <input className="form-control" id="amount" name="amount" required type="number" step="1" value="205" /> €
            <br/>
            <button id="requestSpending" type="submit" className="btn btn-md btn-warning">
              Calculate your recommended additional pension amount
            </button>
          </div>
          
          <h2>
            <small> Get your DB token </small>
          </h2>
          <div className="form-group">
            <button id="requestSpending" type="submit" className="btn btn-block btn-lg btn-primary">
              Start pension plan
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
              <h1>BlockPension</h1>
            </div>
            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
              <Tab eventKey={1} title="Contribute">
                  <TransactionForm />
              </Tab>
              <Tab eventKey={2} title="Profile">
              <br/>

                <Panel>
                  <Panel.Heading>Contribution status</Panel.Heading>
                <Table responsive>
                  <tbody>
                    <tr>
                      <td>Total contribution until now</td>
                      <td>655€</td>
                    </tr>
                    <tr>
                      <td>Received pension</td>
                      <td>0€</td>
                    </tr>
                  </tbody>
                </Table>
                </Panel>
                <Panel>
                  <Panel.Heading>Foo</Panel.Heading>
                <Table responsive>
                  <tbody>
                    <tr>
                      <td>Name</td>
                      <td>Kim Schmidt</td>
                    </tr>
                    <tr>
                      <td>Birth date</td>
                      <td>05.08.1986</td>
                    </tr>
                    <tr>
                      <td>Income</td>
                      <td>2500€</td>
                    </tr>
                    <tr>
                      <td>Pension</td>
                      <td>450€</td>
                    </tr>
                    <tr>
                      <td>Paid voluntary contribution</td>
                      <td>205€</td>
                    </tr>
                  </tbody>
                </Table>
                </Panel>
              </Tab>
            </Tabs>
        </div>
        <p/>
        <p/>
        <p/>
        <p/>
      </div>
    );
  }
}

export default App;
