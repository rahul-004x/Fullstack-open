const { test, expect, describe, beforeEach } = require('@playwright/test');
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3005/api/testing/reset');

        // First user creation
        await request.post('http://localhost:3005/api/users', {
            data: {
                name: 'rahul',
                username: 'rahul',
                password: 'rahul004',
            },
        });

        // Second user creation
        await request.post('http://localhost:3005/api/users', {
            data: {
                name: 'otheruser',
                username: 'otheruser',
                password: 'otheruser004',
            },
        });
    
        await page.goto('http://localhost:5174');
    });
    

    test('Login form is shown', async ({ page }) => {
        const locator = await page.getByText('Log in to application');
        await expect(locator).toBeVisible();
        await page.getByRole('button', { name: 'login' }).click();
    });

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'rahul', 'rahul004');
            await expect(page.getByText('rahul logged-in')).toBeVisible();
        });

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'rahul', 'rahul005');
            await expect(page.getByText('wrong credentials')).toBeVisible();
        });
    });

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'rahul', 'rahul004');
            await expect(page.getByText('rahul logged-in')).toBeVisible();
        });
    
        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'new testing blog', 'rahul yadav', 'www.e2e/dev.com', '23');
            await expect(
                page.getByText("A new blog 'new testing blog' by rahul yadav added")
            ).toBeVisible();
        });
    
        test('blog can be liked', async ({ page }) => {
            await createBlog(page, 'new testing blog', 'rahul yadav', 'www.e2e/dev.com', '23');
            await expect(
                page.getByText("A new blog 'new testing blog' by rahul yadav added")
            ).toBeVisible();
    
            await page.getByRole('button', { name: 'View' }).click();
            await page.getByRole('button', { name: 'Like' }).click();
            await expect(page.getByText('likes 24')).toBeVisible();
    
            page.once('dialog', dialog => dialog.accept()); 
            await page.getByRole('button', { name: 'Remove' }).click();
    
            await expect(page.getByText('new testing blog rahul yadav')).not.toBeVisible();
        });
    });
    
    describe('when anoter user logged in ', () => {
        beforeEach(async({ page }) => {
            await loginWith(page, 'rahul', 'rahul004');
            await createBlog(page, 'new testing blog', 'rahul yadav', 'www.e2e/dev.com', '23');
            await page.getByRole('button', { name: 'logout'}).click()
            await loginWith(page, 'otheruser', 'otheruser004');
        })
        test('only creator see the remove button', async({ page }) => {
            await page.getByRole('button', { name: 'View' }).click();
            await expect(await page.getByRole('button', { name: 'Remove' })).toBeHidden()
        })   
    })
    describe('sorted blog', () => {
        beforeEach(async({ page }) => {
            await loginWith(page, 'rahul', 'rahul004')
            await createBlog(page, 'Blog 1', 'Author 1', 'http://blog1.com', '5');
            await createBlog(page, 'Blog 2', 'Author 2', 'http://blog2.com', '10');
            await createBlog(page, 'Blog 3', 'Author 3', 'http://blog3.com', '15');
        })
        test('blogs are ordered by number of likes', async({ page }) => {

            await page.reload(); 

            const blogs = await page.locator('.blog').allTextContents();
            const likes = blogs.map(blog => {
                const match = blog.match(/likes (\d+)/);
                return match ? parseInt(match[1], 10) : 0;
            });

            // Check if likes are in descending order
            for (let i = 0; i < likes.length - 1; i++) {
                expect(likes[i]).toBeGreaterThanOrEqual(likes[i + 1]);
            }
        })
    })
})