<style scoped lang="less">
    @import "../../less/safety/main.less";
    @import "../../less/all/animat.less";
</style>
<template>
    <div class="mains" style="margin: 0;">
        <div class="toolBars">
            <a class="topiconleft" @click="bacbutton" v-if="show != ''"><Icon type="chevron-left"></Icon></a>
            <label @click="showit('showchart')" :class="{active:active=='showchart'}"><Icon type="stats-bars"></Icon></label>
            <label @click="showit('showlist')" :class="{active:active=='showlist'}"><Icon type="ios-list-outline"></Icon></label>
            <label @click="showit('addlist')" :class="{active:active=='addlist'}"><Icon type="plus"></Icon></label>

            <span class="titlehead">{{title}}</span>
            
        </div>
        <!-- 整改单列表 -->
        <transition name="maindrawer">
            <dealoverview class="maindrawer" v-if="show == 'showlist'"></dealoverview>
        </transition>
        <!-- 添加质量整改单 -->
        <transition name="adddrawer">
            <addpage class="adddrawer" style="z-index: 1000" v-if="show == 'addlist'"></addpage>
        </transition>
        <!-- 整改单数据图表示 -->
        <transition name="maindrawer">
            <chartview class="maindrawer" v-if="show == 'showchart'"></chartview>
        </transition>

    </div>
    
</template>
<script>
    import checkpage from './check.vue';
    import dealoverview from './overview.vue';
    import addpage from './add.vue';
    import chartview from './chartview.vue';
    import filterpage from './filterpage.vue';
    import $ from 'jquery';
    export default {
        components:{
            checkpage,
            dealoverview,
            addpage,
            chartview,
            filterpage
        },
        data(){
            return {
                showDrawer:false,
                active:'',
                data:{
                    building:[],
                    floor:[],

                    major:null,
                    structure:[]
                },
                radioActive:false,
                radioOne:null,
                radioTwo:[],
                structureValue:[],
                qualityIssue:[],
                bool:false,
                safetyIssue:[
                    {
                        name: '七框1区地下混凝土质量验收',
                        state:0,
                        id:1
                    },
                    {
                        name: '八框1区地下混凝土质量验收',
                        state:0,
                        id:2
                    },
                    {
                        name: '八框2区地下混凝土质量验收',
                        state:0,
                        id:4
                    },
                    {
                        name: '九框4区地下混凝土质量验收',
                        state:0,
                        id:3
                    },
                ],
                plus:false,
                temp:null,
                loaded:false,
                title:"安全总览",
                show:"",
                
            };
        },
        methods:{
            changeToNumber(type){
                switch (type){
                    case "未处理":return 0 ;break;
                    case "处理中":return 1 ;break;
                }
            },
            change(id){
                this.$router.push(`/main/quality/check/${id}`);
            },
            focus(item){
                if(item.id===this.temp){
                    this.plus = false;
                    this.temp = null;
                } else {
                    this.plus = true;
                    this.temp = item.id;
                }
                _viewer.isolateById([23482,23424,23443]);
            },
            typeChange(type){
                if(this.active===type){
                    this.active = '';
                    this.showDrawer = false;
                } else {
                    this.active = type;
                    this.showDrawer = true;
                    if(type==="structure"){
                        this.radioActive = false;
                        if(this.radioOne!==this.data.major){
                            this.data.structure=[];
                            this.data.major = this.radioOne;
                            let vm = this;
                            $.ajax({
                                url:`${vm.$store.state.serverIp}/task/pbtypes?token=`+vm.$store.state.sessionid,
                                data:{
                                    majorId:parseInt(vm.data.major)
                                },
                                success(res){
                                    let results = res.results;
                                    results.forEach(t=>{
                                        t.value = true;
                                        vm.structureValue.push(t.id + t.name)///todo
                                    });
                                    vm.data.structure = results;
                                },

                            })
                        }
                    }
                }
            },
            radioChange(bool,payload){
                let vm = this;
                let a = function(){
                    if(payload&&payload.children.length===0){
                        mui.ajax({
                            url:`${vm.$store.state.serverIp}/task/elevations/?token=`+vm.$store.state.sessionid,
                            data:{
                                unitproject:parseInt(payload.id),
                                perPage:1e5
                            },
                            success(res){
                                payload.children=res.results;
                                payload.children.forEach(t=>{
                                    t.value=true;
                                });
                                vm.data.floor = payload.children;
                                payload.children.forEach(t=>{
                                    t.value===true&&vm.radioTwo.push(t.id);
                                });
                                vm.bool = true;
                            },
                            error(){
                                if(vm.$store.state.environment==='dev'){
                                    let res = {
                                        "count": 12,
                                        "next": null,
                                        "previous": null,
                                        "results": [
                                            {
                                                "url": "http://localhost:8000/task/elevations/256/",
                                                "id": 256,
                                                "name": "S-B3F",
                                                "level": -17400.0,
                                                "sign": "B3",
                                                "unitproject": "http://localhost:8000/task/unitprojects/10/"
                                            },
                                            {
                                                "url": "http://localhost:8000/task/elevations/257/",
                                                "id": 257,
                                                "name": "S-B2F",
                                                "level": -12100.0,
                                                "sign": "B2",
                                                "unitproject": "http://localhost:8000/task/unitprojects/10/"
                                            },
                                            {
                                                "url": "http://localhost:8000/task/elevations/258/",
                                                "id": 258,
                                                "name": "S-B1F",
                                                "level": -6500.0,
                                                "sign": "B1",
                                                "unitproject": "http://localhost:8000/task/unitprojects/10/"
                                            },
                                            {
                                                "url": "http://localhost:8000/task/elevations/259/",
                                                "id": 259,
                                                "name": "S-1F",
                                                "level": -100.0,
                                                "sign": "01",
                                                "unitproject": "http://localhost:8000/task/unitprojects/10/"
                                            },
                                            {
                                                "url": "http://localhost:8000/task/elevations/260/",
                                                "id": 260,
                                                "name": "S-2F",
                                                "level": 5900.0,
                                                "sign": "02",
                                                "unitproject": "http://localhost:8000/task/unitprojects/10/"
                                            },
                                            {
                                                "url": "http://localhost:8000/task/elevations/261/",
                                                "id": 261,
                                                "name": "S-3F",
                                                "level": 11900.0,
                                                "sign": "03",
                                                "unitproject": "http://localhost:8000/task/unitprojects/10/"
                                            },
                                            {
                                                "url": "http://localhost:8000/task/elevations/262/",
                                                "id": 262,
                                                "name": "S-4F",
                                                "level": 17900.0,
                                                "sign": "04",
                                                "unitproject": "http://localhost:8000/task/unitprojects/10/"
                                            },
                                            {
                                                "url": "http://localhost:8000/task/elevations/263/",
                                                "id": 263,
                                                "name": "S-5F",
                                                "level": 22400.0,
                                                "sign": "05",
                                                "unitproject": "http://localhost:8000/task/unitprojects/10/"
                                            },
                                            {
                                                "url": "http://localhost:8000/task/elevations/264/",
                                                "id": 264,
                                                "name": "S-6F",
                                                "level": 26900.0,
                                                "sign": "06",
                                                "unitproject": "http://localhost:8000/task/unitprojects/10/"
                                            },
                                            {
                                                "url": "http://localhost:8000/task/elevations/265/",
                                                "id": 265,
                                                "name": "S-7F",
                                                "level": 31400.0,
                                                "sign": "07",
                                                "unitproject": "http://localhost:8000/task/unitprojects/10/"
                                            },
                                            {
                                                "url": "http://localhost:8000/task/elevations/266/",
                                                "id": 266,
                                                "name": "S-8F",
                                                "level": 37400.0,
                                                "sign": "08",
                                                "unitproject": "http://localhost:8000/task/unitprojects/10/"
                                            },
                                            {
                                                "url": "http://localhost:8000/task/elevations/267/",
                                                "id": 267,
                                                "name": "S-9F",
                                                "level": 46400.0,
                                                "sign": "09",
                                                "unitproject": "http://localhost:8000/task/unitprojects/10/"
                                            }
                                        ]
                                    };
                                    payload.children=res.results;
                                    payload.children.forEach(t=>{
                                        t.value=true;
                                    });
                                    vm.data.floor = payload.children;
                                    payload.children.forEach(t=>{
                                        t.value===true&&vm.radioTwo.push(t.id);
                                    })
                                }
                            }
                        })
                    } else if(payload&&payload.children){
                        vm.data.floor = payload.children;
                        payload.children.forEach(t=>{
                            t.value===true&&vm.radioTwo.push(t.id);
                        });
                        vm.bool = true;
                    }
                };
                vm.bool = false;
                vm.radioTwo=[];
                this.radioActive = bool;
                a();
                if(bool){
                    const b = payload.id.split('.');
                    if(_curMajor != b[1]||_curUnitId != b[0]){
                        _curMajor = b[1];
                        _curUnitId = b[0];
                        getModelFile();
                    }
                }
            },
            handle(item){
                this.$router.push("/main/issue/quality/"+item.issueId)
            },
            bacbutton(){
                if(this.showlevel){
                    this.$store.commit('setbaclevel',false);
                }else{
                    this.show = null;
                }
            },
            showit(val){
                this.$store.commit('setbaclevel',false);
                if(this.show == val) {
                    this.show = null;
                    this.active = null;
                }else{
                    this.show = val;
                    this.active = val;
                }

            }
        },
        mounted(){
            let vm = this;
            vm.$nextTick(function(){
                vm.active = "showchart";
                vm.show = "showchart";
                $(".toolBars").on("click","label",function(){
                    vm.$store.commit("setshowfooter");
                })
            })
        },
        computed:{
            showlevel(){
                return this.$store.state.baclevel;
            },
            isquiltybac(){
                return this.$store.state.quiltybac;
            },
            qrwhat(){
                return this.$store.state.QRstates;
            },
            showhead(){
                return this.$store.state.showhead;
            },
            openadd(){
                return this.$store.state.openadd;
            }
        },
        watch:{
            radioTwo(now,before){
                if(!((now.length===before.length)||before.length===0)&&this.bool){
                    _selElevations = now.toString();
                    filterPblist();
                }
            },
            structureValue(now,before){
                if(!((now.length===before.length)||before.length===0)){
                    let a = [];
                    now.forEach(t=>{
                        a.push(parseInt(t));
                    });
                    _selPbtypes = a.toString();
                    filterPblist();
                }
            },
            isquiltybac(old,newvalue){
                    this.show = null;
                
            },
            qrwhat(){
                this.show = 'addlist';
                localStorage.QRwhat = null;
            },
            showhead(){
                this.show = '';
                this.active = '';
            },
            openadd(val){
                if(val == 2){
                    this.show = 'addlist';
                    this.active = 'addlist';
                }else if(val == 3){
                    this.show = '';
                    this.active = '';
                }
                this.$store.commit("setopenadd",1);
            }
        }
    };
</script>