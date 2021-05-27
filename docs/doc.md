# 开发文档

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

## 添加第一张照片

- 使用标准接入

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

- 使用快速接入

  ``` html
  <!DOCTYPE html>
  <html>
  <head>
      <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TPano 全景照片查看器</title>
  </head>
  
  <body id="pano">
  	<tpano id="pano-1" src="./example/2.jfif" alt="球面展开全景图"></tpano>    
  </body>
  <!--引入three.js-->
  <script src="./three.js"></script>
  <script src="../dist/tpano.js"></script>
  <!--引入快速加载部件-->
  <script src="./dist/fastloading.js"></script>
  </html>
  ```
  
  注意几个问题：

  1. 使用这种方式需要引入 /dist/tpano.js 部件
  2. 使用 tpano 标签完成引入，图片链接放在 src 属性，同时一定要给定唯一的 id 属性
  3. 使用这种方式，无法使用 tpano 提供的丰富的函数接口

## 添加全景视频

添加全景视频的方式和全景照片非常类似，仅需要在初始化Tpano时预置 type: 'VIDEO' 即可。其他操作和加入照片无异，仅需要将原本照片url改为视频url，该功能预计在v2.0.0版本中提供

例如：

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
            url:'1.mp4',
            name:'室内',
            type: 'VIDEO'
        }
    ]
})
</script>
</html>
```

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
            imgUrl: './img/outdoor.gif',
            jumpTo:'建筑'//热点点击后跳往何方
        },
        {
            source:'建筑',
            position:{
                x:-495.0170165931702,
                y:-42.218783642706285,
                z:54.33392236397725
            },
            imgUrl: './img/foot.png',
            jumpTo:'外景'
        }
    ],
})
```

## 通用鼠标或触控控制

默认情况下，PC端鼠标和移动端触摸操作都是打开可用的，具体行为包括鼠标拖拽移动场景视角、手指划过屏幕改变场景视角、鼠标滚轮缩放和双指操作缩放。

可以通过设置属性 MouseController 来禁用或者启用通用鼠标或触控控制，请将其设置为bool值。

例如，如果你想禁止用户通过鼠标或触控控制场景视角，可以这样写：

``` javascript
var tpano = new TPano({
	··· ···
    MouseController:false,//通用鼠标或触控控制，默认打开
   	··· ···
})
```

如果您想在代码里随意的打开或关闭通用鼠标或触控，则需要使用函数接口来实现，像这样：

```javascript
tpano.re.seitchMouseController(false);
```

注意这里的tpano是TPano的实例变量，参数true和false则标注了是打开还是关闭通用鼠标或触控控制

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

使用switchGyro函数接口则能允许您在任何时候打开陀螺仪，像这样：

```javascript
tpano.re.switchGyro(true);
```

注意这里的tpano是TPano的实例变量，参数true和false则标注了是打开还是关闭陀螺仪控制

值得注意的是部分情形下可能设备不支持陀螺仪，我们为此准备了一个回调函数，当设备不支持陀螺仪时或因为浏览器限制不支持时将发送回调消息。它是这样的：

``` javascript
var tpano = new TPano({
	··· ···
        gyroSport: function (e) {
    		
        },
   	··· ···
})
```

这里的参数e只有两种可能，true和false，告诉我们可能陀螺仪没法启动

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

例如我在某次测试中设计了开场加载动画，这或许是个不错的例子，下面是这次的代码：

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

        body {
            position: relative;
        }

        #load {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: black;
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #load-bar-k {
            width: 40%;
            height: 1px;
            background-color: #555555;
        }

        #load-bar-x {
            height: 3px;
            width: 0%;
            background-color: #ffffff;
        }
    </style>
</head>

<body id="pano">
    <div id="load">
        <div id="load-bar-k">
            <div id="load-bar-x"></div>
        </div>
    </div>
</body>
<!--引入three.js-->
<script src="./three.js"></script>
<script src="../dist/tpano.js"></script>
<!--设备朝向控制器，不引入无法使用体感控制-->
<script src="./DeviceOrientationControls.js"></script>
<!--jquery框架，这里引入用来做一些其它的操作，TPano不依赖它，故你不需要可以不引入-->
<script src="./jquery-2.1.4.js"></script>
<script>
    var tpano = new TPano({
        el: 'pano',//照片查看器根节点dom的id
        photo: [
            //全景照片数组，每项为一张照片
            {
                url: '1.jpg',
                name: '室内'
            },
            {
                url: '2.jfif',
                name: '建筑'
            }, {
                url: '3.jpg',
                name: '外景'
            }
        ],
        photoLoad: function (e) {
            console.log(e);
            closeLoadAnimate();
        },
        hotspot: [
            //全景照片上的热点
            {
                source: '室内',//此热点放置在哪张全景照片上
                position: {//热点所在的位置
                    x: 51.22617443281311,
                    y: -77.47768972497656,
                    z: -491.24706541614586
                },
                jumpTo: '建筑'//热点点击后跳往何方
            },
            {
                source: '建筑',
                position: {
                    x: -38.877370809465624,
                    y: -78.21183614810603,
                    z: -491.8073450832495
                },
                jumpTo: '外景'
            }
        ],
        DeviceOrientationControls: false,//设备朝向体感控制，默认关闭
        rotateAnimateController: true,//镜头自转
        debug: true,//调试模式
    });

    //开场加载动画
    function loadAnimate() {
        $("#load-bar-k").animate({
            height: '3px',
        }, 300);
        $("#load-bar-x").animate({
            width: '99%',
        }, 15000);
    }
    $(document).ready(function () {
        loadAnimate();
    });
    //关闭开场动画
    function closeLoadAnimate(){
        $("#load").hide();
    }
</script>

</html>
```

尽管这段代码可能随着后续版本更新变得不可用，但我认为它具有一定的参考价值

## 切换照片

使用下面提供的函数可以在照片之间切换：

``` javascript
tpano.re.switchPhoto(index);
```

其中index是照片的索引，从0开始，按照在创建TPano实例时photo数据项传入的顺序排序

值得注意的是此函数是有返回值的，如果传递了错误的index，它的返回就像这样：

``` json
{status: "ERROR", msg: "无效的照片索引"}
```

## 切换照片加载回调

切换场景时可能因为需要切换的场景图片还未下载完成，所以会导致暂时无法加载，造成视觉上的卡顿

使用切换场景加载回调函数，我们就知道当前需要切换的场景有没有加载完成，每当切换场景函数触发时，它都会以一秒为周期向外报告加载情况

加载进度回调应该在创建TPano实例时同时创建，就像这样：

``` javascript
var tpano = new TPano({
	··· ···
    switchLoad:function(e){
        console.log(e);
    },
   	··· ···
})
```

它每次触发会显示这样的信息：

``` json
{
    loading: {
        id: 3, 
        name: "外景"
    },
    status: "loading"
}
```

其中数据释义：

| key     | 说明                                                         |
| ------- | ------------------------------------------------------------ |
| loading | 当前正在加载的照片                                           |
| status  | 状态：只有两种状态，loading或者end，分别表示正在加载和加载完成 |

其中key：loading也是json对象，它的数据释义：

| key  | 说明                                |
| ---- | ----------------------------------- |
| id   | 当前加载的照片是第几张，从1开始计数 |
| name | 当前照片的名称                      |

例如我在某次测试中使用了这个函数，这或许是个不错的例子，下面是这次的代码：

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

        body {
            position: relative;
        }

        #load {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: rgba(46, 46, 46, 0.5);
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #load-bar-k {
            width: 40%;
            height: 1px;
            background-color: #555555;
        }

        #load-bar-x {
            height: 3px;
            width: 0%;
            background-color: #ffffff;
        }
    </style>
</head>

<body id="pano">
    <div id="load">
        <div id="load-bar-k">
            <div id="load-bar-x"></div>
        </div>
    </div>
</body>
<!--引入three.js-->
<script src="./three.js"></script>
<script src="../dist/tpano.js"></script>
<!--设备朝向控制器，不引入无法使用体感控制-->
<script src="./DeviceOrientationControls.js"></script>
<!--jquery框架，这里引入用来做一些其它的操作，TPano不依赖它，故你不需要可以不引入-->
<script src="./jquery-2.1.4.js"></script>
<script>
    var tpano = new TPano({
        el: 'pano',//照片查看器根节点dom的id
        photo: [
            //全景照片数组，每项为一张照片
            {
                url: '1.jpg',
                name: '室内',
                fov: {
                    pc: 100,
                    phone: 90
                }
            },
            {
                url: '2.jfif',
                name: '建筑'
            }, {
                url: '3.jpg',
                name: '外景'
            }
        ],
        photoLoad: function (e) {
            console.log(e);
            closeLoadAnimate();
        },
        switchLoad: function (e) {
            console.log(e);
            switch (e.status) {
                case 'loading':
                    loadAnimate();
                    break;
                case 'end':
                    closeLoadAnimate();
                    break;
                default:
                    alert('加载出错');
                    break;
            }
        },
        hotspot: [
            //全景照片上的热点
            {
                source: '室内',//此热点放置在哪张全景照片上
                position: {//热点所在的位置
                    x: 51.22617443281311,
                    y: -77.47768972497656,
                    z: -491.24706541614586
                },
                jumpTo: '建筑'//热点点击后跳往何方
            },
            {
                source: '建筑',
                position: {
                    x: -38.877370809465624,
                    y: -78.21183614810603,
                    z: -491.8073450832495
                },
                jumpTo: '外景'
            }
        ],
        DeviceOrientationControls: false,//设备朝向体感控制，默认关闭
        rotateAnimateController: true,//镜头自转
        debug: false,//调试模式
    });

    //开场加载动画
    function loadAnimate() {
        $("#load").show();
        $("#load-bar-x").width('0%');
        $("#load-bar-k").animate({
            height: '3px',
        }, 300);
        $("#load-bar-x").animate({
            width: '99%',
        }, 15000);
    }
    $(document).ready(function () {
        loadAnimate();
    });
    //关闭开场动画
    function closeLoadAnimate() {
        $("#load-bar-x").stop();
        $("#load-bar-x").animate({
            width: '100%',
        }, 1000);
        setTimeout('$("#load").hide()', 1500);
    }
</script>

</html>
```

## 为单张设置相机视野

考虑到可能需要单独调整每张图片加载时的相机视野，我提供了一个接口供大家修改相机视野角度，可以单独为pc和手机设置不同值

``` javascript
var tpano = new TPano({
	··· ···
        photo: [
            //全景照片数组，每项为一张照片
            {
                url: '1.jpg',
                name: '室内',
                fov: {
                    pc: 100,
                    phone: 90
                }
            },
            {
                url: '2.jfif',
                name: '建筑'
            }, {
                url: '3.jpg',
                name: '外景'
            }
        ],
   	··· ···
})
```

但是请注意，相机是有默认视野角度的，如果设置不合理会导致黑屏，也可能导致视野边缘严重变形（此时请调小视野角度）

