<style>
    .levelhead {
            width: 100%;
            height: 40px;
            background-color: #fff;
            position: absolute;
            top: 0;
            line-height: 40px;
            text-align: center;
    }
    .levelcenter {
        color: gray;
        font-size: 20px;
        margin-left: -50px;
    }
</style>
<template>
    <div>
    <div class="levelhead">
        <a @click="back" style="float: left;margin-left: 16px;font-size: 22px;color: #D54C4C;width: 50px"><Icon type="ios-arrow-left"></Icon></a>
        <label class="levelcenter">{{title}}</label>
    </div>
    <div style="height:calc(100% - 40px);width: 100%;position: absolute;top: 40px;left: 0px;">
       <router-view></router-view> 
    </div>
    
    </div>
</template>
<script>
    export default{
        props:{
            
        },
        data(){
            return{
                
            }
        },
        methods:{
            back(){
                this.$router.go(-1);
            }
        },
        computed:{
            title(){
                return this.$store.state.leveltitle;
            }
        }
    }
</script>