const uuidv4 = require('uuid/v4');
const expect = require('chai').expect;
const HotelBookingPage = require('../../page_objects/hotel_booking.page');
const hotelBookingPage = new HotelBookingPage();
const { Given, When, Then } = require('cucumber');

class BookingData {
  constructor(firstname, lastname, price, depositPaid, checkinDate, checkoutDate){
    this._firstname = firstname,
    this._lastname = lastname;
    this._price = price;
    this._depositPaid = depositPaid;
    this._checkinDate = checkinDate;
    this._checkoutDate = checkoutDate;
  }

  get firstname() {return this._firstname; }
  get lastname() {return this._lastname; }
  get price() {return this._price; }
  get depositPaid() {return this._depositPaid; }
  get checkinDate() {return this._checkinDate; }
  get checkoutDate() {return this._checkoutDate; }
}

  let savedBooking, bookingData;
  Given(/^I am on hotel booking page$/, () => {
     hotelBookingPage.open();
     expect(hotelBookingPage.heading).to.eql('Hotel booking form');
  });

  Given(/^I enter the following details in the form:$/, (table) => {
     for(var i in table.hashes()) {
       bookingData = new BookingData(
         table.hashes()[i]['FirstnamePrefix'] + uuidv4(),
         table.hashes()[i]['Lastname'],
         table.hashes()[i]['Price'],
         table.hashes()[i]['Deposit'],
         table.hashes()[i]['Checkin'],
         table.hashes()[i]['Checkout']
       );
       hotelBookingPage.bookingForm().enterData(bookingData);
     }
  });

  When(/^I save the booking$/, () => {
     savedBooking = hotelBookingPage.saveBooking();
  });

  Then(/^my booking record should be displayed on the page$/, () => {
     expect(savedBooking.firstname()).to.eql(bookingData.firstname);
     expect(savedBooking.price()).to.eql(bookingData.price);
     expect(savedBooking.depositPaid()).to.eql(bookingData.depositPaid);
     expect(savedBooking.checkinDate()).to.eql(bookingData.checkinDate);
     expect(savedBooking.checkoutDate()).to.eql(bookingData.checkoutDate);
  });

  Then(/^I click the delete button for my booking$/, () => {
     hotelBookingPage.deleteBooking(savedBooking.bookingId());
  });

  Then(/^the booking entry should no longer be displayed on the page$/, () => {
     expect(hotelBookingPage.findBookingByFirstname(bookingData.firstname)).to.not.exist;
  });
