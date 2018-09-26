<style scoped lang="less">
    @import url("../../less/all/locator.less");
</style>
<template>
        <div style="width: 100%;">
            <div class="floor floorchild" v-for="(item,index) in value">
                <div class="checkstatechild" @click="choselist(item,index)">
                    <span>{{item.value}}</span>
                    <span class="yesicon" v-show="item.check"></span>
                </div>
            </div>
            <Spin fix v-if="loading"></Spin>
            <div v-if="value.length == 0" style="font-size: 14px;text-align: center">暂无数据哟！</div>
        </div>
</template>

<script>
    import _ from "lodash";
    export default {
        props:{
            major:{
                type:String,
                default:""
            }
        },
        data(){
            return {
                pbs:[],
                value:[],
                indeterminate:false,
                checkall:false,
                loading:false,
                changecheck:'',
            }
        },
        methods:{
            choselist(val,i){
                let arr = [];
                val.check = !val.check;
                this.value.forEach(v => {
                    if(v.check){
                        arr.push(v.id);
                    }
                    
                })
                if(arr.length > 0){
                    _selPbtypes = arr.toString()+",";
                }else{
                    _selPbtypes = arr.toString();
                }
                this.changecheck = _selPbtypes;
                filterPblist();
            },
            choseall(){
                this.checkall = !this.checkall;
                let arr = [];
                if(this.checkall){
                    this.value.forEach(v=>{
                        v.check = true;
                        arr.push(v.id);
                    })
                }else{
                    this.value.forEach(v=>{
                        v.check = false;
                    })
                }
                if(arr.length > 0){
                    _selPbtypes = arr.toString()+",";
                }else{
                    _selPbtypes = arr.toString();
                }
                filterPblist();
            },
            loadpbtypes(item){
                let vm = this;
                mui.ajax({
                    url:vm.$store.state.serverIp + "/task/pbtypes/?token="+vm.$store.state.sessionid,
                    data:{
                       major:item,
                    },
                    success(res){
                        vm.pbs = res.results;
                        vm.value = [];
                        res.results.forEach(t=>{
                            let obj = {
                                value:t.name,
                                id:t.id,
                                check:false,
                            }
                            vm.value.push(obj);
                        })
                        vm.loading = false;
                    }
                })
            }
        },
        mounted(){
            let vm = this;
            vm.loading = true;
            if(vm.major == ''){
                $.ajax({
                    url:vm.$store.state.serverIp + "/task/modelfiles/?token="+vm.$store.state.sessionid,
                    success(res){
                        let a = res.results;
                        a.forEach((val,index)=>{
                               if(val.isdefault){
                                  vm.loadpbtypes(val.relatedmajorid);
                               }
                        })
                    }
                })
            }else{
                vm.loadpbtypes(vm.major);
            }
        },
        computed:{
            restore(){
                return this.$store.state.restore;
            }
        },
        watch:{
            major(){
                let vm = this;
                vm.value = [];
                mui.ajax({
                    url:vm.$store.state.serverIp + "/task/pbtypes/?token="+vm.$store.state.sessionid,
                    data:{
                        major:vm.major,
                    },
                    success(res){
                        vm.pbs = res.results;
                        res.results.forEach(t=>{
                        let obj = {
                            value:t.name,
                            id:t.id,
                            check:false,
                        }
                            vm.value.push(obj);
                        })
                    }
                })
            },
            restore(val){
                this.value.forEach(val=>{
                    val.check = false;
                })
            },
            changecheck(val){
                this.checkall = false;
            }
        }
    }
</script>