import React from 'react';
import MessageItem from './message_item';

const MyMessages = ({ messages }) => {
	// console.log(messages);
	const displayMessages = Object.values(messages)
		.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
		.map((message) => <MessageItem key={message.id} message={message} />);
	return (
		<div>
			<h1>My Messages</h1>
			<ul>{displayMessages}</ul>
		</div>
	);
};

export default MyMessages;
