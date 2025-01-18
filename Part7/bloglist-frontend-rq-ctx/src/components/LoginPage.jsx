import React, { useState } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'
import Notification from './Notification'
import { useNavigate } from 'react-router-dom'
import styles from './LoginPage.module.css'

const LoginPage = ({ userDispatch, notify, notification }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      userDispatch({ type: 'SET_USER', payload: user })
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      notify('Login successful')
      navigate('/')
    } catch (exception) {
      notify('Wrong credentials', true)
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2 className={styles.loginTitle}>Log in to application</h2>
        {notification && <Notification message={notification.message} error={notification.error} />}
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Username</label>
            <input
              required
              className={styles.input}
              data-testid='username'
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input
              required
              className={styles.input}
              data-testid='password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button className={styles.loginButton} type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage