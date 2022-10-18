# 一：安装与使用

```
npm i or cnpm i
```

# 二：主要项目结构

```
|—— app.js             # 入口文件1  发送邮件、定时发送、以及渲染模板
|-- appSchedule.js     # 入口文件2  不包含定时发送
|-- demo.html          # 渲染出的模板html
|-- index.js           # 封装爬取数据方法 包含天气温度提示、天气数据、微博热搜. 可自行增改
|-- mail.ejs           # ejs渲染模板    可自行增改
|-- one.js             # 通过puppeteer爬取数据
```



# 三：主要的依赖的使用

## 1 node-schedule

```js
//引入
var schedule = require('node-schedule');
//30 表示一个月每天  20 表示第20分钟 5表示第五个小时
schedule.scheduleJob('30 20 5 * * *', async function(){
    //do ...
}); 

```

2.PM2

```
//PM2 全局安装
npm i pm2 -g
//用pm2启动项目
pm2 start xxx.js
使用pm2可以关闭vscode 只需要保存电脑不关机即可，如果你由服务器更加方便。即可实现每天自动发送。
```

