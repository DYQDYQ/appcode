<style scoped>
    .ivu-row{

    }
    li{
        line-height: 35px;
        border-bottom: 1px solid #DDDEE0;
        font-size: 16px;
        padding-left: 24px;
        transition: all 0.5s;
    }
    li:first-child{
        border-top : 1px solid #DDDEE0;
    }
    li.active{
        background-color: lightgoldenrodyellow;
    }
</style>

<template>
    <Row class="" style="background-color: white;width: 100%;height: 100%">
        <i-col :span="12" style="height: 100%;padding: 0 8px">
            <label style="line-height: 37px;font-size: 16px;padding-left: 24px" @click="clear">/ <a>{{unitname?unitname+'  /':''}}</a> </label>
            <ul style="max-height: 100%;overflow-y: auto;overflow-x: hidden;text-overflow: ellipsis">
                <template v-if="total.unit">
                    <li v-for="i,index in floor" @click="changeFloor(i.id,index)" :class="{active:active===index}">
                        {{i.name}}
                    </li>
                </template>
                <template v-else>
                    <li v-for="i,index in unit" @click="changeUnit(i,index)">
                        {{i.name}}
                    </li>
                </template>
            </ul>
        </i-col>
        <i-col :span="12" style="height: 100%;padding: 0 8px">
            <Tabs v-model="major" @on-click="changeData" ref="content" style="height: 100%;">
                <TabPane label="空间" name="room" style="height: calc(100% - 37px);overflow: auto" v-if="type">
                    <CheckboxGroup v-model="total.pb" style="width: 100%;height: 100%">
                        <ul style="height: 585px;overflow-y: auto;">
                            <li v-for="i in room" :key="(i.id).toString()">
                                <Checkbox :label="i.id + 'a'">{{i.name}}</Checkbox >
                            </li>
                        </ul>
                    </CheckboxGroup>
                </TabPane>
                <TabPane :label="item.name" :name="(item.id).toString()" v-for="item in majorData" :key="item.name" :disabled="unselected" style="height: calc(100% - 37px);overflow: auto">
                    <Spin v-if="loading" :fix="true"></Spin>
                    <i-Input v-model="keyword" icon="ios-search" placeholder="开始搜索" @on-change.lazy="handelSearch"></i-Input>
                    <CheckboxGroup v-model="total.pb" style="width: 100%;height: calc(100% - 50px)">
                        <ul style="height: 585px;overflow-y: auto;">
                            <li v-for="i in data" :key="(i.id).toString()" v-show="i.show">
                                <Checkbox :label="(i.id).toString()"> {{i.drawnumber}}</Checkbox >
                            </li>
                        </ul>
                    </CheckboxGroup>
                </TabPane>
            </Tabs>
        </i-col>
    </Row>
</template>

<script>
    export default {
        props:{
            type:{
                type:Boolean,
            }
        },
        data(){
            return {
                data:[],
                major:'room',
                unselected:true,
                majorData:[],
                floor:[],
                active:Infinity,
                keyword:null,
                loading:false,
                unit:[],
                unitname:undefined,
                room:[],
                total:{
                    unit:null,
                    major:null,
                    floor:null,
                    pb:[]
                }
            }
        },
        methods:{
            /**
             *   返回选择的值
             * @returns {Object}
             */
            getValue(){
                let vm = this;
                let a = vm.$refs.content.$children;
                let c =null;
                for(let i =0;i<a.length;i++){
                    if(a[i].currentName===vm.major){c=a[i]}
                }
                let b =[];
                let e = c.$children[1].$children;
                for(let i =0;i<e.length;i++){
                    if(e[i].currentValue){b.push(e[i].$slots.default[0].text)}
                }
                return {total:vm.total,label:b};
            },
            changeUnit(i){
                this.total.unit = i.id;
                this.unitname = i.name;
                this.room = JSON.parse(JSON.stringify(this.floor));
            },
            changeFloor(i,index){
                let vm = this;
                vm.active = index;
                vm.unselected = false;
                vm.total.floor = i;
                vm.loading = true;
                vm.keyword = '';
                mui.ajax({
                    url:vm.$store.state.serverIp + "/task/precastbeam/?token="+vm.$store.state.sessionid,
                    data:{
                        pbtype__major:vm.major,
                        elevation:i
                    },
                    success(t){
                        vm.data = [];
                        vm.total.pb = [];
                        t.results.forEach(t=>{
                            t.show=true;
                        });
                        vm.data=t.results;
                        vm.getRoom();
                        vm.loading = false;
                    }
                })
            },
            handelSearch(){
                let a = this.data;
                const search = this.keyword.toUpperCase().trim();
                if(search.length===0){
                    a.forEach(t=>{
                        t.show = true;
                    })
                } else {
                    a.forEach(t=>{
                        t.show = !(t.drawnumber.indexOf(search)===-1);
                    })
                }
            },
            getRoom(value){
                let vm = this;
                if(vm.total.unit){
                    vm.room = JSON.parse(JSON.stringify(vm.floor));
                } else {
                    vm.room = JSON.parse(JSON.stringify(vm.unit));
                }
            },
            changeData(value){
                let vm = this;
                vm.loading = true;
                if(value ==='room'){
                    vm.getRoom(value);
                    return;
                }
                mui.ajax({
                    url:vm.$store.state.serverIp + "/task/precastbeam/?token="+vm.$store.state.sessionid,
                    data:{
                        pbtype__major:value,
                        elevation:vm.total.floor
                    },
                    success(t){
                        vm.data = [];
                        vm.total.pb = [];
                        t.results.forEach(t=>{
                            t.drawnumber = t.drawnumber.toUpperCase();
                            t.show=true;
                        });
                        vm.data=t.results;
                        vm.loading = false;
                    }
                })
            },
            clear(){
                let vm = this;
                vm.total.unit='';
                vm.active=Infinity;
                vm.unselected=true;
                vm.total.pb = [];
                vm.data = [];
                vm.unitname = null;
            }
        },
        mounted(){
            let vm = this;
            const base = vm.$store.state.serverIp;
            mui.ajax( base +'/user/majors/',{
                success(res){
                    const a = res.results;
                    vm.majorData = a;
                    if(!vm.type)vm.major = (a[0].id).toString();
                }
            });
            mui.ajax(base + "/task/elevations/",{
                success(res){ vm.floor = res.results;}
            });
            mui.ajax(base + "/task/unitprojects/",{success(res) {vm.unit = res.results;vm.room = JSON.parse(JSON.stringify(res.results))}})
        },
        watch:{
            major(value){
                this.total.major = value
            }
        }
    }
</script>