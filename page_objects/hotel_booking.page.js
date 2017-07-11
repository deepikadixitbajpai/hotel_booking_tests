class Booking {
  constructor(element){
    this.element = element;
  }
  get firstName() {return this.element.$('div:nth-child(1) p').getText(); }
  delete() { this.element.$("input[type='button']").click(); }
}

class BookingForm {
  constructor(form){
    this.form = form
  }

  enterFirstName(firstName){
    this.form.$('#firstname').setValue(firstName);
  }

  enterLastName(lastName){
    this.form.$('#lastname').setValue(lastName);
  }

  enterPrice(price){
    this.form.$('#totalprice').setValue(price);
  }

  selectDepositPaid(deposit){
    this.form.$('#depositpaid').selectByVisibleText(deposit);
  }

  selectCheckinDate(checkinDate){
    this.form.$('#checkin').setValue(checkinDate);
  }

  selectCheckoutDate(checkoutDate){
    this.form.$('#checkout').setValue(checkoutDate);
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
    const originalBookingsCount = this.bookings().length;
    this.bookingForm().save();
    browser.waitUntil(() => {
       return this.bookings().length == originalBookingsCount + 1
    }, 10000, 'expected bookings count to increase by 1 in 10s');
  }

  deleteBooking(firstName) {
    const originalBookingsCount = this.bookings().length;
    this.findBookingByFirstName(firstName).delete()
    browser.waitUntil(() => {
       return this.bookings().length == originalBookingsCount - 1
    }, 10000, 'expected bookings count to decrease by 1 in 10s');
  }

  findBookingByFirstName(firstName) {
    return this.bookings().find((booking) => booking.firstName === firstName);
  }

  /**
   * define or overwrite page methods
   */
  open() {
    browser.url('/');
  }
}

module.exports = HotelBookingPage;
