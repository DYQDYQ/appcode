<style lang="less" rel="stylesheet/less" scoped>
    @import "../../less/all/shitu.less";
</style>
<style type="text/css">
    .checkbac{
        background-color:#d44c4c;
        color: #fff;
    }
</style>
<template>
    <div style="width: 100%;height: 100%;position: relative;background-color: #f5f5f5">
        <div class="bacmain" v-if="parentids.length > 1" @click="bacmain">
            <Icon type="arrow-return-left"></Icon>
            返回
        </div>
        <div v-for="(item,index) in levels" class="floor" style="background-color: #fff">
            <div class="tonext" @click="tonext(item,index)" :class="{'checkbac':checkbac == index}">
                <Icon type="ios-folder" v-if="item.datatype == 'category'"></Icon>
                <Icon type="eye" v-if="item.datatype == 'viewpoint'"></Icon>
                <span>{{item.name}}</span>
            </div>
        </div>
         <div v-if="levels.length == 0" style="font-size: 14px;text-align: center">暂无视点哟！</div>
        <Spin fix v-if="loading"></Spin>
        
    </div>
</template>
<script>
    import BScroll from 'better-scroll';
    export default{
        components:{
        },
        data(){
            return{
                levels:[],
                parentids:[],
                level:1,
                loading:false,
                checkbac:null
            }
        },
        methods:{
            bacmain(){
                let vm = this;
                vm.checkbac = null;
                vm.loading = true;
                this.parentids.pop();
                vm.levels = [];
                let id = this.parentids[this.parentids.length - 1];
                let url = '';
                if(id == 'null'){
                    url = `${vm.$store.state.serverIp}/task/modelview/getviewerpoint/?belongmodel=${vm.$store.state.belongmodel}&token=${vm.$store.state.sessionid}`;
                }else{
                    url = `${vm.$store.state.serverIp}/task/modelview/getviewerpoint/?belongmodel=${vm.$store.state.belongmodel}&category=${id}&token=${vm.$store.state.sessionid}`;
                }
                mui.ajax({
                    url:url+'&token='+vm.$store.state.sessionid,
                    type:"GET",
                    success(res){
                        res.results.forEach(v=>{
                            if(v.datatype !== 'category'){
                                v.check = false;
                            }
                        });
                        vm.levels = res.results;
                        vm.loading = false;
                    }
                })


            },
            tonext(val,i){
                let vm = this;
                if(val.datatype == 'category') {
                    mui.ajax({
                        url:`${vm.$store.state.serverIp}/task/modelview/getviewerpoint/?belongmodel=${vm.$store.state.belongmodel}&category=${val.id}&token=${vm.$store.state.sessionid}`,
                        type:'GET',
                        success(res){
                            res.results.forEach(v=>{
                                if(v.datatype !== 'category'){
                                    v.check = false;
                                }
                            });
                            vm.levels = res.results;
                            vm.parentids.push(val.id);
                        }

                    });
                }else{
                    vm.checkbac = i;
                    _viewer.restoreState(JSON.parse(val.viewpoint));
                }
            },
            checklists(val,i){
                this.levels.forEach((v,index)=>{
                    if(i != index){
                         v.check = false;
                    }
                   
                });
                val.check = !val.check;
            },
            addpath(){

            }
        },
        mounted(){
            let vm = this;
            vm.loading = true;
            mui.ajax({
                url:`${vm.$store.state.serverIp}/task/modelview/getviewerpoint/?belongmodel=${vm.$store.state.belongmodel}&token=${vm.$store.state.sessionid}`,
                type:'GET',
                success(res){
                    vm.levels = res.results;
                    vm.parentids.push('null');
                    vm.loading = false;
                }

            });
        }
    }
</script>