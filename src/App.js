import React from 'react';
// import logo from './logo.svg';
import './App.css';
import SearchStocks from './components/search_stocks'
import MyStocks from './components/my_stocks'
import MyMessages from './components/my_messages'

class App extends React.Component{
  constructor(props){
    super(props)
    this.state={
      myStocks: {},
      myMessages: {},
      stockErrors: [],
      messagesErrors: []
    }
    this.fetchMessagesFrom = this.fetchMessagesFrom.bind(this);
    this.addStock = this.addStock.bind(this);
    this.stockId = 0
  }
  componentDidMount(){
    // begin fetch stock Messages callback
    // setInterval(this.fetchMessages, 10000) //fetch messages every 10 seconds
    this.fetchMessagesFrom("AAPL")
  }
  
  addStock(e){
    e.preventDefault();
    const stock = e.currentTarget.children[0].children[0];
    
    if (Object.values(this.state.myStocks).includes(stock.value)){
      this.setState({stockErrors: [`You Are already following ${stock.value}`]})
    } else {
      this.setState({
        myStocks: Object.assign({}, this.state.myStocks, {[this.stockId]: stock.value})
      })
    }
    stock.value = ""
    this.stockId++;
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
    this.fetchStock(stock).then(
      (res)=>this.handleRecieveMessages(res.messages),
      (err)=>console.log(err),

    )
  }
  handleRecieveMessages(messages){
    this.setState({
        myMessages: Object.assign(
          {},
          this.state.myMessages,
          ...messages.map(message=>{return ({[message.id]: message})})
        )
    })
  }
  clearStockErrors(){
    this.setState({stockErrors: []})
  }
  render(){
    console.log(this.state.myMessages)
    return (
      <div className="App">
        <SearchStocks addStock={this.addStock}/>
        <MyStocks stocks={this.state.myStocks} errors={this.state.stockErrors}/>
        <MyMessages messages={this.state.myMessages}/>
      </div>
    );
  }
}

export default App;
