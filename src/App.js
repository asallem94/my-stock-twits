import React from 'react';
import './App.css';
import MyStocks from './components/my_stocks';
import MyMessages from './components/my_messages';

class App extends React.Component{
  constructor(props){
    super(props)
    this.state={
      myStocks: { 0:'AAPL'},//, 1:'BABA'},
      // myStocks: { },
      myMessages: {},
      errors: [],
      fetching: false
    }
    this.fetchMessagesFrom = this.fetchMessagesFrom.bind(this);
    this.removeStockFromWatchList = this.removeStockFromWatchList.bind(this);
    this.addStock = this.addStock.bind(this);
    this.updateMyStocks = this.updateMyStocks.bind(this);
    this.handleRecieveErrors = this.handleRecieveErrors.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.stockId = 2
  }
  componentDidMount(){
    this.updateMyStocks();
    // begin fetch stock Messages callback
    setInterval(this.updateMyStocks, 5000) //fetch messages every 5 seconds
  }
  updateMyStocks() {
    Object.values(this.state.myStocks).forEach(stock=>{
      this.fetchMessagesFrom(stock)
    })
    
  }
  removeStockFromWatchList(stockId){
    return (e)=>{
      e.preventDefault();
      const defaultMyMessages = this.state.myMessages;
      delete defaultMyMessages[this.state.myStocks[stockId]];
      const defaultMyStocks = this.state.myStocks;
      delete defaultMyStocks[stockId];
      this.setState({myMessages: defaultMyMessages, myStocks: defaultMyStocks})
    }
  }
  
  addStock(e){
    e.preventDefault();
    const stock = e.currentTarget.children[0].children[0];
    stock.value = stock.value.trim().toUpperCase();
    if (Object.values(this.state.myStocks).includes(stock.value)){
      this.setState({errors: [`You are already watching ${stock.value}`]})
    } else {
      this.setState({fetching: true}, ()=>{
        this.fetchMessagesFrom(stock.value, 
        (res) => {
          if (res) {
            this.setState({
              myStocks: Object.assign({}, this.state.myStocks, { [this.stockId]: stock.value }),
              fetching: false
            })
            stock.value = ""
            this.stockId++;
          } else {
            this.setState({
              fetching: false
            })
          }
        })
      })
    }
  }
  doCORSRequest(options, callback) {
    var x = new XMLHttpRequest();
    const cors_api_url = 'https://cors-anywhere.herokuapp.com/'
    x.open(options.method, cors_api_url + options.url);
    x.onload = x.onerror = function () {
      // console.log(x.response)
      const res = JSON.parse(x.response);
      callback(res)
      // debugger
      // console.log('handle errors')
      // printResult(
      //   options.method + ' ' + options.url + '\n' +
      //   x.status + ' ' + x.statusText + '\n\n' +
      //   (x.responseText || '')
      // );
    };
    if (/^POST/i.test(options.method)) {
      x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    x.send(options.data);
  }

  handleResponse(cb){
    return (res)=>{
      if (res.errors){
        this.handleRecieveErrors(res.errors)
        cb && cb(false);
      } else {
        this.handleRecieveMessages(res.symbol.symbol, res.messages);
        cb && cb(true);
      }
    }
  }
  fetchMessagesFrom(stock, cb){
    // return this.fetchStock(stock)
    this.doCORSRequest({
        method: 'GET',
        url: `https://api.stocktwits.com/api/2/streams/symbol/${stock}.json`,
      },
      this.handleResponse(cb)
    );
  }
  handleRecieveMessages(stock, messages){
    this.setState({
        myMessages: Object.assign(
          {},
          this.state.myMessages,
          {
            [stock]: Object.assign({},...messages.map(message=>{return ({[message.id]: message})}))
          }
        ),
        errors: []
    })
  }
  handleRecieveErrors(errors){
    this.setState({ errors: errors.map(err => err.message) }) 
  }
  clearStockErrors(){
    this.setState({stockErrors: []})
  }
  render(){
    return (
      <div className="App">
        <MyStocks
          stocks={this.state.myStocks}
          addStock={this.addStock}
          errors={this.state.errors}
          removeStockFromWatchList={this.removeStockFromWatchList}
          fetching={this.state.fetching}/>
        <MyMessages
          messages={Object.assign({},...Object.values(this.state.myMessages))}/>
      </div>
    );
  }
}

export default App;
