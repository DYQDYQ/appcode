<style scoped lang="less">
    @import "../../less/plan/filterpage.less";
</style>
<style type="text/css">
    .goujian input{
        font-size: 17px !important;
    }
    .goujian{
        margin-bottom: 5px !important;
    }
    .planlinetime .weui-cell__ft{
        text-align: left !important;
    }
    .planlinequetion .weui-cell{
        padding: 10px 15px 10px 0px !important;
        margin-top: -7px !important;
    }
    .planlinetime .weui-cell{
        padding: 10px 15px 10px 0px !important;
        margin-top: -10px !important;
    }
</style>
<template>
    <div class="filtermain">
        <Form class="form" :label-width="80" ref="forms">
            <FormItem label="构件编号" class="goujian">
                <Input v-model="membervalue" placeholder="构件编号"></Input>
            </FormItem>
            <FormItem label="选择空间" class="goujian">
                    <popup-picker class="planlinequetion" :data="spacedata" v-model="space" :columns="3" placeholder="请选择空间" @on-shadow-change="shadowit" :displayFormat="chosespace"></popup-picker>
            </FormItem>
            <FormItem label="选择状态" class="goujian">
                    <popup-picker class="planlinequetion" :data="statedata" v-model="state" :columns="3" placeholder="请选择状态" :displayFormat="chosestate"></popup-picker>
            </FormItem>
            <FormItem label="时间段" class="goujian">
                <div class="filtertime planlinetime">
                    <datetime v-model="formltem.begin" placeholder="请选择时间" format="YYYY/MM/DD" :start-date="startDate"></datetime>
                </div>
                <div class="centerline">至</div>
                <div class="filtertime planlinetime">
                   <datetime v-model="formltem.begin1" style="width: 100%" placeholder="请选择时间" format="YYYY/MM/DD" :start-date="startDate"></datetime> 
                </div>
                
            </FormItem>
        </Form>
        <div class="bottomlist">
                <Button type="text" @click="cancelit">重置</Button>
                <Button type="error" @click="submitit">确定</Button>
        </div>
    </div>
</template>
<script>
    import { Datetime,PopupPicker,Group } from 'vux';
    export default{
        components:{
            Datetime,
            PopupPicker,
            Group
        },
        data(){
            return{
                membervalue:'',
                spacedata:[],
                statedata:[],
                selsectid:[],
                stateid:[],
                startDate:(time=>{
                    return time.format('yyyy-MM-dd');
                })(new Date),
                space:[],
                state:[],
                formltem:{
                    begin:null,
                    begin1:null,
                },
            }
        },
        mounted(){
            var vm = this;
            mui.ajax({
                url:`${vm.$store.state.serverIp}/user/majors/?page=1&perPage=9999&token=`+vm.$store.state.sessionid,
                type: "get",
                success(res){
                    res.results.forEach((val,index)=>{
                        let obj = {
                            value:`${val.id}${val.name}`,
                            name: val.name,
                            parent:0,
                        }
                        vm.statedata.push(obj);
                        vm.loadspacedatafirst([val.id],`${val.id}${val.name}`);
                    });
                }
            });
            mui.ajax({
                url:`${vm.$store.state.serverIp}/task/unitprojects/?page=1&perPage=9999&token=`+vm.$store.state.sessionid,
                type: "get",
                success(res){
                    res.results.forEach((val,index)=>{
                        let obj = {
                            value: `${val.id}`,
                            name :val.name,
                            parent:0,
                        }
                        vm.spacedata.push(obj);
                    });
                    vm.loadspacedata([vm.spacedata[0].value]);
                }
            });
            

        },
        methods:{
            timein(time,time1) {
                let times = [];
                if(time != "" && time1 != "") {
                    times.push(time);
                    times.push(time1);
                }
                return times;
            },
            submitit(){
                let vm = this;
                let time = '';
                let time1 = '';
                if(this.formltem.begin == "" && this.formltem.begin1 == ""){

                }else if(this.formltem.begin !== "" && this.formltem.begin1 !== "") {
                    time = this.formltem.begin;
                    time1 = this.formltem.begin1;
                }else{
                    vm.$Message.error("请选择完整创建时间段");
                    return;
                };
                this.changestate();
                let obj = {
                    time,
                    time1,
                    membervalue:vm.membervalue,
                    space:vm.space,
                    state:vm.state,
                };
                vm.$store.commit('getquiltylist',JSON.stringify(obj));
            },
            cancelit(){
                this.membervalue = '',
                this.space = [],
                this.state = [],
                this.formltem.begin = null;
                 this.formltem.begin1 = null;
            },
            loadspacedata(item){
                let vm = this;
                mui.ajax({
                    url:`${vm.$store.state.serverIp}/task/elevations/?page=1&perPage=9999&unitproject=${item[0]}&token=`+vm.$store.state.sessionid,
                    type: "get",
                    success(res){
                        res.results.forEach((val,index)=>{
                            let obj = {
                                value: `${val.id}`,
                                name :val.name,
                                parent:item[0],
                            }
                            vm.spacedata.push(obj);
                        });

                    }
                });
            },
            loadspacedatafirst(item,par){
                    let vm = this;
                    mui.ajax({
                        url: `${vm.$store.state.serverIp}/task/pbtypes/?page=1&perPage=9999&major=${item[0]}&token=`+vm.$store.state.sessionid,
                        type: 'get',
                        success(res){
                            res.results.forEach((val,index)=>{
                                let obj = {
                                    value: `${val.id}${val.name}`,
                                    name :val.name,
                                    parent: par
                                }
                                vm.statedata.push(obj);
                                vm.chosefirst(`${val.id}`,`${val.id}${val.name}`);
                            });

                        }
                    })
            },
            chosefirst(v,b){
                let vm = this;
                mui.ajax({
                    url: `${vm.$store.state.serverIp}/task/pbstatuss/?page=1&perPage=9999&pbtype=${v}&token=`+vm.$store.state.sessionid,
                    type: 'get',
                    success(res){
                        res.results.forEach((val,index)=>{
                            let obj = {
                                value: `${val.id}`,
                                name :val.statusname,
                                parent: b
                            }
                            vm.statedata.push(obj);
                        });
                        console.log(vm.statedata)
                    }
                }) 
            },
            chosespace(a,b){

                    return b;
                
                
            },
            chosestate(a,b){
                return b;
            },
            shadowit(id,name){
                if(this.selsectid.indexOf(id[0]) < 0){
                    this.selsectid.push(id[0]);
                    this.loadspacedata(id);
                }
            },
            changestate(){
                let arr = [];
                this.state.forEach((val,iddex)=>{
                    console.log(val);
                    arr.push(val.match(/[0-9]+/g)[0]);
                });
                this.state = arr;
            }
        }
    }
</script>