import axios from "axios";

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}
export const createAnecdote = async (newAnecdote) => {
    const response = await axios.post(baseUrl, newAnecdote)
    return response.data
}
export const update = async(anecdote) => {
    const updatedAnecdote = { ...anecdote }
    const response = await axios.put(`${baseUrl}/${anecdote.id}`, updatedAnecdote)
    return response.data
}