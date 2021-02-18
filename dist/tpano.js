function TPano(d) {
    //选取渲染对象的根dom
    let el = document.getElementById(d.el);
    var width = el.clientWidth;
    var height = el.clientHeight;

    //初始化场景、相机、渲染器
    const scene = new THREE.Scene();
    let fov;
    if (el.clientWidth <= 700 || el.clientWidth < el.clientHeight) {
        //手机端视角
        fov = 90;
    } else {
        //pc端视角
        fov = 60;
    }
    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);//创建相机
    //camera.lookAt(500, 0, 0);//视角矫正
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x272727, 1.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    el.append(renderer.domElement);


    //生成全景图片3D对象
    const geometry = new THREE.SphereBufferGeometry(500, 60, 40);
    geometry.scale(- 1, 1, 1);
    let mesh = new THREE.Mesh(geometry);
    scene.add(mesh);
    var texture = Array();
    var geometry2;
    var material2;
    var mesh2;
    let loadTextureLoaderCount = 0;
    loadTextureLoader(loadTextureLoaderCount);
    //用来加载全景照片
    function loadTextureLoader(i) {
        texture[i] = new THREE.TextureLoader().load(
            d.photo[i].url,
            // onLoad回调
            function () {
                loadTextureLoaderEnd();
            },

            // 目前暂不支持onProgress的回调
            function (e) {
                console.log(e);
            },

            // onError回调
            function (err) {
                console.error('An error happened.');
            }
        );
    }
    //用来控制加载下一张全景照片
    function loadTextureLoaderEnd() {
        let i = loadTextureLoaderCount;
        texture[i].panoName = d.photo[i].name;
        d.photoLoad({
            'all': d.photo.length,
            'loading': {
                'id': i + 1,
                'name': d.photo[i].name
            },
            'Leftover': d.photo.length - i - 1
        });
        if (loadTextureLoaderCount == 0) {
            switchPhotoN(0);
        }
        if (loadTextureLoaderCount < d.photo.length - 1) {
            loadTextureLoader(++loadTextureLoaderCount);
        }
    }

    /**
     * 切换全景照片
     * @param int i 选择照片张数
     * @return json status，正常返回OK，不正常返回ERROR；msg具体信息
     */
    function switchPhotoN(i) {
        let response = {
            status: 'ERROR',
            msg: '系统出错'
        }

        if (i < d.photo.length && i >= 0) {
            let fov;
            if (el.clientWidth <= 700 || el.clientWidth < el.clientHeight) {
                //手机端视角
                try {
                    fov = d.photo[i].fov.phone;
                } catch (error) {
                    fov = null;
                }
            } else {
                //pc端视角
                try {
                    fov = d.photo[i].fov.pc;
                } catch (error) {
                    fov = null;
                }
            }
            if (fov != null) {
                camera.fov = fov;
                camera.updateProjectionMatrix();
            } else {
                if (el.clientWidth <= 700 || el.clientWidth < el.clientHeight) {
                    //手机端视角
                    fov = 90;
                } else {
                    //pc端视角
                    fov = 60;
                }
                camera.fov = fov;
                camera.updateProjectionMatrix();
            }
            console.log(texture);
            material = new THREE.MeshBasicMaterial({ map: texture[i] });
            mesh.material = material;
            cleanHotspot();
            initHotspot();
            response = {
                status: 'OK',
                msg: '切换成功'
            }
        } else {
            response.msg = '无效的照片索引';
        }

        return response;
    }

    //生成热点
    function initHotspot() {
        for (let j = 0; j < d.hotspot.length; j++) {
            if (mesh.material.map.panoName == d.hotspot[j].source) {
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

    //启动鼠标控制
    mouseController();
    //启动多点触控
    phoneController();

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
        if (rotateAnimateController == true && d.DeviceOrientationControls == false) {
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

    //手机端多点触控
    let mouseFovControllerSport = true;//用来开闭鼠标控制支持的，如果用户在进行放大手势，应该将鼠标视角控制锁定
    function phoneController() {
        let oldL = 0;
        let x1, x2, y1, y2, l;
        document.addEventListener('touchstart', function (event) {
            if (event.touches.length == 2) {
                mouseFovControllerSport = false;
                x1 = event.touches[0].clientX;
                x2 = event.touches[1].clientX;
                y1 = event.touches[0].clientY;
                y2 = event.touches[1].clientY;
                oldL = Math.sqrt(Math.pow(Math.abs(x2 - x1), 2) + Math.pow(Math.abs(y2 - y1), 2));//求两点间长度
            } else {
                mouseFovControllerSport = true;
            }
        }, false);
        document.addEventListener('touchmove', function (event) {
            event.preventDefault(); // prevent scrolling
            event.stopPropagation();
            if (event.touches.length == 2) {
                x1 = event.touches[0].clientX;
                x2 = event.touches[1].clientX;
                y1 = event.touches[0].clientY;
                y2 = event.touches[1].clientY;

                l = Math.sqrt(Math.pow(Math.abs(x2 - x1), 2) + Math.pow(Math.abs(y2 - y1), 2));//求两点间长度

                let lAdd = l - oldL;//长度增量
                oldL = l;

                console.log(lAdd);
                const fov = camera.fov - lAdd * 0.3;
                camera.fov = THREE.MathUtils.clamp(fov, 10, 90);
                camera.updateProjectionMatrix();
            }

        }, false);
    }

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
            mouse.x = (event.clientX / el.clientWidth) * 2 - 1;
            mouse.y = - (event.clientY / el.clientHeight) * 2 + 1;
            render();
        }

        //鼠标按下到松开期间有没有移动，如果没有移动说明点击的是热点，否则是移动视角
        let clientX, clientY;
        el.addEventListener('pointerdown', function (event) {
            clientX = event.clientX;
            clientY = event.clientY;
        });
        el.addEventListener('pointerup', function (event) {
            var distance = Math.sqrt(Math.pow(Math.abs(event.clientX - clientX), 2) + Math.pow(Math.abs(event.clientY - clientY), 2));//鼠标按下到松开期间移动距离
            if (distance <= 10) {
                //这是个容差设计，在手机端如果不给差值，很可能用户的点击和松开之间会有误差
                positionClick();
            }
        });

        //获取点击坐标，拾取点击对象
        function positionClick() {
            // 通过摄像机和鼠标位置更新射线
            raycaster.setFromCamera(mouse, camera);
            // 计算物体和射线的交点
            const intersects = raycaster.intersectObjects(scene.children);
            for (let i = 0; i < intersects.length; i++) {
                if (d.debug == true) {
                    console.log('点击坐标：', intersects[i].point);
                }
                //检测点击热点是否跳转场地
                if (intersects[i].object.jumpTo != null && i == 0) {
                    switchPhotoN(intersects[i].object.jumpTo);
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
            if (el.clientWidth <= 700 || el.clientWidth < el.clientHeight) {
                //判断为手机
                rate = 0.4;
            } else {
                //判断为电脑
                rate = 0.1;
            }
            lon = (onPointerDownMouseX - event.clientX) * rate + onPointerDownLon;
            lat = (event.clientY - onPointerDownMouseY) * rate + onPointerDownLat;
            if (mouseFovControllerSport) {
                update();
            }
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
        },
        switchPhoto: function switchPhoto(i) {
            return switchPhotoN(i);
        }
    }
}