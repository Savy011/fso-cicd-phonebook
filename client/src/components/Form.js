const ContactForm = ({ addContact, newPerson, handleNameChange, newNumber, handleNumberChange}) => {
	return (
			<form onSubmit={addContact}>
				<p>Name: <input value={newPerson} onChange={handleNameChange}/></p>
				<p>Phone No.: <input value={newNumber} onChange={handleNumberChange}/></p>
				<div><button type='submit'>Add</button></div>
			</form>
	)
}

export default ContactForm
