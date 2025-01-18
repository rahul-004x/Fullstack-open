import axios from 'axios'
const baseUrl = '/api/users'  // Changed from '/api/blogs' to '/api/users'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch user')
  }
}

export default { getAll, getById }