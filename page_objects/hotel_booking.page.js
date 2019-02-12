module.exports = {
  open: () => {
    browser.url('/');
  },

  getHeading: () => browser.getTitle(),

  fillBookingForm: customerDetails => {
    browser.element('#firstname').setValue(customerDetails.firstname);
    browser.element('#lastname').setValue(customerDetails.lastname);
    browser.element('#totalprice').setValue(customerDetails.price);
    browser.element('#depositpaid').selectByVisibleText(customerDetails.deposit);
    browser.element('#checkin').setValue(customerDetails.checkin);
    browser.element('#checkout').setValue(customerDetails.checkout);
  },

  saveBooking: firstName => {
    browser.element('input[value=" Save "]').click();
    let savedBooking;

    browser.waitUntil(
      () => {
        const booking = module.exports.findBookingByFirstname(firstName);
        if (booking != null) {
          savedBooking = booking;
          return true;
        }
        return false;
      },
      browser.options.waitforTimeout,
      'expected bookings count to be saved in 10s',
    );

    return {
      bookingId: savedBooking.getAttribute('id'),
      firstName: savedBooking.element('div:nth-child(1) p').getText(),
      lastName: savedBooking.element('div:nth-child(2) p').getText(),
      price: savedBooking.element('div:nth-child(3) p').getText(),
      depositPaid: savedBooking.element('div:nth-child(4) p').getText(),
      checkinDate: savedBooking.element('div:nth-child(5) p').getText(),
      checkoutDate: savedBooking.element('div:nth-child(6) p').getText(),
    };
  },

  bookings: () => {
    const allRows = browser.elements('#bookings div.row');
    // delete the headings row
    allRows.value.shift();
    return allRows.value;
  },

  deleteBooking: bookingId => {
    module.exports
      .findBookingByBookingId(bookingId)
      .element('input[value="Delete"]')
      .click();

    browser.waitUntil(
      () => module.exports.findBookingByBookingId(bookingId) === false,
      browser.options.waitforTimeout,
      'expected booking to be deleted in 10s',
    );
  },

  findBookingByFirstname: firstname =>
    module.exports
      .bookings()
      .find(booking => booking.element('div:nth-child(1) p').getText() === firstname),

  findBookingByBookingId: bookingId => {
    const bookingDetails = module.exports
      .bookings()
      .find(booking => booking.getAttribute('id') === bookingId);
    if (bookingDetails === undefined) {
      return false;
    }
    return bookingDetails;
  },
};
