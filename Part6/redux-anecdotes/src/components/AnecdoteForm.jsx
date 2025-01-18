import { useDispatch } from 'react-redux';
import { createNewAnecdote } from '../reducers/anecdoteReducer';
import { setNotificationWithTimeout } from '../reducers/notificationReducer';

const AnecdoteForm = () => {
    const dispatch = useDispatch();
    
    const addNew = async (event) => {
        event.preventDefault();
        const content = event.target.input.value;
        event.target.input.value = '';
        dispatch(createNewAnecdote(content));
        dispatch(setNotificationWithTimeout(`You created '${content}'`, 5));
    };

    return (
        <form onSubmit={addNew}>
            <div>
                <h2>create new</h2>
                <div><input name="input" /></div>
                <button>create</button>
            </div>
        </form>
    );
}

export default AnecdoteForm;