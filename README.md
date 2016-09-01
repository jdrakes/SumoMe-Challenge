
# SumoMe-Challenge
## Sumo Coding Challenge
## Survey Junkies

### Task
 - Create a web app written in Node.JS using an Express based framework, SequelizeJS, and MySQL.
 - Use the latest stable release of Node.JS v0.10.x.
 - Follow the ES5 JavaScript Style Guide located at: https://github.com/airbnb/javascript/tree/master/es5
 - Use NPM to declare all dependencies so that we can run it in a test environment.
 - The app should allow an admin to enter survey questions with multiple choice answers.
 - When a guest visits the app in a browser it should present a random survey question to the guest and allow them to answer.
 - Avoid showing a previously answered question to the same guest.
 - Record answers and display the survey results in an admin interface.
 - Secure the admin interface from guests.
 - Make sure the UI is mobile browser friendly.
 - Provide a clear README with instructions on how to setup and run the app.
 - Create a github.com repository with the app that we can pull from and test.
 - Provide a link to your application running on a publicly accessible server with any credentials needed to fully test it.


### URL: http://72.182.77.134:3002/

### Description
> I created a web app for the fictitious survey app called Survey Junkies. The aim of the web app is to provide users with fun questions mixed with research questions for feedback and curiosity.

### Instructions
>  New users can be added to application via the signup page. Admin can sign in at /admin credentials admin@survjunk.com pass: root. Once Admin is signed in they can start making questions and looking at survey results. 

### Web Pages
 - Home Page
 - Sign Up Page
 - Login Page
 - User Page
 - Admin Login Page
 - Admin User Page

### Components
 - Node JS
 - Express JS
 - MySQL
 - Sequelize JS
 - Bootstrap 3

### Functionality
 - Guests and users will receive random unanswered questions while navigating web app
 - Guests questions are only unique as long as their session is active
 - Admin can navigate app pop up free
 - Admin can create new questions (up to 3 answer choices) and see survey results
 - Only admin has access to admin pages and information
 - If no new unique questions left guests will not receive pop up
