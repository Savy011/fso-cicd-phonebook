require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/mongo')

const app = express()
const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name.toLowerCase() === 'casterror') {
		return response.status(400).send({ error: 'Malformatted Id' })
	} else if (error.name.toLowerCase() === 'validationerror') {
		return response.status(400).send({ error: error.message })
	}

	next(error)
}
const unknownEndpoint = (request, response) => {
	return response.status(404).send({ error: 'Unknown Endpoint' })
}

morgan.token('content', function getContent(req) {
	return JSON.stringify(req.body)
})

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

app.use(
	morgan(function (tokens, req, res) {
		return [
			tokens.method(req, res),
			tokens.url(req, res),
			tokens.status(req, res),
			tokens.res(req, res, 'content-length'),
			'-',
			tokens['response-time'](req, res),
			'ms',
			tokens.content(req, res)
		].join(' ')
	})
)

app.get('/info', (request, response) => {
	const currentTime = new Date()

	Person.find({}).then(persons => {
		response.send(`<h3>Phonebook has info for ${persons.length} people</h3>
			<h4>${currentTime}</h4>`)
	})
})

app.get('/api/persons', (request, response, next) => {
	Person.find({})
		.then(person => {
			response.json(person)
		})
		.catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then(person => {
			if (person) {
				response.json(person)
			} else {
				response.status(404).end
			}
		})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(_person => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
	const body = request.body

	if (body.name === undefined) {
		response.status(400).json({
			Error: 'Missing Name'
		})
	}

	const person = new Person({
		name: body.name,
		number: body.number
	})

	person
		.save()
		.then(savedPerson => {
			response.json(savedPerson)
		})
		.catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const { name, number } = request.body

	Person.findByIdAndUpdate(
		request.params.id,
		{ name, number },
		{ new: true, runValidators: true, context: 'query' }
	)
		.then(updatedPerson => {
			response.json(updatedPerson)
		})
		.catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running at Port ${PORT}`)
})
