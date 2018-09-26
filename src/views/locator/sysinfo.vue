<style lang="less" rel="stylesheet/less" scoped>
    @import url("../../less/all/modelLocator.less");
</style>
<template>
    <div>
        <div class="box boxfile" ref="boxfile">
            <ul class="boxbody">
                <li class="inforlist" v-for="item in relatefile">
                    <span class="listhead">{{item.fileshortname}}</span>
                </li>
                <li class="inforlist" v-if="relatefile.length == 0">
                    <span class="listhead">暂时没有关联文件</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import BScroll from 'better-scroll';
    export default{
        data(){
            return{
                itemarr:[],
                firstopen:'0',  
            }
            
        },
        mounted(){
            this.$nextTick(function(){
                let height = document.body.clientHeight - 137;
                $(".boxfile").css("height",height);
                this.scroll = new BScroll(this.$refs.boxfile,{click: true});
            })
        },
        computed:{
            relatefile(){

               return JSON.parse(this.$store.state.relatefilelist);
            }
        },
        watch:{
            relatefile(val){
                console.log(val);
            }
        }
    }
</script>