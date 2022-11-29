describe('Initial page', function () {
    before(function () { browser.url('') });

    const expectedTitle = 'PayPal Checkout Sample App';
    it(`has title '${expectedTitle}'`, async function () {
        await expect(browser).toHaveTitle(expectedTitle);
    });

    it('allows for a successful credit card PayPal transaction', async function () {
        /*
        1) Wait for buttons to display
        2) Switch to iframe for buttons
        3) Click credit card button
        4) Wait for credit card form to display
        5) Switch to iframe for credit card form
        6) Fill out payment details
        7) Click pay now button
        8) Wait on spinner
        9) Verify "thank you" message is displayed
        10) Verify receipt details
        */

        const payPalButtonsFrame = $('iframe[title="PayPal"]');
        const payPalCreditCardButton = $('[role="link"][aria-label="Debit or Credit Card"]');
        const payPalCreditCardFormFrame = $('iframe[title="paypal_card_form"]');
        const payPalCreditCardFormPayNowButton = $('button=Pay Now');

        const creditCardNumberInput = $('input[name="cardnumber"]');
        const creditCardExpiryInput = $('input[name="expiry-date"]');
        const creditCardSecurityInput = $('input[name="credit-card-security"]');

        const firstNameInput = $('input[name="givenName"]');
        const lastNameInput = $('input[name="familyName"]');
        const addressLine1Input = $('input[name="line1"]');
        const addressLine2Input = $('input[name="line2"]');
        const cityInput = $('input[name="city"]');
        const stateSelect = $('select[name="state"]');
        const zipCodeInput = $('input[name="postcode"]');
        const phoneNumberInput = $('input[name="phone"]');
        const emailAddressInput = $('input[name="email"]');

        const spinnerLockOverlay = $('[class*="LockIconContainer"]');
        const thankYouMessage = $('h3=Thank you for your payment!');
        const transactionAmount = $('#transaction-amount');
        const transactionCurrency = $('#transaction-currency');
        const transactionPayee = $('#transaction-payee');

        await expect(payPalButtonsFrame).toBeDisplayed();
        await browser.switchToFrame(await payPalButtonsFrame);
        await payPalCreditCardButton.click();

        await expect(payPalCreditCardFormFrame).toBeDisplayed();
        await browser.switchToFrame(await payPalCreditCardFormFrame);

        await creditCardNumberInput.setValue('4012000033330026');
        await creditCardExpiryInput.setValue(getExpiry());
        await creditCardSecurityInput.setValue('111');

        await firstNameInput.setValue('Nick');
        await lastNameInput.setValue('Tester');
        await addressLine1Input.setValue('1234 Test St');
        await addressLine2Input.setValue('');
        await cityInput.setValue('San Diego');
        await stateSelect.selectByVisibleText('California');
        await zipCodeInput.setValue('92123');
        await phoneNumberInput.setValue('6195551212');
        await emailAddressInput.setValue('nick.tester@example.com');

        await browser.waitUntil(async () => {
            await payPalCreditCardFormPayNowButton.click();
            return await spinnerLockOverlay.isExisting();
        }, { interval: 1000 });

        await expect(thankYouMessage).toBeDisplayed({ wait: 30000 });
        await expect(transactionAmount).toHaveText('77.44');
        await expect(transactionCurrency).toHaveText('USD');
        await expect(transactionPayee).toHaveText('sb-9k47al22144790@business.example.com');
    });
});

function getExpiry() {
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    const mm = expiry.getMonth() + 1;
    const yy = expiry.getFullYear().toString().substring(2);
    return `${mm}${yy}`;
}