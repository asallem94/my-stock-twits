import React from 'react';

const MessageItem = ({ message }) => {
	// console.log(message);
	// message.user
	return (
		<li className="message-container">
			<div className="message-content">
				<img className="avatar" src={message.user.avatar_url} alt={message.user.username} />
				<p>{message.body}</p>
			</div>
			<h6 className="timestamp">{new Date(message.created_at).toDateString()}</h6>
		</li>
	);
};

export default MessageItem;
