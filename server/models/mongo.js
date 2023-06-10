const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URL
console.log('Connecting to MongoDB')

mongoose
	.connect(url)
	.then(_result => {
		console.log('Connected to MongoDB')
	})
	.catch(error => {
		console.log('Error connecting to MongoDB', error.message)
	})

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 5,
		required: true
	},
	number: {
		type: String,
		minLength: 8,
		required: true,
		validate: {
			validator: function (v) {
				return /^\d{2,3}-\d+$/.test(v)
			},
			message: props => `${props.value} is not a valid phone number`
		}
	}
})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Person', personSchema)
