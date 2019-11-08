import React from 'react';
import './App.css';
import MyStocks from './components/my_stocks';
import MyMessages from './components/my_messages';

class App extends React.Component{
  constructor(props){
    super(props)
    this.state={
      myStocks: { 0:'AAPL', 1:'BABA'},
      // myStocks: { },
      myMessages: {},
      errors: [],
      fetching: false
    }
    this.fetchMessagesFrom = this.fetchMessagesFrom.bind(this);
    this.removeStockFromWatchList = this.removeStockFromWatchList.bind(this);
    this.addStock = this.addStock.bind(this);
    // this.handleAddStock = this.handleAddStock.bind(this);
    this.updateMyStocks = this.updateMyStocks.bind(this);
    this.handleRecieveErrors = this.handleRecieveErrors.bind(this);
    this.stockId = 2
  }
  componentDidMount(){
    // this.fetchMessagesFrom("AAPL")
    this.updateMyStocks();
    // begin fetch stock Messages callback
    // setInterval(this.updateMyStocks, 5000) //fetch messages every 10 seconds
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
    stock.value = stock.value.toUpperCase();
    if (Object.values(this.state.myStocks).includes(stock.value)){
      this.setState({errors: [`You are already watching ${stock.value}`]})
    } else {
      this.setState({fetching: true}, ()=>{
        this.fetchMessagesFrom(stock.value).then((res) => {
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
  fetchStock(stock){
    return fetch(`https://api.stocktwits.com/api/2/streams/symbol/${stock}.json`, 
      {
        method: "GET",
      }).then(res => {
      return res.json();
    });
  }
  fetchMessagesFrom(stock){
    return this.fetchStock(stock).then(
      (res)=>{
        if (res.errors){
          this.handleRecieveErrors(res.errors)
          return false;
        } else {
          this.handleRecieveMessages(stock, res.messages);
          return true;
        }
      }
    )
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
        {/* <MyStocks
          stocks={this.state.myStocks}
          addStock={this.addStock}
          errors={this.state.errors}
          removeStockFromWatchList={this.removeStockFromWatchList}
          fetching={this.state.fetching}
        /> */}
        <MyMessages
          messages={Object.assign({},...Object.values(this.state.myMessages))}/>
      </div>
    );
  }
}

export default App;
