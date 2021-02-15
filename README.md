# TPano 全景照片框架

## 项目介绍

### 用途

1. 查看全景照片，实现全景漫游
2. 编辑全景照片热点（暂未实现，计划更新中）

### 特征

- 纯前端代码构建，可配合任意语言后端项目
- 最简单的集成方式

### 代码案例

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

未开发完，持续开发中，趁过年先发布一下

## 开发文档

请看项目目录：/docs/doc.md

建议使用typora打开文档，或者在Git托管的Web页面上直接浏览，markdown语法编写而成

您可以直接点击这里：https://gitee.com/administrator-user/TPano/blob/develop/docs/doc.md

## Demo

https://administrator-user.gitee.io/tpano/example/

（暂未做加载进度展示，故打开白屏，此时正在下载照片数据，请耐心等待片刻）