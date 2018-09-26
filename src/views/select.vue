<style scoped>
    @import "../less/all/animat.less";
    .promodel{
        width: 200px;
        height: 120px;
        border: 1px solid red;
        box-shadow: 2px 2px 10px 4px rgba(237,63,20,.2);
        display: inline-block;
        border-radius: 6px;
        margin: 0 calc((100% - 800px)/8) 50px;
        text-align: center;
        background-color: white;
        background-repeat: no-repeat;
        background-size: cover;
        position: relative;
    }
    .promodel:after{
        content: '';
        background-image: url("../../src/img/subscript.png");
        width: 30px;
        height: 30px;
        display: inline-block;
        position: absolute;
        background-repeat: round;
        right: -15px;
        bottom: -15px;
    }
    header{
        line-height: 40px;
        border-bottom: 1px solid #DDDEE0;
        text-align: center;
        font-size: 20px;
        background-color: white;
    }
    .promodels{
        background-color: #e1e1e1;
        height: calc(100% - 41px);
        overflow: auto;
        display: flex;
        flex-wrap: wrap;
        padding-top: calc((100vw - 800px)/8);
        overflow-y: auto;
    }
    .proname{
        position: absolute;
        font-size: 16px;
        bottom: -38px;
        left: 0;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space:nowrap;
    }
</style>
<template>
    <div class="a">
        <header>项目选择<a class="topiconleft" @click="bacbutton"><Icon type="chevron-left"></Icon></a></header>
        <div class="promodels">
            <div class="promodel" v-for="i in project" @click="enter(i)" :style="'background-image:url('+ i.image +')'">
                <span class="proname">{{i.name}}</span>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                project:[]
            }
        },
        methods:{
            enter(i){
                localStorage.server = i.projecturl;
                this.$router.push("/login");
            },
            bacbutton(){
                this.$router.go(-1);
            }
        },
        mounted(){
            let vm = this;
            mui.ajax({
                url:vm.$store.state.serverIp + "/user/project/?token="+vm.$store.state.sessionid,
                success(res){
                    vm.project = res.results;
                }
            })
        }
    }
</script>