const express = require('express')
const router = express.Router()
const db = require('../config/database')
const Gig = require('../models/Gig')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// Get all gigs
router.get('/', (req, res) => {
  Gig.findAll()
  	.then(gigs => res.render('gigs', {
  		gigs
  	})).catch(err => console.log(err))
})

// Create New Gig
router.get('/add', (req, res) => {
	res.render('addGigs')
})

// Add Gig
router.post('/add', (req, res) => {
	let { title, technologies, description, budget, contact_email } = req.body
	let errors = []
	
	// Validate Forms
	if(!title) {
		errors.push({ text: 'Please add Title' })
	}

	if(!technologies) {
		errors.push({ text: 'Please add Technologies' })
	}

	if(!description) {
		errors.push({ text: 'Please add Description' })
	}

	if(!contact_email) {
		errors.push({ text: 'Please add Contact E-mail'})
	}

	// Display errors
	if(errors.length > 0) {
		res.render('addGigs', {
			errors,
			title,
			technologies,
			budget,
			description,
			contact_email
		})
	} else {
		// Check the budget
		if(!budget) {
			budget = "Unknown"
		} else {
			budget = `Rp. ${budget}`
		}

		// Make technologies to lower case and remove space after comma
		technologies = technologies.toLowerCase().replace(/, /g, ',')

		Gig.create({
			title,
			technologies,
			description,
			budget,
			contact_email
		})
		.then(gig => res.redirect('/gigs'))
		.catch(err => console.log(err))
	}
})

// Search Gig
router.get('/search', (req, res) => {
	let { term } = req.query

	// Make term to lower case
	term = term.toLowerCase()

	Gig.findAll({ where: { technologies: { [Op.like]: '%' + term + '%'}}})
		.then(gigs => res.render('gigs', {
			gigs
		})).catch(err => console.log(err))
})

module.exports = router