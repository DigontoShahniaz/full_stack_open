const loginWith = async (page, username, password)  => {
  await page.getByRole('button', { name: 'log in' }).click()
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}


const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByPlaceholder('Enter blog title').fill(title)
  await page.getByPlaceholder('Enter blog author').fill(author)
  await page.getByPlaceholder('Enter blog url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(`${title} by ${author}`).waitFor()
}

export { loginWith, createBlog }