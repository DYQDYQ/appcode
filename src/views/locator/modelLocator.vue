<style scoped lang="less">
@import url("../../less/all/modelLocator.less");
</style>
<style type="text/css">
    .ivu-collapse-header{
        padding-left: 12px !important;
        font-size: 14px !important;
        font-weight: 700 !important;
    }
    .ivu-collapse{
        border: 0px solid #d7dde4 !important;
    }
    .inforlist{
        height: 38px !important;
        background-color: #f7f7f7;
        line-height: 38px;
    }
    .choseit{
        color: #fff;
        background-color: #d44c4c; 
    }
    .listhead{
        color: #666;
    }
</style>
<template>
    <div style="height: 100%">
        <div class="checkhead" v-if="state != 'member'">
            <div class="itemhead" v-if="state=='building'">
                模型选择
            </div>
            <div class="itemhead" v-if="state=='floor'">
                楼层选择
                <!-- <div @click="dochose('floor')" style="display: inline-block;"><Icon type="ios-checkmark"></Icon></div> -->
            </div>
            <div class="itemhead" v-if="state=='type'">
                类型选择
                <div @click="dochose('type')" style="display: inline-block;float: right;margin-right: 15px;">全选</div>
            </div>
            <div class="itemhead" v-if="state=='shitu'">
                视点管理
            </div>
        </div>
        <div class="boxheadmodel" style="padding-left: 0px;font-size: 0px;" v-if="state == 'member'">
            <span class="tabbutton" @click="showtab = 'sys'" :class="{'choseit':showtab == 'sys'}">构件属性</span>
            <span class="tabbutton" @click="showtab = 'web'" :class="{'choseit':showtab == 'web'}">关联文件</span>
        </div>
        <keep-alive>
                <model v-model="modelData" v-if="state=='building'"></model>
                <room v-model="romeData" :project="project" v-else-if="state=='floor'" ref="roommodel"></room>
                <type :major="major" v-else-if="state=='type'" ref="typemodel"></type>
                <div class="inforbox" v-else-if="state=='member'" style="height: 100%;overflow: hidden">
                    <goujianinfo class="box" v-show="showtab == 'sys'"></goujianinfo>
                    <sysinfo v-show="showtab == 'web'"></sysinfo>
                </div>
        </keep-alive>
        <shitu v-if="state == 'shitu'"></shitu>
    </div>
</template>
<script>
    import room from './building.vue';
    import model from './model.vue';
    import type from './type.vue';
    import shitu from './shitu.vue';
    import sysinfo from './sysinfo.vue';
    import goujianinfo from './goujianinfo.vue';
    export default {
        props:{
            state:{
                type:String,
                'default':'model'
            },
            floorstrstate:{
                type:String
            }
        },
        components:{
            model,
            room,
            type,
            shitu,
            sysinfo,
            goujianinfo
        },
        data(){
            return {
                modelData:"",
                romeData:"",
                itemarr:[],
                showtab:'sys',
                scroll:'',
                relatefiles:[{
                    fileshortname:"kkk"
                },
                {
                    fileshortname:"ssss"
                }
                ]
            }
        },
        computed:{
            project(){
                return this.modelData;
            },
            major(){
                return this.modelData.split(',')[1]
            },
            infor(){
               return JSON.parse(this.$store.state.pbproperty);
                
            },
            relatefile(){

               return JSON.parse(this.$store.state.relatefilelist);
            },
        },
        watch:{
            modelData(){
                this.$emit('input',{modelData:this.modelData,romeData:this.romeData})
            },
            infor(val,old){
                console.log(val);
            },
            relatefile(val,old){
                console.log(val);
            },
        },
        methods:{
            dochose(val){
                if(val == 'floor'){
                    this.$refs.roommodel.choseall();
                }else{
                    this.$refs.typemodel.choseall();
                }
                
            }
        }
    }
</script>