import { useState } from "react";
import { useMutation } from "@apollo/client";
import Select from 'react-select';
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries";

const AuthorForm = ({ authors }) => {
  const [selectedOption, setSelectedOption] = useState(null)
  const [birth, setBirth] = useState('')

  const [changeBirth] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.log('Error:', error.message)
    }
  })

  const options = authors.map(a => ({
    value: a.name,
    label: a.name
  }))

  const handleChange = (selected) => {
    setSelectedOption(selected)
    console.log('Selected author:', selected.value)
  }

  const submit = async (event) => {
    event.preventDefault()

    if (!selectedOption) {
      return
    }
    
    await changeBirth({ 
      variables: { 
        name: selectedOption.value, 
        setBornTo: Number(birth) 
      }
    })
    setBirth('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <Select
            value={selectedOption}
            onChange={handleChange}
            options={options}
            isSearchable={true} 
            placeholder="Select author"
            isClearable={true}
          />
        </div>
        <div>
          born <input
            type="number"
            value={birth}
            onChange={({ target }) => setBirth(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default AuthorForm