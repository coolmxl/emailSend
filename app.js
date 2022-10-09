const ejs = require("ejs") //ejs模版引擎
const fs = require("fs") //文件读写
const path = require("path") //路径配置
const nodemailer = require("nodemailer") //发送邮件的node插件
const method = require('./index.js')
const getOne = require("./one.js")
var schedule = require('node-schedule');



var mailTransport = nodemailer.createTransport({
  host: "smtp.qq.com",
  secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
  auth: {
    user: "1784090364@qq.com",
    pass: "******",
  },
})
//邮件主题
let EmailSubject = "一封暖暖的小邮件"

//传给EJS的数据
let data = {
  title: "~",
}
function scheduleCronstyle(){
  schedule.scheduleJob('30 20 5 * * *', async function(){
      data.threeDaysData = await method.getWeatherData()
      data.weatherTip = await method.getWeatherTips()
      data.todayOneData = await getOne.getOne()
      data.hotSearch = await method.getHotSearch()
      const template = ejs.compile(
        fs.readFileSync(path.resolve(__dirname, "mail.ejs"), "utf8")
      )
      //将数据传入模版中，生成HTML
      const html = template(data)
      fs.writeFileSync(`${__dirname}/demo.html`, html, "utf-8")
      var options = {
        from: '"1784090364" <1784090364@qq.com>',
        to: '"2746626701" <2746626701@qq.com>',
        // to: '"2198271591" <2198271591@qq.com>',
        subject: EmailSubject,
        html: html,
      }
      
      mailTransport.sendMail(options, function (err, msg) {
        if (err) {
          console.log("index", { title: err })
        } else {
          console.log("index", { title: "已接收：" + msg.accepted })
        }
      })
  }); 
}
scheduleCronstyle();


