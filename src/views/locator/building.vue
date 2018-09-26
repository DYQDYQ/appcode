<style scoped lang="less">
    @import url("../../less/all/locator.less");
</style>
<template>
    <div style="width: 100%;height: calc(100% - 40px);overflow-y: auto">
        <div v-for="(item,index) in floors" class="floor" v-if="children.length == 0">
            <div class="tonext" @click="tonext(item,index)">
                <Icon type="chevron-right"></Icon>
                <span>{{item.value}}</span>
            </div>
            <div class="checkstate" @click="checklists(item,index)">
                <span class="yesicon" v-if="item.check == 1"></span>
                <span v-if="item.check == 2"><Icon type="minus"></Icon></span>
            </div>
        </div>
        <div class="bacmain" v-if="children.length > 0" @click="bacmain">
            <Icon type="arrow-return-left"></Icon>
            返回
        </div>
        <div class="floor floorchild" v-for="(item,index) in children" v-if="children.length > 0">
            <div class="checkstatechild" @click="choselist(item,index)">
                <span>{{item.value}}</span>
                <span class="yesicon" v-show="item.check"></span>
            </div>
        </div>
        <Spin fix v-show="loading"></Spin>
        <div v-if="floors.length == 0" style="font-size: 14px;text-align: center">暂无数据哟！</div>
    </div>
    
</template>

<script>
    import _ from 'lodash'
    export default {
        components:{
        },
        props:{
            project:{
                type:[String],
                required:true
            }
        },
        data(){
            return {
                floors:[],
                total:true,
                indeterminate:false,
                labelPosition:'left',
                children:[],
                checkpar:false,
                parid:null,
                checkall:false,
                selElevations:[],
                selZones:[],
                lastid:null,
                childrenid:[],
                relatedmajorid:null,
                loading:false
            }
        },
        methods:{
            tonext(val,i){
                let vm = this;
                vm.childrenid = [];
                vm.lastid = val.id;
                if(vm.children.length===0 && val.step == 0){
                    mui.ajax({
                        url:vm.$store.state.serverIp + '/task/zones/?token='+vm.$store.state.sessionid,
                        data:{
                            elevations:val.id,
                            major_id:vm.project.split(',')[1] || vm.relatedmajorid
                        },
                        success(res){
                            res.results.forEach((v,index) => {
                                let obj = {
                                    id:v.id,
                                    value:v.name,
                                    check:val.check,
                                }
                                vm.children.push(obj);
                                vm.selZones.push(v.id);
                            })
                            vm.floors[i].children = vm.children;
                            val.step = 1;
                        }

                    })
                }
                if(val.step == 1){
                    vm.children = vm.floors[i].children;
                    if(val.check == 1){
                        vm.children.forEach(v=>{
                            v.check = 1;
                            if(vm.selZones.indexOf(v.id) == -1){
                                vm.selZones.push(v.id);
                            }
                        })
                    }
                }
                this.parid = i;
            },
            bacmain(){
                if(this.childrenid.length == this.children.length){
                    if(this.selElevations.indexOf(this.lastid) == -1){
                        this.selElevations.push(this.lastid);
                        this.floors.forEach(val => {
                            if(val.id == this.lastid){
                                val.check = 1;
                            }
                        })
                    }
                }
                if(this.childrenid.length == 0){
                    if(this.selElevations.indexOf(this.lastid) == -1){
                        this.floors.forEach(val => {
                            if(val.id == this.lastid){
                                val.check = 0;
                            }
                        })
                    }
                }
                if(this.childrenid.length != this.children.length && this.childrenid.length != 0){
                    this.floors.forEach(val => {
                        if(val.id == this.lastid){
                            val.check = 2;
                        }
                    })
                }
                this.children = [];
                this.childrenid = [];

            },
            checklists(val,i){
                let vm = this;
                if(val.check == 0){
                    val.check = 1;
                }else if(val.check == 1){
                    val.check = 0;
                }else if(val.check == 2){
                    val.check = 1;
                }
                vm.selElevations = [];
                vm.floors.forEach((v,index)=>{
                    if(v.check == 1){
                        vm.selElevations.push(v.id);
                    }
                    if(val.id == v.id && v.check == 0){
                        v.children.forEach(a=>{
                            a.check = 0;
                            if(vm.selZones.indexOf(a.id) > -1){
                                vm.selZones.splice(vm.selZones.indexOf(a.id),1);
                            }
                        })
                    }
                });
                if(vm.selZones.length > 0){
                    _selZones = vm.selZones.toString()+",";
                }else{
                    _selZones = vm.selZones.toString();
                }
                if(vm.selElevations.length > 0){
                    _selElevations = vm.selElevations.toString()+",";
                }else{
                    _selElevations = vm.selElevations.toString();
                }
                filterPblist();
            },
            choselist(val,i){
                let vm = this;
                vm.childrenid = [];
                if(val.check == 0){
                    val.check = 1;
                }else if(val.check == 1){
                    val.check = 0;
                }
                if(vm.selZones.indexOf(val.id) > -1){
                    vm.selZones.splice(vm.selZones.indexOf(val.id),1);
                }else{
                    vm.selZones.push(val.id);
                }
                vm.children.forEach(value=>{
                    if(value.check == 1){
                        vm.childrenid.push(value.id);
                    }
                });
                if(vm.selZones.length > 0){
                    _selZones = vm.selZones.toString()+",";
                }else{
                    _selZones = vm.selZones.toString();
                }
                /// todo
                let index = vm.selElevations.indexOf(vm.lastid);
                if(index > -1){
                    vm.selElevations.splice(index,1);
                    if(vm.selElevations.length > 0){
                    _selElevations = vm.selElevations.toString()+",";
                    }else{
                        _selElevations = vm.selElevations.toString();
                    }
                }
                filterPblist();
            },
            choseall(){
                this.checkall = !this.checkall;
                if(this.children.length==0){                   
                    if(this.checkall){
                        this.floors.forEach(v=>{
                            v.check = 1;
                            if(v.children.length > 0) {
                                v.children.forEach(val=>{
                                    val.check = 1;
                                })
                            }
                        })
                    }else{
                        this.floors.forEach(v=>{
                            v.check = 0;
                            if(v.children.length > 0) {
                                v.children.forEach(val=>{
                                    val.check = 0;
                                })
                            }
                        })
                    }
                }else{
                    if(this.checkall){
                        this.children.forEach(v=>{
                            v.check = 1;
                        })
                    }else{
                        this.children.forEach(v=>{
                            v.check = 0;
                        })
                    }
                }
                
            },
            loadlevel(item){
                let vm = this;
                vm.floors = [];
                mui.ajax({
                    url:vm.$store.state.serverIp + "/task/elevations/?token="+vm.$store.state.sessionid,
                    data:{
                        perPage:1000,
                        unitproject:item
                    },
                    success(res){
                        res.results.forEach(t=>{
                            let obj = {
                                id:t.id,
                                value:t.name,
                                children:[],
                                step:0,
                                check:0,
                            }
                            vm.floors.push(obj);

                        });
                        vm.loading = false;
                    }
                })
            }
        },
        mounted(){
            let vm = this;
            vm.$nextTick(function(){
                vm.loading = true;
            })
            if(this.project == ''){
                $.ajax({
                    url:vm.$store.state.serverIp + "/task/modelfiles/?token="+vm.$store.state.sessionid,
                    success(res){
                        let a = res.results;
                        a.forEach((val,index)=>{
                               if(val.isdefault){
                                  vm.loadlevel(val.relatedunitprojectid);
                                  vm.relatedmajorid = val.relatedmajorid;
                               }
                        })
                    }
                })
            }else{
                vm.loadlevel(vm.project.split(',')[0]);
            }
            
        },
        computed:{
            restore(){
                return this.$store.state.restore;
            }
        },
        watch:{
            project(){
                let vm = this;
                vm.floors = [];
                mui.ajax({
                    url:vm.$store.state.serverIp + "/task/elevations/?token="+vm.$store.state.sessionid,
                    data:{
                        perPage:1000,
                        unitproject:vm.project.split(',')[0]
                    },
                    success(res){
                        res.results.forEach(t=>{
                            let obj = {
                                id:t.id,
                                value:t.sign,
                                children:[],
                                step:0,
                                check:0,
                            }
                            vm.floors.push(obj);
                        });
                        vm.children = [];
                    }
                })
            },
            restore(val){
                this.children = [];
                this.floors.forEach(val=>{
                    val.check = 0;
                });
            }

        }
    }
</script>