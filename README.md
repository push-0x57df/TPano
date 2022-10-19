# TPano 全景照片框架
（说明：因为没有专业摄影设备，全景照片和视频输出质量不佳，故本项目示例观感不佳的问题主要源于素材本身，并不是框架的问题）

## 项目介绍

### 用途

1. 查看全景照片，实现全景漫游
2. 编辑全景照片热点（暂未实现，计划更新中）

### 特征

- 纯前端代码构建，可配合任意语言后端项目
- 最简单的集成方式

### 代码案例

- 快速自动加载方式

  示例文件位于/example/fastload.html

  详细使用方法请参考开发文档

  ``` html
  <!DOCTYPE html>
  <html>
  
  <head>
      <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TPano 全景照片查看器</title>
      <style>
          * {
              margin: 0;
          }
  
          #tp{
              width: 200px;
              height: 140px;
              display: block;
          }
      </style>
  </head>
  
  <body id="pano">
      <!--直接通过标签tpano引入全景照片1.jpg，无需做其他任何处理，就像在使用img标签一样，
          但要注意设置标签的css，给出宽度和高度，tpano依照此高度自动生成照片大小-->
  	<tpano id="tp" src="./1.jpg"></tpano>
  </body>
  <!--引入three.js-->
  <script src="./three.js"></script>
  <script src="../dist/tpano.js"></script>
  <script src="../dist/fastloading.js"></script>
  </html>
  ```

- 普通集成方式

  ``` html
  <!DOCTYPE html>
  <html>
  
  <head>
      <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TPano 全景照片查看器</title>
      <style>
          * {
              margin: 0;
          }
  
          #pano {
              width: 100vw;
              height: 100vh;
          }
      </style>
  </head>
  
  <body id="pano"></body>
  <!--引入three.js-->
  <script src="./three.js"></script>
  <script src="../dist/tpano.js"></script>
  <script>
  var tpano = new TPano({
      el:'pano',//照片查看器根节点dom的id
      photo:[
          //全景照片数组，每项为一张照片
          {
              url:'1.jpg',
              name:'室内'
          },
          {
              url:'2.jfif',
              name:'建筑'
          }
      ]
  })
  </script>
  </html>
  ```


### 开发语言

- JavaScript
- html
- 底层基于Three.js

## 开发进度

持续更新优化中

https://gitee.com/push_0x57df/TPano/releases

项目继续优化中，有建议或发现bug请发issues

## 开发文档

请看项目目录：/docs/doc.md

建议使用typora打开文档，或者在Git托管的Web页面上直接浏览，markdown语法编写而成

您可以直接点击这里：https://gitee.com/push_0x57df/TPano/blob/develop/docs/doc.md

## Demo
GitPage：
https://push_0x57df.gitee.io/tpano/example

## 赞助

**为了继续开发TPano，希望大家能贡献一些全景影像作为测试数据供开发升级所用，谢谢！**
目前我手头没有拍摄制作全景影像的设备，需要大家提供相应的帮助。
贡献方式：Pull Requests，目录：devData
注意：请保证您对贡献的全景影像拥有版权！
