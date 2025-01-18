import { useSelector, useDispatch } from "react-redux";
import { setNotificationWithTimeout } from "../reducers/notificationReducer";
import { voteAnecdote } from '../reducers/anecdoteReducer';

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)
    const dispatch = useDispatch()

    const vote = (anecdote) => {
        dispatch(voteAnecdote(anecdote))
        dispatch(setNotificationWithTimeout(`You voted '${anecdote.content}'`, 5))
    }

    const sortByVotes = (a, b) => b.votes - a.votes

    const filteredAnecdotes = anecdotes.filter(anecdote =>
        anecdote?.content?.toLowerCase?.().includes(filter.toLowerCase()) || false
    )

    const sortedAnecdotes = [...filteredAnecdotes].sort(sortByVotes)

    return (
        <div>
            {sortedAnecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList;