const Content = ({ peopleToShow, handleDelete }) => {
	return (
		<div>
			{peopleToShow.map((item) => 
				<p>
				<li key={item.id}>
					{item.name} {item.number}
					&nbsp;
					<button onClick={() => handleDelete(item.id)}>Delete</button>
				</li>
				</p>
			)}
		</div>
	)
}

export default Content
