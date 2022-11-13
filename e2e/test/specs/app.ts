describe('PayPal standard checkout', function () {
    before(function () { browser.url(''); });

    it('allows for successful credit card transaction', async function () {
        const payPalButtonsFrame = await $('iframe[title="PayPal"]');
        const payPalCreditCardButton = await $('[role="link"][aria-label="Debit or Credit Card"]');
        const payPalCreditCardFormFrame = await $('iframe[title="paypal_card_form"]');
        const payPalCreditCardFormPayNowButton = await $('button=Pay Now');

        const creditCardNumberInput = await $('input[name="cardnumber"]');
        const creditCardExpiryInput = await $('input[name="expiry-date"]');
        const creditCardSecurityInput = await $('input[name="credit-card-security"]');

        const firstNameInput = await $('input[name="givenName"]');
        const lastNameInput = await $('input[name="familyName"]');
        const addressLine1Input = await $('input[name="line1"]');
        const addressLine2Input = await $('input[name="line2"]');
        const cityInput = await $('input[name="city"]');
        const stateSelect = await $('select[name="state"]');
        const zipCodeInput = await $('input[name="postcode"]');
        const phoneNumberInput = await $('input[name="phone"]');
        const emailAddressInput = await $('input[name="email"]');

        const thankYouMessage = await $('h3=Thank you for your payment!');

        await expect(payPalButtonsFrame).toBeDisplayed();
        await browser.switchToFrame(payPalButtonsFrame);
        await payPalCreditCardButton.click();

        await expect(payPalCreditCardFormFrame).toBeDisplayed();
        await browser.switchToFrame(payPalCreditCardFormFrame);
        await expect(payPalCreditCardFormPayNowButton).toBeDisplayed();

        await creditCardNumberInput.setValue('4012000033330026'); // Visa test card provided by PayPal
        await creditCardExpiryInput.setValue('11/25'); // TODO: Use dynamic date and year
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

        await browser.pause(1000); // TODO: Replace with dynamic wait
        await payPalCreditCardFormPayNowButton.click();

        await expect(thankYouMessage).toBeDisplayed({ wait: 30000 });
    });
});