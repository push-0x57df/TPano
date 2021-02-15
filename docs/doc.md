# 说明文档

本文档使用markdown语法编写，建议使用Typora查看

---

## 安装

引入文件 three.js、tpano.js、DeviceOrientationControls.js

它们分别是three引擎、TPano全景框架、three的体感设备朝向控制器

引入顺序应该是这样的：

``` html
<script src="./three.js"></script>
<script src="../dist/tpano.js"></script>
<script src="./DeviceOrientationControls.js"></script>
```

获取依赖文件：

tpano.js&DeviceOrientationControls.js：https://github.com/mrdoob/three.js

## 初始化查看器

初始化查看器非常简单，仅需要几行代码

``` javascript
var tpano = new TPano({
    el:'pano',
});
```

仅需要在html里引入script标签，加入以上代码，创建TPano实例，使用el设置放置TPano的容器即可完成创建

注：el上请填写某个容器html元素的id

## 添加第一个场景

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
<!--设备朝向控制器，不引入无法使用体感控制-->
<script src="./DeviceOrientationControls.js"></script>
<script>
var tpano = new TPano({
    el:'pano',//照片查看器根节点dom的id
    photo:[
        //全景照片数组，每项为一张照片
        {
            url:'1.jpg',
            name:'室内'
        }
    ]
})
</script>
</html>
```

就像这样，添加一张文件名为1.jpg的全景照片进入场景

