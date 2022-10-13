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
    pass: "hcrlfqtkryyacadj",
  },
})
//邮件主题
let EmailSubject = "一封暖暖的小邮件"

//传给EJS的数据
let data = {
  title: "咫尺远却近❤",
}
function scheduleCronstyle(){
  schedule.scheduleJob('30 20 5 * * *', async function(){
    data.threeDaysData = await method.getWeatherData()
    data.weatherTip = await method.getWeatherTips()
    console.log(data.weatherTip,'data.weatherTip')
    data.todayOneData = await method.getImgData()
    data.oneWord = await method.oneWord()
    data.getDayData = await method.getDayData()
    data.shiJu = await method.getShiJu()
    data.title += `今天是我们认识的第: ${data.getDayData.countDay} 天`
    data.hotSearch = await method.getHotSearch()
      const template = ejs.compile(
        fs.readFileSync(path.resolve(__dirname, "mail.ejs"), "utf8")
      )
      //将数据传入模版中，生成HTML
      const html = template(data)
      fs.writeFileSync(`${__dirname}/demo.html`, html, "utf-8")
      var options = {
        from: '"毛鑫林" <1784090364@qq.com>',
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


