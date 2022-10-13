const ejs = require("ejs") //ejs模版引擎
const fs = require("fs") //文件读写
const path = require("path") //路径配置
const nodemailer = require("nodemailer") //发送邮件的node插件

// const hot = require("./hotSearch.json")
const superagent = require("superagent")
const cheerio = require("cheerio")
const request = require("request")

const local = "sichuan/chengdu"
const WeatherUrl = "https://tianqi.moji.com/weather/china/" + local
const options = {
  getWeatherTips() {
    let p = new Promise(function (resolve, reject) {
      superagent.get(WeatherUrl).end(function (err, res) {
        if (err) {
          reject(err)
        }
        let threeDaysData = []
        let weatherTip = ""
        let $ = cheerio.load(res.text)
        $(".wea_tips").each(function (i, elem) {
          weatherTip = $(elem).find("em").text()
        })
        resolve(weatherTip)
      })
    })
    return p
  },
  getWeatherData() {
    let p = new Promise(function (resolve, reject) {
      superagent.get(WeatherUrl).end(function (err, res) {
        if (err) {
          reject(err)
        }
        let threeDaysData = []
        let weatherTip = ""
        let $ = cheerio.load(res.text)
        $(".forecast .days").each(function (i, elem) {
          const SingleDay = $(elem).find("li")
          threeDaysData.push({
            Day: $(SingleDay[0])
              .text()
              .replace(/(^\s*)|(\s*$)/g, ""),
            WeatherImgUrl: $(SingleDay[1]).find("img").attr("src"),
            WeatherText: $(SingleDay[1])
              .text()
              .replace(/(^\s*)|(\s*$)/g, ""),
            Temperature: $(SingleDay[2])
              .text()
              .replace(/(^\s*)|(\s*$)/g, ""),
            WindDirection: $(SingleDay[3])
              .find("em")
              .text()
              .replace(/(^\s*)|(\s*$)/g, ""),
            WindLevel: $(SingleDay[3])
              .find("b")
              .text()
              .replace(/(^\s*)|(\s*$)/g, ""),
            Pollution: $(SingleDay[4])
              .text()
              .replace(/(^\s*)|(\s*$)/g, ""),
            PollutionLevel: $(SingleDay[4]).find("strong").attr("class"),
          })
        })
        resolve(threeDaysData)
      })
    })
    return p
  },
  getHotSearch() {
    return new Promise((resolve, reject) => {
      request(
        "https://weibo.com/ajax/side/hotSearch",
        function (error, response) {
          if (!error && response.statusCode == 200) {
            // console.log(JSON.parse(response.body).data.hotgov)
            const realtime = JSON.parse(response.body).data.realtime.slice(0, 9)
            resolve(realtime)
          }
        }
      )
    })
  },
  // 获取图片
  getImgData() {
    return new Promise((resolve, reject) => {
      request(
        "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1",
        function (error, response) {
          if (!error && response.statusCode == 200) {
            console.log({
              imgUrl: "https://cn.bing.com" + JSON.parse(res.text).images[0].url.split('&')[0]
            })
            let imgUrl = "https://cn.bing.com" + JSON.parse(res.text).images[0].url.split('&')[0]
            resolve(imgUrl)
          }
        }
      )
    })
  },
  // 在一起时间
  getDayData() {
    let current = new Date()
    // 获取认识时间
    let known = new Date('2022-1-14')
    // 获取认识的时间
    let res = Math.ceil((current - known) / 1000 / 60 / 60 / 24)
    return {
      countDay: res
    }
  }
}

module.exports = options
