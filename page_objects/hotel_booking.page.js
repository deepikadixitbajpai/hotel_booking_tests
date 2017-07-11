class Booking {
  constructor(element){
    this.element = element;
  }
  firstname() {return this.element.$('div:nth-child(1) p').getText(); }
  lastname() {return this.element.$('div:nth-child(2) p').getText(); }
  price() {return this.element.$('div:nth-child(3) p').getText(); }
  depositPaid() {return this.element.$('div:nth-child(4) p').getText(); }
  checkinDate() {return this.element.$('div:nth-child(5) p').getText(); }
  checkoutDate() {return this.element.$('div:nth-child(6) p').getText(); }

  bookingId() {return this.element.getAttribute('id'); }
  delete() { this.element.$("input[type='button']").click(); }
}

class BookingForm {
  constructor(form){
    this.form = form
  }

  firstname() {
    return this.form.$('#firstname').getValue();
  }

  enterData(bookingData){
    this.form.$('#firstname').setValue(bookingData.firstname);
    this.form.$('#lastname').setValue(bookingData.lastname);
    this.form.$('#totalprice').setValue(bookingData.price);
    this.form.$('#depositpaid').selectByVisibleText(bookingData.depositPaid);
    this.form.$('#checkin').setValue(bookingData.checkinDate);
    this.form.$('#checkout').setValue(bookingData.checkoutDate);
  }

  save() {
    this.form.$("input[type='button']").click();
  }
}

class HotelBookingPage {

  get heading() { return browser.getTitle(); }

  bookingForm() { return new BookingForm(browser.$('#form')); }

  bookings() {
    const allRows = browser.$$('#bookings div.row');
    // remove header row
    allRows.shift();
    return allRows.map((row) => new Booking(row))
  }

  saveBooking() {
    const firstname = this.bookingForm().firstname();
    this.bookingForm().save();
    let savedBooking;
    browser.waitUntil(() => {
      const booking = this.findBookingByFirstname(firstname);
      if(booking != null) {
        savedBooking = booking
        return true;
      }
      return false;
    }, 10000, 'expected bookings count to be saved in 10s');
    return savedBooking;
  }

  deleteBooking(bookingId) {
    const originalBookingsCount = this.bookings().length;
    this.findBookingByBookingId(bookingId).delete()
    browser.waitUntil(() => {
       return this.findBookingByBookingId(bookingId) == null;
    }, 10000, 'expected bookings count to be deleted in 10s');
  }

  findBookingByFirstname(firstname) {
    return this.bookings().find((booking) => booking.firstname() === firstname);
  }

  findBookingByBookingId(bookingId) {
    return this.bookings().find((booking) => booking.bookingId() === bookingId);
  }

  /**
   * define or overwrite page methods
   */
  open() {
    browser.url('/');
  }
}

module.exports = HotelBookingPage;
