<style type="text/css">
    
</style>
<template>
    <div style="width: 100%;height: 100%">
        <div id="elfinders"></div>
    </div>
</template>
<script>
    export default{
        data(){
            return{

            }
        },
        mounted(){
            this.$nextTick(function(){
                let height = document.body.clientHeight - 47;
                console.log($("#elfinder"));
                $("#elfinders").elfinder({
                    url : `${_Wvue.$store.state.serverIp}/task/ziliao/connector/`,
                    lang: 'zh_CN',
                    height: height,
                })
            })
        }
    };
</script>
