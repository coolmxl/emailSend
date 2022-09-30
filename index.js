const superagent = require("superagent")
const cheerio = require("cheerio")
const request = require("request")
const axios = require('axios')

// const local = "sichuan/chengdu"
// const local = "sichuan/leshan"
const local = "sichuan/linshui-county"
const WeatherUrl = "https://tianqi.moji.com/weather/china/" + local
function getWeatherTips() {
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
}
function getWeatherData() {
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
}

function getHotSearch() {
  return new Promise((resolve, reject) => {
    request(
      "https://weibo.com/ajax/side/hotSearch",
      function (error, response) {
        if (!error && response.statusCode == 200) {
          // console.log(JSON.parse(response.body).data.hotgov)
          const realtime = JSON.parse(response.body).data.realtime.slice(0, 9)
          // console.log(realtime)

          resolve(realtime)
        }
      }
    )
  })
}
getHotSearch()


function getMsg() {
  superagent.get('http://m.wufazhuce.com/one').end((err, res) => {
    if (err) {
      // 如果访问失败或者出错，会这行这里
      console.log(`热点新闻抓取失败 - ${err}`)
    } else {
     // 访问成功，请求http://news.baidu.com/页面所返回的数据会包含在res
     // 抓取热点新闻数据
    //  hotNews = getHotNews(res)
      console.log(res,'res')
    }
  });
}


module.exports={
  getWeatherTips,getWeatherData,getHotSearch
}