## baidu-tasks

此项目为百度ife项目中留的作业练习。百度ife的项目地址请戳：[https://github.com/baidu-ife](https://github.com/baidu-ife)。

### task0001 ###

主要练习HTML、CSS的基础知识，最终参照设计稿实现了一个个人博客网站的四个静态网页。在HTML文件中合理地规划了HTML结构，尽量实现了标签语义化；在CSS中，运用了浮动，绝对定位等基本语法。

### task0002 

学习JavaScript基础知识，包括JavaScript数据类型，DOM，JS事件，BOM，Ajax等。在util.js中实现了一个小的常用函数库，并运用自己的函数库实现了表单输入，倒计时工具，轮播图，输入提示框和界面拖拽交互工具。

### task0003

学习了JavaScript更深层的知识，包括作用域、原型、闭包、构造函数、设计模式等。最终实现了一个简易的个人任务管理系统。将数据存放在JSON文件中，并用Ajax动态提交获取数据。

### task0004

主要是对task0003的代码重构。

在HTML方面，运用了HTML5中的localStorage技术，存储用户的任务管理历史。并对其中的数据库做了合理的设计，能够快速对其进行查找更新。

在CSS方面，使用Less预处理器重构代码，并设置了新的样式。并做了移动端的响应式布局处理，使页面在移动设备上也能正常显示，工作。

在JS方面，将代码合理划分为模块，包括一级、二级、三级任务模块及显示模块，并运用RequireJS实现了AMD模块化方案。运用gulp自动化构建工具管理工作流。

在移动端浏览页面可扫描二维码：

![二维码](https://github.com/KongRain/baidu-tasks/raw/master/task0004/%E4%BA%8C%E7%BB%B4%E7%A0%81.png?raw=true)


