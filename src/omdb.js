const fetch = require('node-fetch')

const { OMDB_API_KEY } = process.env
const API_URL = 'https://www.omdbapi.com'

const search = async query => {
  const url = new URL(API_URL)
  url.searchParams.set('apikey', OMDB_API_KEY)
  url.searchParams.set('v', 1)
  url.searchParams.set('s', query)

  const response = await fetch(url)
  const {
    Response: success,
    Search: searchResults
  } = await response.json()

  return success === 'True' ? searchResults : []
}

const getTitle = async id => {
  const url = new URL(API_URL)
  url.searchParams.set('apikey', OMDB_API_KEY)
  url.searchParams.set('v', 1)
  url.searchParams.set('i', id)

  const response = await fetch(url)
  const {
    Response: success,
    Error: error,
    ...title
  } = await response.json()

  if (success === 'True') {
    return title
  }

  throw new Error(error)
}

module.exports = { search, getTitle }
