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

就像这样，添加一张文件名为1.jpg的全景照片进入场景，其中的关键就是在创建TPano实例的时候设置photo，需要注意的是这是一个数组，你可以创建多个照片项目

## 添加热点

添加热点需要在创建TPano实例时添加hotspot，这也是一个数组对象，其中每项中的source代表照片源，即你想将热点添加到哪一张全景照片上，position表示热点的位置，jumpTo表示需要跳转到何处

代码看起来像这样：

```javascript
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
        },{
            url:'3.jpg',
            name:'外景'
        }
    ],
    hotspot:[
        //全景照片上的热点
        {
            source:'室内',//此热点放置在哪张全景照片上
            position:{//热点所在的位置
                x:-495.0170165931702,
                y:-42.218783642706285,
                z:54.33392236397725
            },
            jumpTo:'建筑'//热点点击后跳往何方
        },
        {
            source:'建筑',
            position:{
                x:-495.0170165931702,
                y:-42.218783642706285,
                z:54.33392236397725
            },
            jumpTo:'外景'
        }
    ],
})
```

## 设备朝向体感控制

使用DeviceOrientationControls设置是否加载完毕后自动使用体感控制，请设置bool值，就像这样：

``` javascript
var tpano = new TPano({
	··· ···
    DeviceOrientationControls:false,//设备朝向体感控制，默认关闭
   	··· ···
})
```

**注意：使用此功能可能需要您的网站启用https，这是浏览器厂商出于安全考虑的限制策略**

注意：打开此功能会使您设置的开场视角自转功能冲突

## 开场视角自转

使用rotateAnimateController设置是否使用体感控制，请设置bool值，就像这样：

``` javascript
var tpano = new TPano({
	··· ···
    rotateAnimateController:true,//镜头自转
   	··· ···
})
```

## 调试模式

使用debug设置是否使用体感控制，请设置bool值，就像这样：

``` javascript
var tpano = new TPano({
	··· ···
    debug:true,//调试模式
   	··· ···
})
```

打开调试模式后能获得的功能：

- 点击全景照片能获取点击到的三维世界坐标

## 重设TPano画布大小

此功能用于响应式设计时，需要对已经加载的TPano重设大小

``` javascript
tpano.re.resizeRendererToDisplaySize(width:number,height:number);
```

请在JavaScript中先初始化TPano，将其命名为tpano，然后调用此方法

注意：如果你初始化TPano时选择了其它的名称，请使用你自定义的名称调用此方法，例如：

``` javascript
youTapnoName.re.resizeRendererToDisplaySize(200,200);
```

## 加载进度回调

加载进度回调可以用来得知全景照片加载的进度，每张照片都能独立返回加载进度，这样就可以知道图片何时加载完毕，但是遗憾的是暂时底层引擎还不能返回具体的进度值，目前只能返回加载完成的消息

即使这样我们也能通过此功能实现前端交互显示，不至于让用户面对白屏发呆，我们可以设计一个遮罩层显示加载中字样，等待第一张图片加载完成触发回调再撤走遮罩层就可以了

加载进度回调应该在创建TPano实例时同时创建，就像这样：

``` javascript
var tpano = new TPano({
	··· ···
    photoLoad:function(e){
        console.log(e);
    },
   	··· ···
})
```

它每次触发会显示这样的信息：

``` json
{
    all: 3, 
    loading: {
        id: 1, 
        name: "室内"
    },
    Leftover: 2
}
```

其中数据释义：

| key      | 说明                         |
| -------- | ---------------------------- |
| all      | 一共有多少张全景照片需要加载 |
| loading  | 当前正在加载的照片           |
| Leftover | 剩余还需要加载多少张照片     |

其中key：loading也是json对象，它的数据释义：

| key  | 说明                                |
| ---- | ----------------------------------- |
| id   | 当前加载的照片是第几张，从1开始计数 |
| name | 当前照片的名称                      |