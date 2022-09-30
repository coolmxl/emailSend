const puppeteer = require("puppeteer")
;("use strict")

function getOne() {
  return new Promise((resolve, reject) => {
    ;(async () => {
      // 启动浏览器
      const browser = await puppeteer.launch({
        headless: false, // 默认是无头模式，这里为了示范所以使用正常模式
      })

      // 控制浏览器打开新标签页面
      const page = await browser.newPage()
      // 在新标签中打开要爬取的网页
      await page.goto("http://m.wufazhuce.com/one")

      // 使用evaluate方法在浏览器中执行传入函数（完全的浏览器环境，所以函数内可以直接使用window、document等所有对象和方法）
      // const data = await page.evaluate(() => {
      // console.log(1111)
      let list = await page.$(".item-text")
      let content = await list.$eval(".picture-content", (el) => el.innerText)
      let img_url = await list.$eval(".div-link img", (el) => {
        return el.getAttribute("src")
      })
      let date = await list.$eval(".item-picture-date", (el) => el.innerText)
      let text_authors = await page.$eval(
        ".item-text>p:nth-child(6)",
        (el) => el.innerText
      )
      todayOneData = {
        content,
        date,
        text_authors,
        img_url,
      }
      console.log(date,'date')
      resolve(todayOneData)
      page.close()
    })()
  })
}
exports.getOne = getOne
