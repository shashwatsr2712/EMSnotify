/*
Entry Management Software
Author: Shashwat Srivastava
Thu Nov 28 | 16:45
*/

const express=require('express');
const bodyParser=require('body-parser');
const app=express();
const nodeMailer=require("nodemailer");
const nexMo=require('nexmo');
const cron=require('node-cron');

app.use(express.static(__dirname+'/public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

//Form for visitor and host details
app.get('/ems',(req,res)=>{
    res.render('index');
});

//Submit form to send emails and message
app.post('/ems/submit',(req,res)=>{
    let vName=req.body.vName;
    let vEmail=req.body.vEmail;
    let vPhone=req.body.vPhone;
    let vCI=req.body.vCI;
    let vCO=req.body.vCO;
    let hName=req.body.hName;
    let hEmail=req.body.hEmail;
    let hPhone=req.body.hPhone;
    let hAddress=req.body.hAddress;

    //Send e-mail to host
    let transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: '<COMPANY_EMAIL_ADDRESS>',
            pass: '<COMPANY_EMAIL_PASSWORD>'
        }
    });
    let mailOptions = {
        from: '<COMPANY_EMAIL_ADDRESS>',
        to: hEmail,
        subject: '[IMPORTANT] Schedule of upcoming Visit/Meeting',
        text: 'Your meeting with '+vName+' is scheduled from '+vCI+' to '+vCO+' today. Contact details of the visitor are: Phone - '+vPhone+' and Email - '+vEmail
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    //Send SMS to host using NexMo
    const nexmo = new nexMo({
        apiKey: '<API_KEY>',
        apiSecret: '<API_SECRET>',
    });   
    const from = '<COMPANY_PHONE_NUMBER>';
    const to = hPhone;
    const text = 'Your meeting with '+vName+' is scheduled from '+vCI+' to '+vCO+' today. Contact details of the visitor are: Phone - '+vPhone+' and Email - '+vEmail;
    nexmo.message.sendSms(from, to, text);

    //Send a scheduled e-mail to visitor after checkout time
    let transporter1 = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: '<COMPANY_EMAIL_ADDRESS>',
            pass: '<COMPANY_EMAIL_PASSWORD>'
        }
    });
    let mailOptions1={
        from: '<COMPANY_EMAIL_ADDRESS>',
        to: vEmail,
        subject: 'Thanks for visiting!',
        text: 'Thanks '+vName+' ('+vPhone+') for meeting '+hName+' between '+vCI+' and '+vCO+' at '+hAddress
    };
    let x=vCO.split(":");
    let h=x[0];
    let m=x[1];
    let flag=false;
    const task=cron.schedule(h+' '+m+' * * *', () => {
        transporter1.sendMail(mailOptions1, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
            flag=true;
        });
    });
    if(flag){
        task.stop();
    }

    res.redirect('/ems/success');
});

//Success page
app.get('/ems/success',(req,res)=>{
    res.render('success');
});

const port=process.env.PORT||3000;
const server=app.listen(port,()=>{
    console.log('Server has been started!');
});
