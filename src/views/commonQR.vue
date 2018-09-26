<style scoped lang="less">
  @import "../less/all/qr.less";
</style>
<template>
    <div class="mainbox">
        <div class="header" style="position: absolute;top: 10px;left: 10px;color: #fff;z-index: 999" @click="dismiss">返回</div>
        <div class="scantop"></div>
        <div class="scanleft"></div>
        <div class="scanright"></div>
        <div class="commonbottom">
          
        </div>
        <div class="qrscanner-area1"></div>
        <div class="through-line"></div>
        <div class="bottom1">
            <div class="scanBut" @click="modelQR">
              <div class="bottombox" :class="ismodel ? 'model1' : 'model'"></div>
              <div class="bottomfont">模型</div>
            </div>
            <div class="scanBut" @click="planQR">
              <div class="bottombox" :class="isplan ? 'plan1' : 'plan' "></div>
              <div class="bottomfont">进度</div>
            </div>
            <div class="scanBut" @click="qualityQR">
              <div class="bottombox" :class="isquality ? 'quality1' : 'quality' "></div>
              <div class="bottomfont">质量整改</div>
            </div>
            <div class="scanBut" @click="safeQR">
              <div class="bottombox" :class="issafe ? 'safe1' : 'safe' "></div>
              <div class="bottomfont">安全整改</div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                light:false,
                ismodel:false,
                isplan:false,
                isquality:false,
                issafe:false,
            }
        },
        mounted(){

            window.QRScanner.prepare(this.onDone);
        },
        methods:{
            onDone(err,status) {
                if(err) {
                    alert(err);
                }
                if(status.authorized) {
                    
                    window.QRScanner.show();
                }else if(status.denied) {
                    alert("请打开相机访问权限");
                }else {
                    alert("未许可");
                }
            },
            displayContents(err, text,where){
              if(err) {
                alert("扫码错误");
              }else {
                console.log(text);
                this.$store.commit('addQR',{
                    value:text
                });
                window.QRScanner.hide();
                window.QRScanner.cancelScan();
                this.$router.push({ path: where}); 
              }
            },
            dismiss(){
              window.QRScanner.hide();
              window.QRScanner.cancelScan();

              this.$router.back();
            },
            toggleLight() {
              this.light = !this.light;
              if (this.light) {
                window.QRScanner.disableLight();
              } else {
                window.QRScanner.enableLight();

              }
            },
            modelQR(){//模型预览
              this.ismodel = true;
              this.isplan = false;
              this.isquality = false;
              this.issafe = false;
              let where = "/main/all/modelView";
              window.QRScanner.scan(this.displayContents,where);
            },
            planQR() {//工程进度录入
              this.ismodel = false;
              this.isplan = true;
              this.isquality = false;
              this.issafe = false;
              let where = "/main/plan/constructionRecord";
              window.QRScanner.scan(this.displayContents,where);
            },
            qualityQR() {//发起质量整改单
              this.ismodel = false;
              this.isplan = false;
              this.isquality = true;
              this.issafe = false;
              let where = "/main/quality/add";
              window.QRScanner.scan(this.displayContents,where);
            },
            safeQR() {//发起安全整改单
              this.ismodel = false;
              this.isplan = false;
              this.isquality = false;
              this.issafe = true;
              let where = "/main/safety/add";
              window.QRScanner.scan(this.displayContents,where);
            }
        }
        
    }
</script>