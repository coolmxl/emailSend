// 1.引入依赖
//   (1)art-tempate 实现模板渲染，第三方依赖
const template = require("art-template");
//   (2)http 实现创建并搭建服务器，node自带
const http = require("http");
//   (3)fs 实现文件读写，node自带
const fs = require("fs");
const method = require('./index.js')
let templateData = {
  title: "咫尺远却近❤",
}
// 2.创建服务器
let server = http.createServer();
let students = [
  { name: "小丸子", gender: "女", age: "6" },
  { name: "熊大", gender: "男", age: "9" },
  { name: "边牧", gender: "男", age: "3" },
];
// 3.处理接收到的请求，生成返回内容
server.on("request", async (req, res) => {
  // 3.1 接收请求的url地址
  let url = req.url;
  if (url == "/") {
    templateData.threeDaysData = await method.getWeatherData()
    templateData.weatherTip = await method.getWeatherTips()
    templateData.todayOneData = await method.getImgData()
    console.log(templateData.todayOneData,'todayOneData')
    templateData.oneWord = await method.oneWord()
    templateData.getDayData = await method.getDayData()
    templateData.shiJu = await method.getShiJu()
    templateData.title += `今天是我们认识的第: ${templateData.getDayData.countDay} 天`
    templateData.hotSearch = await method.getHotSearch()
    // console.log(templateData.title,'templateData')

    // 3.2 通过fs的readFile方法，读取index.html文件
    fs.readFile("./template.html", function (err, data) {
      // 3.3 如果报错在页面写入404 not found，并使函数结束运行
      if (err) {
        return res.end("404 not found");
      }
      // 3.4 通过template提供的render方法，进行模板渲染
      // 参数一：读取到的页面（转成字符串类型）
      // 参数二：需要在模板中渲染的数据
      let htmlStr = template.render(data.toString(), {
        students: students,
        templateData:templateData
      });
      // 3.5 将渲染后的index.html写入"/"对应的页面
      res.end(htmlStr);
    });
  }
});
// 4.定义服务器端口号
server.listen(3000, () => {
  console.log("server is running on http://127.0.0.1:3000");
});
