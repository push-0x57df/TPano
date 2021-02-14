function TPano(d) {
    //选取渲染对象的根dom
    let el = document.getElementById(d.el);
    var width = el.clientWidth;
    var height = el.clientHeight;

    //初始化场景、相机、渲染器
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 1000);//创建相机
    //camera.lookAt(500, 0, 0);//视角矫正
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x272727, 1.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    el.append(renderer.domElement);

    //调试用：显示三维坐标轴
    if (d.dbug == true) {
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);
    }


    //生成全景图片3D对象
    const geometry = new THREE.SphereBufferGeometry(500, 60, 40);
    geometry.scale(- 1, 1, 1);
    var texture = Array();
    var geometry2;
    var material2;
    var mesh2;
    for (let i = 0; i < d.photo.length; i++) {
        texture[i] = new THREE.TextureLoader().load(d.photo[i].url);
        //寻找有没有需要生成的热点
        for (let j = 0; j < d.hotspot.length; j++) {
            if (d.photo[i].name == d.hotspot[j].source) {
                geometry2 = new THREE.SphereBufferGeometry(20, 60, 40);
                material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                mesh2 = new THREE.Mesh(geometry2, material2);
                mesh2.position.set(d.hotspot[j].position.x, d.hotspot[j].position.y, d.hotspot[j].position.z);
                for (let k = 0; k < d.photo.length; k++) {
                    if (d.photo[k].name == d.hotspot[j].jumpTo) {
                        mesh2.jumpTo = k;
                    }
                }
                mesh2.name = 'hotspot';
                scene.add(mesh2);
            }
        }
    }

    //清除热点
    function cleanHotspot() {
        let children = scene.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].name == 'hotspot') {
                scene.children.splice(i, 1);
            }
        }
    }

    //体感控制
    let devicecontrol = new THREE.DeviceOrientationControls(camera);

    console.log(scene);
    //初始化贴图
    var material = new THREE.MeshBasicMaterial({ map: texture[0] });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    //启动鼠标控制
    mouseController();

    //动画绑定
    function animate() {
        requestAnimationFrame(animate);
        render();
    }
    animate();

    //镜头自由旋转
    let anglexoz = -90;//相机在xoz平面上的角度
    var rotateAnimateController = d.rotateAnimateController;
    function rotateAnimate() {
        if (rotateAnimateController == true) {
            anglexoz += 0.1;
            if (anglexoz > 360) {
                anglexoz = 0;
            }
            let x = Math.cos(anglexoz * Math.PI / 180) * 500;
            let z = Math.sin(anglexoz * Math.PI / 180) * 500;
            camera.lookAt(x, 0, z);
            //console.log(anglexoz);
        }
    }
    setInterval(rotateAnimate, 1000 / 60);//60帧
    el.addEventListener('pointerdown', function () {
        rotateAnimateController = false;
    });

    //封装鼠标控制
    function mouseController() {
        //初始化鼠标控制用变量
        let isUserInteracting = false,
            onPointerDownMouseX = 0, onPointerDownMouseY = 0,
            lon = -90, onPointerDownLon = 0,
            lat = 0, onPointerDownLat = 0,
            phi = 0, theta = 0;

        //鼠标控制视角、响应热点交互
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        function onMouseMove(event) {
            // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            render();
        }

        //鼠标按下到松开期间有没有移动，如果没有移动说明点击的是热点，否则是移动视角
        let clientX, clientY;
        el.addEventListener('pointerdown', function (event) {
            clientX = event.clientX;
            clientY = event.clientY;
        });
        el.addEventListener('pointerup', function (event) {
            if (clientX == event.clientX && clientY == event.clientY) {
                positionClick();
            }
        });

        //获取点击坐标，拾取点击对象
        function positionClick() {
            // 通过摄像机和鼠标位置更新射线
            raycaster.setFromCamera(mouse, camera);
            // 计算物体和射线的焦点
            const intersects = raycaster.intersectObjects(scene.children);
            for (let i = 0; i < intersects.length; i++) {
                //检测点击热点是否跳转场地
                if (intersects[i].object.jumpTo != null) {
                    material = new THREE.MeshBasicMaterial({ map: texture[intersects[i].object.jumpTo] });
                    mesh.material = material;
                    cleanHotspot();
                    console.log(scene);
                }
            }
        }

        el.style.touchAction = 'none';
        el.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('wheel', onDocumentMouseWheel);
        function onPointerDown(event) {
            //计算摄像机目前视角状态，保持当前状态，在当前状态上附加变化
            //console.log(camera);
            lon = -1 * THREE.MathUtils.radToDeg(camera.rotation.y) - 90;//经度
            lat = THREE.MathUtils.radToDeg(camera.rotation.x);//纬度

            onMouseMove(event);
            if (event.isPrimary === false) return;
            isUserInteracting = true;

            onPointerDownMouseX = event.clientX;
            onPointerDownMouseY = event.clientY;

            onPointerDownLon = lon;
            onPointerDownLat = lat;

            document.addEventListener('pointermove', onPointerMove);
            document.addEventListener('pointerup', onPointerUp);
        }

        function onPointerMove(event) {
            if (event.isPrimary === false) return;
            let rate;//触控灵敏度
            //想写个函数来线性计算这里的灵敏度，暂时没找到合适的函数
            if (el.clientWidth < 500 && el.clientWidth < el.clientHeight) {
                //判断为手机
                rate = 0.4;
            } else {
                //判断为电脑
                rate = 0.1;
            }
            lon = (onPointerDownMouseX - event.clientX) * rate + onPointerDownLon;
            lat = (event.clientY - onPointerDownMouseY) * rate + onPointerDownLat;
            update();
        }

        function onPointerUp() {
            if (event.isPrimary === false) return;
            isUserInteracting = false;
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
        }

        function onDocumentMouseWheel(event) {
            const fov = camera.fov + event.deltaY * 0.05;
            camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
            camera.updateProjectionMatrix();
        }

        function update() {
            if (isUserInteracting === false) {
                //lon += 0.1;
            }
            //console.log('lon->' + lon, 'lat->' + lat);
            lat = Math.max(- 85, Math.min(85, lat));
            phi = THREE.MathUtils.degToRad(90 - lat);
            theta = THREE.MathUtils.degToRad(lon);
            const x = 500 * Math.sin(phi) * Math.cos(theta);
            const y = 500 * Math.cos(phi);
            const z = 500 * Math.sin(phi) * Math.sin(theta);
            //console.log('x=' + x + 'y=' + y + 'z=' + z);
            //console.log('x=' + THREE.MathUtils.radToDeg(camera.rotation.x), 'y=' + THREE.MathUtils.radToDeg(camera.rotation.y));
            camera.lookAt(x, y, z);
            if (d.DeviceOrientationControls == true) {
                devicecontrol.update();
            }
        }
    }

    //渲染
    function render() {
        renderer.render(scene, camera);
    }

    //宽高重设
    this.re = {
        resizeRendererToDisplaySize: function resizeRendererToDisplaySize(width, height) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
            el.style.width = width + 'px';
            el.style.height = height + 'px';
            renderer.domElement.style.width = width + 'px';
            renderer.domElement.style.height = height + 'px';
        }
    }
}