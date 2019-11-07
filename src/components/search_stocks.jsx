import React from 'react';

const SearchStocks = ({ addStock }) => {
	return (
		<form onSubmit={addStock}>
			<label htmlFor="stocks">
				<input type="text" />
				<input type="submit" />
			</label>
		</form>
	);
};

export default SearchStocks;
