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

## 初始化查看器

初始化查看器非常简单，仅需要几行代码

``` javascript
var tpano = new TPano({
    el:'pano',
});
```

