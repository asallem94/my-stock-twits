import React from 'react';
// import MessageItem from './message_item';

const MyStocks = ({ stocks }) => {
	// console.log(stocks);
	const displayStocks = Object.keys(stocks).map((stockId) => {
		return <li key={stockId}>{stocks[stockId]}</li>;
	});

	return (
		<div>
			<h1>My Stocks</h1>
			<ul>{displayStocks}</ul>
		</div>
	);
};

export default MyStocks;
