const superagent = require("superagent")
const cheerio = require("cheerio")
const request = require("request")
const axios = require('axios')

const local = "sichuan/chengdu"
// const local = "sichuan/leshan"
const WeatherUrl = "https://tianqi.moji.com/weather/china/" + local
function getWeatherTips () {
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
function getWeatherData () {
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

function getHotSearch () {
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


// ????????????
function getImgData () {
  let url = 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1'  // bing????????????api
  return new Promise(async (resolve, reject) => {
    let data = await axios.get(url)
    data = data.data
    // console.log("=====================================")
    console.log({
      imgUrl: "https://cn.bing.com" + data.images[0].url.split('&')[0]
    })
    resolve({
      imgUrl: "https://cn.bing.com" + data.images[0].url.split('&')[0]
    })
  })
}
// ???????????????
function getDayData () {
  let current = new Date()
  var year = current.getFullYear(); //????????????
  var month = current.getMonth();//????????????
  var date = current.getDate();//????????????
  month = month + 1;
  if (month < 10) month = "0" + month;
  if (date < 10) date = "0" + date;
  var time = year + "-" + month + "-" + date;    //????????????"yyyy-MM-dd"???
  console.log(time)
  var arr = ["??????", "??????", "??????", "??????", "??????", "??????", "??????",]
  var day = current.getDay();
  console.log(day)
  // ??????????????????
  let known = new Date('2022-1-14')
  // ?????????????????????
  let res = Math.ceil((current - known) / 1000 / 60 / 60 / 24)
  return {
    countDay: res,
    nowTime: time,
    day
  }
}
// a	??????
// b	??????
// c	??????
// d	??????
// e	??????
// f	????????????
// g	??????
// h	??????
// i	??????
// j	?????????
// k	??????
// l	?????????
async function oneWord () {
  let url = 'https://v1.hitokoto.cn/?c=a&c=c&c=e&c=f&c=h&c=j&c=k&c=l'  // ?????? ??????
  let data = await axios.get(url)
  data = data.data
  console.log(data)

  let oneWord = data
  return oneWord
}

async function getShiJu(){
  let url = 'https://v1.jinrishici.com/all'  
  let data = await axios.get(url)
  let shiJu = data.data
  return shiJu
}
module.exports = {
  getWeatherTips, getWeatherData, getHotSearch,
   getImgData, getDayData, oneWord,getShiJu
}