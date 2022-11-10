describe('Initial page', function () {
    before(function () { browser.url('') });

    const expectedTitle = 'PayPal Checkout Sample App';
    it(`has title '${expectedTitle}'`, async function () {
        await expect(browser).toHaveTitle(expectedTitle);
    });
});