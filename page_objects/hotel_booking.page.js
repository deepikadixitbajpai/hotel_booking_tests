module.exports = {
  getHeading: () => browser.getTitle(),

  fillBookingForm: customerDetails => {
    browser.element('#firstname').setValue(customerDetails.firstname);
    browser.element('#lastname').setValue(customerDetails.lastname);
    browser.element('#totalprice').setValue(customerDetails.price);
    browser.element('#depositpaid').selectByVisibleText(customerDetails.deposit);
    browser.element('#checkin').setValue(customerDetails.checkin);
    browser.element('#checkout').setValue(customerDetails.checkout);
  },

  bookings: () => {
    const allRows = browser.elements('#bookings div.row');
    allRows.value.shift();
    return allRows.value;
  },

  saveBooking: firstName => {
    console.log('customerName:', firstName);
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

    const bookingObject = {
      bookingId: savedBooking.getAttribute('id'),
      firstName: savedBooking.element('div:nth-child(1) p').getText(),
      lastName: savedBooking.element('div:nth-child(2) p').getText(),
      price: savedBooking.element('div:nth-child(3) p').getText(),
      depositPaid: savedBooking.element('div:nth-child(4) p').getText(),
      checkinDate: savedBooking.element('div:nth-child(5) p').getText(),
      checkoutDate: savedBooking.element('div:nth-child(6) p').getText(),
    };
    return bookingObject;
  },

  deleteBooking: bookingId => {
    module.exports
      .findBookingByBookingId(bookingId)
      .$('input[value="Delete"]')
      .click();
    // browser.pause(5000)
    browser.waitUntil(
      () => {
        const booking = module.exports.findBookingByBookingId(bookingId);
        console.log('what is booking status:', booking);
        if (booking === false) {
          return true;
        }
        return false;
      },
      browser.options.waitforTimeout,
      'expected booking to be deleted in 10s',
    );
  },

  findBookingByFirstname: firstname =>
    module.exports
      .bookings()
      .find(booking => booking.element('div:nth-child(1) p').getText() === firstname),

  findBookingByBookingId: bookingId => {
    try {
      const bookingDetails = module.exports
        .bookings()
        .find(booking => booking.getAttribute('id') === bookingId);
      if (bookingDetails === undefined) {
        return false;
      }
      return bookingDetails;
    } catch (error) {
      return console.log('error is:', error.message);
    }
  },

  /**
   * define or overwrite page methods
   */
  open: () => {
    browser.url('/');
  },
};
