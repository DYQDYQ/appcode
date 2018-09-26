<style lang="less" rel="stylesheet/less" scoped>
    @import "../../less/index.less";
    @import "../../less/all/animat.less";
</style>
<template>
    <div class="addcontent">
        <img id="wPaint-img">
        <Form :label-width="80">
            <FormItem label="选择层级" style="margin-bottom: 5px !important">
                <div style="color: #999;height: 36px;line-height: 36px;display: inline-block;width: calc(100% - 40px)" @click="showfloor = true">{{floorscontent == ''? '选择层级' : floorscontent}}</div>
            </FormItem>
            <FormItem label="添加描述" style="margin-bottom: 5px !important">
                <group>
                    <x-textarea v-model="describe" placeholder="请输入视点描述..." :show-counter="true" :max="100" :rows="2"></x-textarea>
                </group>
            </FormItem>
        </Form>
        <transition name="bottomdrawer">
            <shitulevel class="bottomdrawer" @subcontent="subcontent" @closefloor="closefloor" v-if="showfloor"></shitulevel>
        </transition>
        <div style="position: fixed;top: 0px;left: 0px;bottom: 0px;background-color: #000;opacity: 0.5;z-index: 9999;right: 0px;" v-if="showfloor" @click="showfloor = false"></div>
        <div class="bottomlist">
                <Button type="text" @click="submitit('cancel')" style="float: left">取消</Button>
                <Button type="error" @click="submitit('sub')">确定</Button>
        </div>
    </div>
</template>
<script>
    import {  Group,Range, Cell ,XTextarea,Swipeout, SwipeoutItem, SwipeoutButton} from 'vux';
    import shitulevel from './shitulevel.vue';
   export default{
        components: {
            Range,
            Group,
            Cell,
            XTextarea,
            Swipeout,
            SwipeoutItem,
            SwipeoutButton,
            shitulevel
        },
        data(){
            return{
            level:1,
            addlevel:[],
            describe:'',
            showfloor:false,
            floorscontent:'',
            categoryid:null
            }
        },
        methods:{
           jietuok(){
               this.addjietu = false;
               this.typeChange('shitu');
           },
           jietucancel(){
               this.addjietu = false;
           },
           choseit(val,i){
               this.addlevel.forEach(val=>{
                   val.check = false;
               });
               val.check = true;
           },
           tonext(val,i){
           },
           subcontent(val){
              this.floorscontent = val[0];
              this.categoryid = val[1];
           },
           closefloor(val){
            this.showfloor = false;
           },
           submitit(val){
            let vm = this;
            if(val == 'cancel'){
              this.$emit("closeshitu",false);
            }else{
                if(vm.describe == ''){
                    vm.$Message.error("请输入描述");
                    return;
                };
                mui.ajax({
                    url:`${vm.$store.state.serverIp}/task/viewpoint/?token=`+vm.$store.state.sessionid,
                    type:"POST",
                    data:{
                        "name":vm.describe,
                        "viewpoint":vm.$store.state.shitustate,
                        "category":vm.categoryid,
                        "file":vm.$store.state.shitu.docId
                    },
                    success(res){
                        
                        vm.$emit("closeshitu",false);
                    }
                })
            }
           }
        }
   } 
</script>