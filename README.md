#### Prerequisite:
- Install Node v10.15.1. You can follow: https://docs.npmjs.com/getting-started/installing-node
- Install Java11 (required by selenium standalone server setup)
- Make sure you have chrome browser installed.

#### Execute tests:
- Clone the repository : `git clone https://github.com/deepikadixitb/hotel_booking_tests.git`
- Go to the repository: `cd hotel_booking_tests`
- Install all the dependencies: `npm install`
- Run the test: `npm test`

The tests can be configured to run on multiple browsers. For more details, follow the configuration setup: https://webdriver.io/docs/configurationfile.html


To run a specific scenario with a tag: `npm run test -- --cucumberOpts.tagExpression='@tag_name'`
