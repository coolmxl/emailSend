# 一：安装与使用

```
npm i or cnpm i
```

# 二：项目结构

```
.git
|——              # 文件夹，钩子
|—— methods              # 文件夹 封装方法的文件夹
| |—— index.js        # 封装爬取数据方法 包含天气温度提示、天气数据、微博热搜. 可自行增改
|—— app.js             # 入口文件  发送邮件、定时发送、以及渲染模板
|-- appSchedule.js     # 入口文件2 不包含定时发送
|-- demo.html          # 渲染出的模板html
|-- index.js           # 无用 不管
|-- mail.ejs           # ejs渲染模板    可自行增改
|-- one.js             # 通过puppeteer爬取数据
```

