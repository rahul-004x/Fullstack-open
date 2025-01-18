import React from 'react';
import { MemoryRouter } from 'react-router-dom'; // For `useNavigate` support
import LoginPage from '../components/LoginPage'; // Correct path to the component
import styles from '../components/LoginPage.module.css'; // Correct path to the CSS module

export default {
  title: 'Pages/LoginPage',
  component: LoginPage,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className={styles.wrapper}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

// Mock functions and props
const mockUserDispatch = () => {};
const mockNotify = (message, isError) => console.log({ message, isError });
const mockNotification = { message: 'Sample notification', error: false };

const Template = (args) => <LoginPage {...args} />;

export const Default = Template.bind({});
Default.args = {
  userDispatch: mockUserDispatch,
  notify: mockNotify,
  notification: mockNotification,
};

export const WithErrorNotification = Template.bind({});
WithErrorNotification.args = {
  userDispatch: mockUserDispatch,
  notify: mockNotify,
  notification: { message: 'Error logging in', error: true },
};
