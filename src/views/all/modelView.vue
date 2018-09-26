<style scoped lang="less">
    @import "../../less/all/modelView.less";
    @import "../../less/all/animat.less";
</style>
<template>
    <div class="mains">
        <div class="toolBars">
            <a class="topiconleft" @click="showbac" v-if="active != ''"><Icon type="chevron-left"></Icon></a>
            <label @click="showit" :class="{active:active=='it'}"><Icon type="ios-calendar-outline"></Icon></label>
            <label @click="showChart" :class="{active:active=='chart'}"><Icon type="stats-bars"></Icon></Icon></label>
            <span class="titlehead">{{title}}</span>
            
        </div>
        <transition name="maindrawer">
            <calenders class="maindrawer" v-if="showcalender"></calenders>
        </transition>
        <transition name="maindrawer">
            <newchart class="maindrawer" v-if="showchart">
            </newchart>
                
        </transition>
    </div>
</template>
<script>
    import $ from 'jquery';
    import newchart from '../all/newchart.vue';
    import building from '../building.vue';
    import calenders from '../all/event.vue';
    export default {
        components:{
            building,
            calenders,
            newchart
        },
        data(){
            return {
                fakeData:[
                    {value:335, name:'混凝土结构'},
                    {value:310, name:'钢结构'},
                    {value:234, name:'二结构'},
                    {value:135, name:'机电结构'},
                    {value:1548, name:'电梯'}
                ],
                build:[],
                selected:'',
                showcalender:false,
                title:'模型预览',
                showchart:false,
                active:'',
            }
        },
        methods:{
            setColor(index){
                return `background-color:${["#E89533","#265365","#98E5DF","#17A85A","#a0C440"][index%6]}`
            },
            showit(){
                this.showchart = false;
                 this.showcalender = !this.showcalender;
                 if(this.active == "it"){
                    this.active = "";
                }else{
                   this.active = "it"; 
                }
            },
            showChart(){
                this.showcalender = false;
                this.showchart = !this.showchart;
                if(this.active == "chart"){
                    this.active = "";
                }else{
                   this.active = "chart"; 
                }
                
            },
            showbac(){
                this.active = "";
                this.showcalender = false;
                this.showchart = false;
            }
        },
        mounted(){
            let vm = this;
            mui.ajax({
                url: `${vm.$store.state.serverIp}/task/modelfiles/?token=`+vm.$store.state.sessionid,
                data: {
                    perPage: 9999999
                },
                crossDomain: true,
                success(res) {
                    let results = res.results;
                    results.forEach(t => {
                        vm.build.push({
                            name: t.majorname,
                            id: t.relatedunitprojectid + '.' + t.relatedmajorid,
                        })
                    });
                },
                error(){
                }
            });
            this.$nextTick(function(){
                $(".toolBars").on("click","label",function(){
                    vm.$store.commit("setshowfooter");
                });
            })
        },
        computed:{
            showhead(){
                return this.$store.state.showhead;
            }
        },
        watch:{
            selected(now){
                let b = now.split('.');
                _curMajor = b[1];
                _curUnitId = b[0];
                getModelFile();
            },
            showhead(){
                this.active = "";
                this.showcalender = false;
                this.showchart = false;
            }
        }
    }

</script>