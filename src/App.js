import React, { Component } from 'react';
import './App.css';

const TransactionForm = () => {
  return <form class="col-md-6 col-md-offset-3">
  <h2>Spendings<br/><small>Put your spendings in the form</small></h2>
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
       <button id="requestSpending" type="button" className="btn btn-lg btn-primary">Request spending</button>
   </div>
  </form>
}

const TransactionsList = () => {
  return <div/>
}

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
