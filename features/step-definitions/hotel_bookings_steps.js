const uuidv4 = require('uuid/v4');
const expect = require('chai').expect;
const HotelBookingPage = require('../../page_objects/hotel_booking.page');
const hotelBookingPage = new HotelBookingPage();

module.exports = function () {
  let firstName;
  this.Given(/^I am on hotel booking page$/, function () {
     hotelBookingPage.open();
     expect(hotelBookingPage.heading).to.eql('Hotel booking form');
  });

  this.Given(/^I enter the following details in the form:$/, function (table) {
     for(var i in table.hashes()) {
       const bookingForm = hotelBookingPage.bookingForm();
       const firstNamePrefix= table.hashes()[i]['FirstnamePrefix']
       firstName = firstNamePrefix + uuidv4();
       bookingForm.enterFirstName(firstName);
       bookingForm.enterLastName(table.hashes()[i]['Surname']);
       bookingForm.enterPrice(table.hashes()[i]['Price']);
       bookingForm.selectDepositPaid(table.hashes()[i]['Deposit']);
       bookingForm.selectCheckinDate(table.hashes()[i]['Checkin']);
       bookingForm.selectCheckoutDate(table.hashes()[i]['Checkout']);
     }
  });

  this.When(/^I save the booking$/, function () {
     hotelBookingPage.saveBooking();
  });

  this.Then(/^my booking record should be displayed on the page$/, function () {
     expect(hotelBookingPage.findBookingByFirstName(firstName)).to.exist;
  });

  this.Then(/^I click the delete button for my booking$/, function () {
     hotelBookingPage.deleteBooking(firstName);
  });

  this.Then(/^the booking entry should no longer be displayed on the page$/, function () {
     expect(hotelBookingPage.findBookingByFirstName(firstName)).to.not.exist;
  });
};
