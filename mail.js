const nodemailer = require("nodemailer");
 

 async function sendMail(amt,mail,days){
    try{
let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user : "temp.sharma94@gmail.com",
        pass : "mvjtzwtvmngemgro",
    },
    port : 465,
    host : "smtp.gmail.com"
})

if(days < 0){
    days = "YOUR REPYAMENT HAS BEEN PAST, REPAY ASAP!"
}else{
    days = ` Remaining Days : ${days} Days `
}

let html = `<div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;background-image: linear-gradient(to bottom, #9281FF, #FFFFFF 100%)">
<h2 style="text-align: center; text-transform: uppercase;color: ; ">Dygnify : Repayment Is Pending ⚠️</h2>
<p>Amount : ${amt}
</p>
<p>${days} 
</p>
<a href="https://www.dygnify.in/#/borrowerDashboard/overview" style="background: green; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Repayment</a>
`;

let message = {
    from : "temp.sharma94@gmail.com",
    to : mail,
    subject : "⚠️Dygnify : your repayment is pending",
    // text : "Do repayment asap💰💰💰",
    html : html
}


mailTransporter.sendMail(message, (err)=>{
    if(err){
        console.log(err);
    }else{
    console.log("emial has been sent");
    }
})

    }catch(err){
        console.log(err)
    }
}





module.exports = {sendMail}