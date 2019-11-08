import React from 'react';

const SearchStocks = ({ addStock, fetching }) => {
	return (
		<form className="search-container stock_sym_item" onSubmit={addStock}>
			<label htmlFor="stocks">
				<input className="textbox" type="text" disabled={fetching} placeholder="search stock" />
				<button className="button">
					<i className="fa fa-search" />
				</button>
			</label>
		</form>
	);
};

export default SearchStocks;
