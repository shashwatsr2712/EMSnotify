# EMSnotify
A basic Entry Management Software used to schedule a meeting between a visitor and a host, sending SMS/e-mails to both the sides.


# Description
* NodeJS and Express along with BodyParser, NodeMailer, NexMo and Node-Cron have been used in development.
* The root path of the app is ```/ems``` (```localhost:3000/ems/```) where form for filling in visitor's and host's details is displayed.
* The form submits to ```/ems/submit``` (POST request) where the SMS and e-mails are sent/scheduled. Then, user is redirected to```/ems/success``` where simply a success message is displayed.

# Folder Organisation
* ```app.js``` is the entry point of the app, which renders ```index.ejs```.
* All ```.ejs``` files are present in ```views``` directory.
* Custom stylesheet is present in ```public/views``` directory.

# Points to Note
* For sending instant e-mail to host, e-mail address of the sender(company) should be put in place of ```<COMPANY_EMAIL_ADDRESS>``` for NodeMailer.
* For sending instant SMS to host, one way is to use 'e-mail to SMS gateway' using NodeMailer itself, if this service is avalable in the region/for an operator. The method written in this app uses the NexMo API. As it is a paid service, ```<API_KEY>``` and ```<API_SECRET>``` have to be put in the code along with ```<COMPANY_PHONE_NUMBER>``` (for the sender).
* For sending a scheduled e-mail to visitor, ```node-cron``` is used along with NodeMailer. Emails are scheduled as per the check-out time. E-mail address of the sender(company) has to be put in place of ```<COMPANY_EMAIL_ADDRESS>``` in the code. 
