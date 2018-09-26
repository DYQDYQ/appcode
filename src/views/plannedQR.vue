<style scoped lang="less">
  @import "../less/all/qr.less";
</style>
<template>
    <div class="mainbox">
        <div class="scantop"></div>
        <div class="scanleft"></div>
        <div class="scanright"></div>
        <div class="qrscanner-area"></div>
        <div class="through-line"></div>
        <div class="qrbottom">
            <div class="bottommain" @click="dismiss">取消</div>
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
                    
                    window.QRScanner.show(function(status){
                      console.log(status);
                    });
                    window.QRScanner.scan(this.displayContents);
                }else if(status.denied) {
                    alert("请打开相机访问权限");
                }else {
                    alert("未许可");
                }
            },
            displayContents(err, text){
              if(err) {
                console.log(err);
              }else {
                this.$store.commit('addQR',{
                    value:text
                });
                this.dismiss();
              }
            },
            dismiss(){
              window.QRScanner.destroy(function(status){
                console.log('关闭摄像机');
                console.log(status);
              });
              // window.QRScanner.hide(function(status){
              //     console.log(status);
              //   });
              // window.QRScanner.cancelScan(function(status){
              //   console.log('关闭摄像机');
              //   console.log(status);
              // });
              // this.$store.commit('addQR',{
              //       value:'BS-03-B1-2'
              //   });
                this.$store.commit('setqrstate',false);
            },
            toggleLight() {
              this.light = !this.light;
              if (this.light) {
                window.QRScanner.disableLight();
              } else {
                window.QRScanner.enableLight();

              }
            },
        }
        
    }
</script>