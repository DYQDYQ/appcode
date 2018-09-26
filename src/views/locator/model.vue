<style scoped lang="less">
    @import url("../../less/all/locator.less");
</style>
<template>
    <div style="width: 100%;">
        <div class="floor floorchild" v-for="(item,index) in project" @click="checkit(item,index)">
            <div class="checkstatechild">
                <span class="namewidth">{{item.value}}</span>
                <span class="yesicon" v-show="index == checknumber"></span>
            </div>
        </div>
        <Spin fix v-if="loading"></Spin>
    </div>
     
</template>

<script>
    import { Radio, Group } from 'vux';
    export default {
        components: {
            Radio,
            Group
        },
        data(){
            return {
                project:[],
                value:'',
                checknumber:'',
                loading:false
            }
        },
        methods: {
            checkit(val,label){
                this.checknumber = label;
                this.value = val.key;
                 $(".jindu").css('display','flex');
                this.$store.commit("setbelongmodel",val.id);
                localStorage.belongmodel = val.id;
                localStorage.modelvalue = val.key;
                this.$store.commit("setunitprojectid",val.key.split(',')[0]);
                this.$store.commit('setnowfloor','');
                console.log(val);

            }
        },
        mounted(){
            let vm = this;
            vm.loading = true;
            $.ajax({
                url:vm.$store.state.serverIp + "/task/modelfiles/?token="+vm.$store.state.sessionid,
                success(res){
                    let a = res.results;
                    a.forEach((val,index)=>{
                            let obj = {
                                value:val.unitprojectname+'-'+val.majorname,
                                key:val.relatedunitprojectid+','+val.relatedmajorid,
                                id:val.id,
                            }
                           if(localStorage.belongmodel) {
                                if(localStorage.belongmodel == val.id){
                                    vm.checknumber = index;
                                    vm.$store.commit("setbelongmodel",val.id);
                                    vm.$store.commit("setunitprojectid",val.relatedunitprojectid);
                                }
                           }
                           if(!localStorage.belongmodel || localStorage.belongmodel == ''){
                                    if(val.isdefault){
                                       vm.checknumber = index;
                                       vm.$store.commit("setbelongmodel",val.id);
                                       vm.$store.commit("setunitprojectid",val.relatedunitprojectid);
                                    }
                           }
                           vm.project.push(obj);
                    })
                    vm.loading = false;
                    console.log(vm.checknumber);
                }
            })
        },
        watch:{
            value(value){
                    this.$emit('input',value);
                    [_curUnitId,_curMajor] = value.split(',');
                    localStorage.nowmodel = JSON.stringify(value.split(','));

                    getModelFile();
            }
        }
    }
</script>