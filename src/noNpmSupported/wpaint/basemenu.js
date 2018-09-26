
    function capture(){
        var $container = $(_viewer.container);
        var width = $container.width() - 20;
        var height = $container.height()- 20;
        //切全图
        _viewer.getScreenShot(width, height, function(newBlobURL) {
            console.log(newBlobURL);
            $("#ceshi").attr('src',newBlobURL);
            $('#wPaint').css({
                width: width,
                height: height,
                position: "absolute",
                left: "10px",
                top: "10px",
            }).wPaint('resize');
            getImgData();
        });
    }
    //
    function getImgData() {
        var imagdata = $("#ceshi").attr('src');
        ImageToCanvas(imagdata);
    }
    //重画img
    function ImageToCanvas(image) {
        var canvas = document.getElementsByClassName('wPaint-canvas')[0];
        if (canvas.getContext) {
            var ctx = canvas.getContext("2d");
            var img = new Image();
            img.src = image;
            img.onload = function () {
                ctx.drawImage(img, 0, 0, img.width, img.height);
                $("#content").css({display:'block'});
            };
        }
    }
    $.fn.wPaint.menus.main = {
        items: {
            undo: {
                icon: 'generic',
                title: '回退',
                img: '/src/img/wpaint/undo.png',
                index: 0,
                callback: function () {
                    this.undo();
                }
            },
            redo: {
                icon: 'generic',
                title: '前进',
                img: '/src/img/wpaint/redo.png',
                index: 0,
                callback: function () {
                    this.redo();
                }
            },
            rectangle: {
                icon: "activate",
                title: '矩形',
                img: '/src/img/wpaint/icon_rectangle.png',
                index: 0,
                callback: function () {
                    this.setMode("rectangle");
                }
            },
            eclipse: {
                icon: "activate",
                title: "椭圆",
                index: 0,
                img: '/src/img/wpaint/icon_ellipse.png',
                callback: function () {
                    this.setMode("ellipse");
                }
            },
            text: {
                icon: "generic",
                title: "文字",
                index: 0,
                img: '/src/img/wpaint/icon_text.png',
                callback: function () {
                    this.setMode("text")
                }
            },
            // fillStyle: {
            //     title: "字体,填充颜色",
            //     icon: "colorPicker",
            //     callback: function (a) {
            //         this.setFillStyle(a)
            //     }
            // },
            line: {
                icon: "activate",
                title: "划线",
                index: 0,
                img: '/src/img/wpaint/icon_line.png',
                callback: function () {
                    this.setMode("line");
                }
            },
            pencil: {
                icon: "activate",
                title: "画笔",
                index: 0,
                img: '/src/img/wpaint/icon_pencil.png',
                callback: function () {
                    this.setMode("pencil")
                }
            },
            // strokeStyle: {
            //     icon: "colorPicker",
            //     title: "边框,划线,画笔颜色",
            //     callback: function (a) {
            //         this.setStrokeStyle(a)
            //     }
            // },
            cancel:{
                icon: "activate",
                title: "取消",
                index: 0,
                img: 'src/img/wpaint/clear.png',
                callback: function () {
                    $("#content").css({display:'none'});
                    $('#wPaint').wPaint('clear');
                    $("#wPaint-img").css({display:'none'});
                    $(".qingchu").css({display:'none'});
                }
            },
            save: {
                icon: "generic",
                title: "确定",
                index: 0,
                img: 'src/img/wpaint/icons-menu-main-file.png',
                callback: function () {
                    this.options.saveImg.apply(this, [this.getImage()])
                }
            }
        }
    }
    $.extend($.fn.wPaint.defaults, {
            
            strokeStyle: '#ffff00',  // start stroke style
            fillStyle:   'transparent', // starting fill style
            fontSize       : '25',    // current font size for text input
            fontFamily     : 'Arial', // active font family for text input
    });
    function saveImg(image) {
        var _this = this;
        // Upload(image);
         //images.push(resp.img);
         $.ajax({
            url:_Wvue.$store.state.serverIp+"/uploadblob_file/",
            type:"POST",
            data:{
                imgdata:image.split(',')[1]
            },
            success(res){
                $("#content").css({display:'none'});
                $('#wPaint').wPaint('clear');
                _Wvue.$store.commit("setshitu",res);
                let stat = JSON.stringify(_viewer.getState());
                _Wvue.$store.commit("setshitustate",stat);

            }
         })
        // $('#wPaint-img').attr('src', image);
        // debugger;
        window.localStorage.isimg = 2;

    }
    function loadImgBg () {
        // internal function for displaying background images modal
        // where images is an array of images (base64 or url path)
        // NOTE: that if you can't see the bg image changing it's probably
        // becasue the foregroud image is not transparent.
        this._showFileModal('bg', images);
    }
    function loadImgFg () {
        // internal function for displaying foreground images modal
        // where images is an array of images (base64 or url path)
        this._showFileModal('fg', images);
    }
    // init wPaint
    function wpaint(){
        $('#wPaint').css({
            width: "100px",
            height: "100px",
            position: "absolute",
            left: "10px",
            top: "10px",
        });
       $('#wPaint').wPaint({
            menuOffsetLeft: '30%',
            menuOffsetTop: '80%',
            saveImg: saveImg,
            loadImgBg: loadImgBg,
            loadImgFg: loadImgFg,
            lineWidth:   '1',
            strokeStyle: '#f30',
            theme: 'standard classic',
            autoScaleImage: true,
            autoCenterImage: true,
            menuOrientation: 'horizontal',//菜单对齐
            bg: 'transparent',//初始化背景颜色
            menuHandle: false,//菜单能否拖动
        });
        
    }
    
