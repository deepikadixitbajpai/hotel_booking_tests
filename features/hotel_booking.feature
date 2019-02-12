Feature: Hotel Bookings
  In order to book a room in hotel
  I need to fill the hotel booking form
 
  Scenario: Create a new hotel booking
     Given I am on hotel booking page
       And I enter the following details in the form:
           |firstname| lastname | price| deposit| checkin    | checkout  |
           | New     | Customer | 10   | false  | 2019-07-16 | 2019-07-18|
      When I save the booking
      Then my booking record should be displayed on the page

   Scenario: Delete an existing hotel booking
      Given I am on hotel booking page
        And I enter the following details in the form:
          |firstname| lastname | price| deposit| checkin    | checkout  |
          | New     | Customer | 10   | true   | 2019-08-19 | 2019-08-21|
        And I save the booking
        And my booking record should be displayed on the page
       When I click the delete button for my booking
       Then the booking entry should no longer be displayed on the page
