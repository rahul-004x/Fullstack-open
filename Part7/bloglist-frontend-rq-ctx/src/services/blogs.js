import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (blogObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, blogObject, config)
  return response.data
}

const update = async (id, updatedBlog) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

const getById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch blog')
  }
}

const comments = async(id) => {
  const response = await axios.get(`${baseUrl}/${id}/comments`)
  return response.data.map(comment => ({
    ...comment,
    timeStamp: comment.timeStamp
  }))
}

const addComment = async (id, comment) => {
  const config = {
    headers: { Authorization: token}
  }
  const response = await axios.post(`${baseUrl}/${id}/comments`, comment, config)
  return response.data
}

export default { getAll, create, update, remove, setToken, getById, comments, addComment }