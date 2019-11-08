import React from 'react';
import SearchStocks from './search_stocks';

const MyStocks = ({ stocks, addStock, errors, fetching, removeStockFromWatchList, messageCount }) => {
	const displayStocks = Object.keys(stocks).map((stockId) => {
		return (
			<li className="stock_sym_item" key={stockId}>
				<span className="stock-sym">
					( {messageCount && messageCount[stocks[stockId]]} <i className="fa fa-comments" />){' '}
					{stocks[stockId]}
				</span>
				<button className="button" onClick={removeStockFromWatchList(stockId)}>
					<i className="fa fa-times" />
				</button>
			</li>
		);
	});

	return (
		<div className="mystocks-header">
			<div className="mystocks-header-content">
				<h1 className="header-title">My Stocks</h1>
				<ul className="mystocks">
					{displayStocks}
					<SearchStocks addStock={addStock} fetching={fetching} />
				</ul>
			</div>
			<div className="errors">
				{errors.map((err, ind) => (
					<h6 className="err" key={ind}>
						{err}
					</h6>
				))}
			</div>
		</div>
	);
};

export default MyStocks;
