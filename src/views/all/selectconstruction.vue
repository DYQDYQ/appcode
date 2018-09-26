<style scoped lang="less">
    @import url("../../less/all/locator.less");
</style>
<style type="text/css">
    .nodata{
        text-align: center;
        font-size: 14px;
    }
</style>
<template>
    <div style="height: 500px">
        <div style="height: 100%;display: flex;">
           <div style="width: 50%;overflow-y: auto;height: 100%;border-right: 1px solid #d9d9d9;">
                <div class="bacmain" v-if="level != 1" @click="bacmain">
                    <Icon type="arrow-return-left"></Icon>
                    返回
                </div>
                <div v-for="(item,index) in project" class="floor floorpar" v-if="level == 1">
                    <div class="tonext" @click="tonext(item,index)">
                        <Icon type="chevron-right"></Icon>
                        <span>{{item.value}}</span>
                    </div>
                    
                </div>
                <div class="nodata" v-if="project.length == 0 && level == 1">暂无数据哟！</div>
                <div v-for="(item,index) in floors" class="floor" v-if="level == 2">
                    <div class="tonext" @click="tonext(item,index)">
                        <Icon type="chevron-right"></Icon>
                        <span>{{item.value}}</span>
                    </div>
                    <div class="checkstate" @click="checklists(item,index)">
                        <span class="yesicon" v-show="item.check"></span>
                    </div>

                </div>
                <div class="nodata" v-if="floors.length == 0 && level == 2">暂无数据哟！</div>
                <div class="floor floorchild" v-for="(item,index) in children" v-if="level == 3">
                    <div class="checkstatechild" @click="choselist(item,index)">
                        <span>{{item.value}}</span>
                        <span class="yesicon" v-show="item.check"></span>
                    </div>
                </div>
                <div class="nodata" v-if="children.length == 0 && level == 3">暂无数据哟！</div>
            </div>
            <div style="width: 50%;overflow-y: auto;height: 100%;">
<!--                 <div class="floor floorchild" style="text-align: left;font-size: 14px">
                    构件列表
                </div> -->
                <div class="bacmain" style="height: 42px" v-if="goujianchildren.length > 0">
                    <span style="float: left;display: inline-block;width: 50%;" @click="bacgoujian"><Icon type="arrow-return-left"></Icon>返回</span>
                    <span style="float: right;display: inline-block;width: 50%;text-align: right;" @click="choseall"><span v-if="checkall">取消</span><span v-else>全选</span></span>
                </div>
                <div class="floor floorpar" v-for="(item,index) in goujianlist" v-if="goujianchildren.length == 0">
                    <div class="tonext" @click="chosegoujianchildren(item,index)">
                        <Icon type="chevron-right"></Icon>
                        <span>{{item.value}}</span>
                    </div>
                </div>
                <div class="floor floorchild" v-for="(item,index) in goujianchildren">
                    <div class="checkstatechild" @click="chosegoujian(item,index)">
                        <span>{{item.value}}</span>
                        <span class="yesicon" v-show="item.check"></span>
                    </div>
                </div>
                
            </div> 
        </div>
        
<!--         <div class="pupheader">
            <div class="headerleft" @click="cancelfloor">取消</div>
            <div class="headertitle"></div>
            <div class="headerright" @click="cancelfloor">完成</div>
        </div> -->
    </div>
</template>
<script>
    export default{
        data(){
            return{
                floors:[],
                floorsid:[],
                floorsname:[],
                childrenid:[],
                childrenname:[],
                children:[],
                parid:null,
                checkall:false,
                selElevations:[],
                selZones:[],
                level:1,
                project:[],
                major_id:'',
                goujianlist:[],
                goujianname:[],
                goujianid:[],
                goujianchildren:[],
            }
        },
        methods:{
            tonext(val,i){
                let vm = this;
                if(vm.level == 1){
                    if(vm.project[i].children.length == 0){
                        mui.ajax({
                            url:vm.$store.state.serverIp + "/task/elevations/?token="+vm.$store.state.sessionid,
                            data:{
                                perPage:999999,
                                unitproject:val.id
                            },
                            success(res){
                                res.results.forEach(t=>{
                                    let obj = {
                                        id:t.id,
                                        value:t.sign,
                                        children:[],
                                        step:0,
                                        check:false,
                                        val:'floor_'+t.id,
                                    }
                                    vm.floors.push(obj);
                                });
                                vm.project[i].children = vm.floors;
                                vm.major_id = val.major_id;
                            }
                        })  
                    }else{
                       vm.floors = vm.project[i].children; 
                    }
                    vm.level = 2;
                    return;
                   
                }
                if(vm.level == 2){
                    if(vm.floors[i].children.length == 0){
                         mui.ajax({
                            url:vm.$store.state.serverIp + '/task/zones/?token='+vm.$store.state.sessionid,
                            data:{
                                elevations:val.id,
                                major_id:vm.major_id,
                            },
                            success(res){
                                res.results.forEach((v,index) => {
                                    let obj = {
                                        id:v.id,
                                        value:v.name,
                                        check:false,
                                        val:val.id+"zone_"+v.id,
                                    }
                                    vm.children.push(obj);
                                })
                                vm.floors[i].children = vm.children;
                            }

                        });  
                     }else{
                        vm.children = vm.floors[i].children;
                     }
                     vm.level = 3;
                    
                }
            },
            bacmain(){
                if(this.level == 2){
                    this.level = 1;
                    this.floors = [];
                }else if(this.level == 3){
                    this.level = 2;
                    this.children = [];
                }
            },
            checklists(val,i){
                let vm = this;
                 val.check = !val.check;
                this.floors.forEach((v,index)=>{
                    if(index != i){
                        v.check = false;
                    }
                    
                });
                let index = vm.floorsid.indexOf(val.id);
                if(index >= 0){
                    vm.floorsid.splice(index,1);
                    vm.floorsname.splice(index,1);
                }else{
                    vm.floorsid.push(val.id);
                    vm.floorsname.push(val.value);
                }
                vm.goujianlist = [];
                vm.goujianchildren = [];
                mui.ajax({
                    url:`${vm.$store.state.serverIp}/task/goujian/glyspbtype/?id=${val.val}&major=${vm.major_id}&token=`+vm.$store.state.sessionid,
                    type:'get',
                    success(res){
                        res.results.forEach(v=>{
                            let obj = {
                                value:v.name,
                                id:v.id,
                                check:false,
                                parentval: val.val,
                                children:[],
                            }
                            vm.goujianlist.push(obj);
                        });
                    }
                })
            },
            choselist(val,i){
                let vm = this;
                val.check = !val.check;
                vm.checkall = false;
                this.floors.forEach((v,index)=>{
                        v.check = false;
                        
                });
                this.children.forEach((v,index)=>{
                    if(index != i){
                        v.check = false;
                    }
                    
                });
                let index = vm.childrenid.indexOf(val.id);
                if(index >= 0){
                    vm.childrenid.splice(index,1);
                    vm.childrenname.splice(index,1);
                }else{
                    vm.childrenid.push(val.id);
                    vm.childrenname.push(val.value);
                }
                if(vm.level == 3){
                    vm.goujianlist = [];
                    vm.goujianchildren = [];
                    mui.ajax({
                        url:`${vm.$store.state.serverIp}/task/goujian/glyspbtype/?id=${val.val}&major=${vm.major_id}&token=`+vm.$store.state.sessionid,
                        type:'get',
                        success(res){
                            res.results.forEach(v=>{
                                let obj = {
                                    value:v.name,
                                    id:v.id,
                                    check:false,
                                    parentval: val.val,
                                    children:[],
                                }
                                vm.goujianlist.push(obj);
                            });
                        }
                    })
                }

            },
            choseall(){
                this.checkall = !this.checkall;
                if(this.checkall){
                    this.goujianchildren.forEach((v,index)=>{
                            v.check = true;
                    });
                }else{
                    this.goujianchildren.forEach((v,index)=>{
                            v.check = false;
                    });
                }
                
            },
            cancelfloor(i){
                if(i == 'cancel'){
                    this.floorsid = [];
                    this.floorsname = [];
                    this.childrenid = [];
                    this.childrenname = [];
                }else{
                    this.$emit("subcontent",this.floorsname.join(' ')+this.childrenname.join(' '));
                }
                this.$emit("closefloor",false);
            },
            chosegoujian(val,i){
                let vm = this;
                val.check = !val.check;
            },
            subgou(){
                let vm = this;
                let arr = [];
                this.$store.commit('setchangestate',false);
                this.goujianchildren.forEach(v=>{
                    if(v.check){
                        let obj = {
                            typetable:'构件',
                            relatedid:v.id,
                        }
                        arr.push(obj);
                    }
                });
                mui.ajax({
                    type: "post",
                    url: `${serverIp}/task/goujian/transpblist/?token=`+vm.$store.state.sessionid,
                    data:{
                        type:"elelist",
                        elelist:JSON.stringify(arr)
                        
                    },
                    cache: false,
                    success: function(data) {
                       
                        vm.$emit('givegoujian',JSON.stringify(data));
                        vm.$store.commit('setchangestate',true);

                    },
                    error(res){
                        vm.$Message.error(res);
                    }
                });
            },
            chosegoujianchildren(val,i){
                let vm = this;
                vm.goujianchildren = [];
                mui.ajax({
                    url:`${vm.$store.state.serverIp}/task/goujian/glys/?id=${val.parentval}&major=${vm.major_id}&pbtype=${val.id}&token=`+vm.$store.state.sessionid,
                    type:'get',
                    success(res){
                        JSON.parse(res).goujians.forEach(v=>{
                            let obj = {
                                value:v.sign,
                                id:v.id,
                                check:false,
                                class:v.class
                            }
                            vm.goujianchildren.push(obj);
                        });

                    }
                })
            },
            bacgoujian(){
                this.goujianchildren = [];
            }
        },
        mounted(){
            let vm = this;
            $.ajax({
                url:vm.$store.state.serverIp + "/task/modelfiles/?token="+vm.$store.state.sessionid,
                success(res){
                    let a = res.results;
                    a.forEach((val,index)=>{
                            let obj = {
                                value:val.unitprojectname+'-'+val.majorname,
                                id:val.relatedunitprojectid,
                                major_id:val.relatedmajorid,
                                children:[],
                            }
                           // if(val.isdefault){
                           //    vm.value = val.relatedunitprojectid+','+val.relatedmajorid;
                           //    vm.checknumber = index;
                           // }
                           vm.project.push(obj);
                    })
                }
            })
        },
        watch:{
            goujianchildren(val){
                if(val.length == 0){
                    this.checkall = false;
                }
            }
        }
    }
</script>