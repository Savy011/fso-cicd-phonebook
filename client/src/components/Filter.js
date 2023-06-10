const Filter = ({ searchFilter, handleSearchFilter }) => {
	return (
		<div>
			<p>Search: <input value={searchFilter} onChange={handleSearchFilter}/></p>
		</div>
	)
}

export default Filter
