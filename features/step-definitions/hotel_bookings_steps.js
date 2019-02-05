const expect = require('chai').expect;
const uuidv4 = require('uuid/v4');

const hotelBookingPage = require('../../page_objects/hotel_booking.page');
const { Given, When, Then } = require('cucumber');

Given(/^I am on hotel booking page$/, () => {
   hotelBookingPage.open();
   expect(hotelBookingPage.getHeading()).to.eql('Hotel booking form');
});

Given(/^I enter the following details in the form:$/, (table) => {
   customerDetails = table.hashes();
   for(var i in customerDetails) {
      customerDetails[i].firstname = customerDetails[i].firstname + uuidv4();
      hotelBookingPage.fillBookingForm(customerDetails[i]);
   }
});

When(/^I save the booking$/, () => {
   savedBooking = hotelBookingPage.saveBooking(customerDetails[0].firstname);
});

Then(/^my booking record should be displayed on the page$/, () => {
   expect(savedBooking.firstName).to.eql(customerDetails[0].firstname);
   expect(savedBooking.price).to.eql(customerDetails[0].price);
   expect(savedBooking.depositPaid).to.eql(customerDetails[0].deposit);
   expect(savedBooking.checkinDate).to.eql(customerDetails[0].checkin);
   expect(savedBooking.checkoutDate).to.eql(customerDetails[0].checkout);
});

Then(/^I click the delete button for my booking$/, () => {
   hotelBookingPage.deleteBooking(savedBooking.bookingId);
});

Then(/^the booking entry should no longer be displayed on the page$/, () => {
   expect(hotelBookingPage.findBookingByFirstname(savedBooking.firstName)).to.not.exist;
});
