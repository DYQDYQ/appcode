<style>
    #bcid {
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 44px;
        text-align: center;
        background-color: #1c2438;
    }
    .tip {
        color: #FFFFFF;
        font-weight: bold;
        text-shadow: 0px -1px #103E5C;
    }
    footer {
        width: 100%;
        height: 44px;
        position: absolute;
        bottom: 0;
        line-height: 44px;
        text-align: center;
        color: #FFF;
    }
    .fbt {
        width: 50%;
        height: 100%;
        background-color: #FFCC33;
        float: left;
    }
    .fbt:active {
        -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.5);
        box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.5);
    }
</style>

<template>
    <div style="height: 100%;">
        <div id="bcid">
            <div style="height:40%"></div>
            <p class="tip">...载入中...</p>
        </div>
        <footer>
            <div class="fbt" onclick="window.history.go(-1)">取　消</div>
            <div id="btCancel" class="fbt" onclick="scanSwitch()">暂　停</div>
        </footer>
    </div>
</template>

<script>
    //import '../common.js';
    export default {
        mounted(){
            console.log('mounted');
            mui.plusReady(function(){
                initQR()
            });
        }
    }
    function backTo() {
        window.history.go(-1);
    }
    function initQR() {
        var ws=null,wo=null;
        var scan=null,domready=false,bCancel=false;
// H5 plus事件处理
        function plusReady(){
            console.log(11111111111);
            console.log(ws);
            console.log(window.plus);
            console.log(domready);
            if(ws||!window.plus||domready){
                return;
            }
            // 获取窗口对象
            ws=plus.webview.currentWebview();
            wo=ws.opener();
            // 开始扫描
            ws.addEventListener('show',function(){
                scan=new plus.barcode.Barcode('bcid',[plus.barcode.QR,plus.barcode.EAN8,plus.barcode.EAN13],{frameColor:'#D44C4C',scanbarColor:'#D44C4C'});
                scan.onmarked=onmarked;
                scan.start({conserve:true,filename:'_doc/barcode/'});
            });
            // 显示页面并关闭等待框
            ws.show('pop-in');
        }
        if(window.plus){
            plusReady();
        }else{
            document.addEventListener('plusready', plusReady, false);
        }
        document.addEventListener('DOMContentLoaded', function(){
            domready=true;
            plusReady();
        }, false);
        function onmarked(type, result, file){
            switch(type){
                case plus.barcode.QR:
                    type = 'QR';
                    break;
                case plus.barcode.EAN13:
                    type = 'EAN13';
                    break;
                case plus.barcode.EAN8:
                    type = 'EAN8';
                    break;
                default:
                    type = '其它'+type;
                    break;
            }
            result = result.replace(/\n/g, '');
            alert(JSON.stringify(result))
        }
        function scanSwitch() {
            if(bCancel){
                scan.start({conserve:true,filename:'_doc/barcode/'});
                btCancel&&(btCancel.innerText='暂　停');
            }else{
                scan.cancel();
                btCancel&&(btCancel.innerText='开　始');
            }
            bCancel=!bCancel;
        }
    }
</script>