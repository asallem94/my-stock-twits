import React from 'react';
// import bearish from './../assets/bearish.png';
const getLink = function(stock, id) {
	const link = (
		<a
			key={id}
			className="stock-item"
			target="_blank"
			rel="noopener noreferrer"
			href={`https://finance.yahoo.com/quote/${stock.slice(1)}/`}
		>
			{' '}
			{stock}
		</a>
	);
	return link;
};
const getSentiment = function(message) {
	if (message.entities && message.entities.sentiment) {
		return (
			<section className="s-item">
				<img
					className="img-icons"
					src={
						message.entities.sentiment.basic === 'Bearish' ? (
							require('../assets/bearish.png')
						) : (
							require('../assets/bullish.png')
						)
					}
					alt={message.entities.sentiment.basic}
				/>
				<h6 className="stock-sym">{message.entities.sentiment.basic}</h6>
			</section>
		);
	}
	return null;
};
const MessageItem = ({ message }) => {
	return (
		<li className="container">
			<div className="message-content-container">
				<div className="user-info">
					<img className="avatar" src={message.user.avatar_url} alt={message.user.username} />
					<h6 className="header-text">{message.user.username}</h6>
				</div>
				<div className="message-content">
					<p className="description">
						{message.body.split(' ').map((el, id) => (el[0] === '$' ? getLink(el, id) : ` ${el} `))}
					</p>
					{message.entities && message.entities.chart ? (
						<img className="message-img" src={`${message.entities.chart.large}`} alt="message-img" />
					) : null}
				</div>
			</div>
			<div className="s-index">
				{getSentiment(message)}
				{message.likes ? (
					<section className="s-item">
						<i className="fa fa-heart red" />
						<h6 className="stock-sym">{message.likes.total}</h6>
					</section>
				) : null}
			</div>
			<h6 className="timestamp header-text">
				{new Date(message.created_at).toDateString() === new Date().toDateString() ? (
					new Date(message.created_at).toLocaleTimeString()
				) : (
					new Date(message.created_at).toDateString()
				)}
			</h6>
		</li>
	);
};

export default MessageItem;
