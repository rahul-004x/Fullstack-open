const loginWith = async (page, username, password) => {
    await page.getByTestId('username').fill(username);
    await page.getByTestId('password').fill(password);
    await page.getByRole('button', { name: 'login' }).click();
};

const createBlog = async (page, title, author, url, likes) => {
    await page.getByRole('button', { name: 'create new blog' }).click();
    await page.getByTestId('title').fill(title);
    await page.getByTestId('author').fill(author);
    await page.getByTestId('url').fill(url);
    await page.getByTestId('likes').fill(likes);
    await page.getByRole('button', { name: 'create' }).click();
};

module.exports = { loginWith, createBlog };