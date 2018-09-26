<style scoped lang="less">
    @import url("../../less/all/locator.less");
</style>
<template>
    <div>
        <div class="pupheader">
            <div class="headerleft" @click="cancelfloor('cancel')">取消</div>
            <div class="headertitle"></div>
            <div class="headerright" @click="cancelfloor('sure')">完成</div>
        </div>

        <div style="height: 238px;width: 100%;overflow-y: scroll">
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
            }
        },
        methods:{
            tonext(val,i){
                let vm = this;
                if(vm.level == 1){
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
                                        levelid:'floor_'+t.id,
                                    }
                                    vm.floors.push(obj);
                                });
                                vm.project[i].children = vm.floors;
                                vm.level = 2;
                                vm.major_id = val.major_id;
                            }
                        })  
                   
                }
                if(vm.level == 2){
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
                                        parentid:val.id,
                                        zoneid:val.id+'zone_'+v.id

                                    }
                                    vm.children.push(obj);
                                })
                                vm.floors[i].children = vm.children;
                                vm.level = 3;
                            }

                        })   
                    
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
                vm.children = [];
                this.floors.forEach(v=>{
                    if(v.id == val.id){
                        val.check = !val.check;
                    }else{
                        v.check = false;
                    }
                })
            },
            choselist(val,i){
                let vm = this;
                this.floors.forEach(v=>{
                        v.check = false;
                })
                this.children.forEach(v=>{
                    if(v.id == val.id){
                        val.check = !val.check;
                    }else{
                        v.check = false;
                    }
                })
            },
            choseall(){
                this.checkall = !this.checkall;
                if(this.children.length==0){                   
                    if(this.checkall){
                        this.floors.forEach(v=>{
                            v.check = true;
                            if(v.children.length > 0) {
                                v.children.forEach(val=>{
                                    val.check = true;
                                })
                            }
                        })
                    }else{
                        this.floors.forEach(v=>{
                            v.check = false;
                            if(v.children.length > 0) {
                                v.children.forEach(val=>{
                                    val.check = false;
                                })
                            }
                        })
                    }
                }else{
                    if(this.checkall){
                        this.children.forEach(v=>{
                            v.check = true;
                        })
                    }else{
                        this.children.forEach(v=>{
                            v.check = false;
                        })
                    }
                }
                
            },
            cancelfloor(i){
                let vm = this;
                if(i == 'cancel'){
                    this.floorsid = [];
                    this.floorsname = [];
                    this.childrenid = [];
                    this.childrenname = [];
                }else{
                    if(this.floors.length != 0){
                        this.floors.forEach(v=>{
                            if(v.check){
                                vm.$emit("subfloorsid",[v.levelid,v.value]);
                            }
                        })
                    }
                    if(this.children.length != 0){
                        this.children.forEach(v=>{
                            if(v.check){
                                vm.$emit("subfloorsid",[v.zoneid,v.value]);
                            }
                        })
                    }
                }
                this.$emit("closefloor",false);
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
                                isdefault:val.isdefault,
                                mainid:val.id,
                            }
                           vm.project.push(obj);
                    });
                    if(vm.$store.state.belongmodel != null){
                        vm.project.forEach((val,index)=>{
                            if(vm.$store.state.belongmodel == val.mainid){
                                vm.tonext(val,index);
                            }
                        })
                    }else{
                        vm.project.forEach((val,index)=>{
                            if(val.isdefault){
                                vm.tonext(val,index);
                            }
                        })
                    }
                    
                }
            });
        }
    }
</script>