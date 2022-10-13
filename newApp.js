const nodemailer = require("nodemailer");
const schedule = require("node-schedule");
const request = require("superagent");
const cheerio = require("cheerio");
const template = require('art-template');
const path = require("path");
const method = require('./index.js')
// 发送邮件函数
// async function sendMail() {
//   const html = await renderTemplate()  // 渲染模板函数
//   var user = "1784090364@qq.com";// 自己的邮箱地址
//   var pass = "hcrlfqtkryyacadj"; // 邮箱授权码
//   var to = "2198271591@qq.com";// 女朋友的邮箱地址，有多个的话逗号隔开即可
//   let transporter = nodemailer.createTransport({
//     host: "smtp.qq.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: user,
//       pass: pass,
//     },
//   });
//   let info = await transporter.sendMail({
//     from: `<${user}>`, // 填入发件人信息
//     to: `亲爱的宝贝<${to}>`, // 填入收件人信息
//     subject: "一封暖暖的小邮件~", // 邮件主题
//     html: html, // 发送内容，可选text（普通文本）和html（网页形式）
//   });
//   console.log("发送成功");
// }

function getDayData() {
  let current = new Date()
  // 获取认识时间
  let known = new Date('2022-1-14')
  // 获取认识的时间
  let res = Math.ceil((current - known) / 1000 / 60 / 60 / 24)
  return {
    countDay: res
  }
}
function getHoneyedWords () {
  let url = 'https://chp.shadiao.app/api.php' // api地址
  return new Promise ( (resolve, reject) => {
    request.get(url).end((err, res) => {
      if (err) {
        console.error('honeyedWords获取失败')
        return
      }
      resolve({
        text: res.text
      })
    })
  })
}

async function renderTemplate() {  // 渲染模板
  // 获取数据
  const dayData = getDayData();
  const honeyedWords = await getHoneyedWords();
  const threeDaysData = await method.getWeatherData()
  const weatherTip = await method.getWeatherTips()
  // const todayOneData = await getOne.getOne()
  const hotSearch = await method.getHotSearch()
  console.log(dayData)
  console.log(honeyedWords)
  console.log(threeDaysData)
  console.log(weatherTip)
  console.log(hotSearch)
    
  // 加载模板
  return new Promise( (resolve, reject) => {
    const html = template(path.join(__dirname, './template.html'), {
      dayData,
      threeDaysData,
      weatherTip,
      hotSearch,
      honeyedWords
    })
    resolve(html)
  })
}
// sendMail()

renderTemplate()
// 每天下午5点21分准时发送
// schedule.scheduleJob({ hour: 17, minute: 21 }, function () {
//   console.log("吉时已到:" + new Date())
//   sendMail()
// })