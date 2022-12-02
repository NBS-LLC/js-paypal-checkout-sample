describe('PayPal standard checkout', function () {
    before(function () { browser.url(''); });

    it('allows for successful credit card transaction', async function () {
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

        const spinnerLockOverlay = $('#spinner-lock-title');
        const thankYouMessage = $('h3=Thank you for your payment!');
        const transactionAmount = $('#transaction-amount');
        const transactionCurrency = $('#transaction-currency');
        const transactionPayee = $('#transaction-payee');

        await expect(payPalButtonsFrame).toBeDisplayed();
        await browser.switchToFrame(await payPalButtonsFrame);
        await payPalCreditCardButton.click();

        await expect(payPalCreditCardFormFrame).toBeDisplayed();
        await browser.switchToFrame(await payPalCreditCardFormFrame);
        await expect(payPalCreditCardFormPayNowButton).toBeDisplayed();

        await creditCardNumberInput.setValue('4012000033330026'); // Visa test card provided by PayPal
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

/**
 * @returns An expiration date one year in the future.
 */
function getExpiry() {
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    const mm = expiry.toLocaleDateString("en-US", { month: "2-digit" });
    const yy = expiry.toLocaleDateString("en-US", { year: "2-digit" });
    return `${mm}${yy}`
}
