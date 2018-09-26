<style scoped lang="less" rel="stylesheet/less">
    @import '../../less/plan/constructionProgress.less';
    @import "../../less/all/animat.less";
</style>
<template>
    <div class="mains">
        <!-- <div class="mask" v-if="showMask" @click="showMask=false"></div> -->
        <div class="toolBars">
            <a class="topiconleft" @click="showbac" v-if="active != ''"><Icon type="chevron-left"></Icon></a>
            <label @click="showadd('plan')" :class="{active:active=='plan'}"><Icon type="clipboard"></Icon></label>
            <label @click="showadd('list')" :class="{active:active=='list'}"><Icon type="ios-list-outline"></Icon></label>
            <label @click="showadd('add')" :class="{active:active=='add'}"><Icon type="android-add"></Icon></label>
            <span class="titlehead">{{title}}</span>
        </div>
        
        <transition name="process">
            <div class="pro" v-if="showPro">
                <process :project="project"></process>
            </div>
        </transition>
        <!-- 施工计划 -->
        <transition name="maindrawer">
            <constructplan class="maindrawer" v-if="active=='plan'"></constructplan>
        </transition>
        <!-- 进度录入 -->
        <transition name="adddrawer">
            <constructrecord class="adddrawer" v-show="active=='add'"></constructrecord>
        </transition>
        <transition name="maindrawer">
            <constructlist class="maindrawer" v-if="active=='list'"></constructlist>
        </transition>

    </div>
</template>
<script>
    import process from '../all/process.vue';
    import constructplan from './constructionPlan.vue';
    import constructrecord from './constructionRecord.vue';
    import constructlist from './overflow.vue';
    export default {
        components:{
            process,
            constructplan,
            constructrecord,
            constructlist,
        },
        data(){
            return {
                active:'',
                showPro:false,
                project:[],
                title:"施工进度",
            };
        },
        methods:{
            showadd(val){
                if(this.active == val) {
                    this.active = "";
                }else{
                    this.active = val;
                }
                if(this.active == 'list') {
                    if(this.$store.state.baclevel){
                        this.$store.commit('setbaclevel',false);
                    }
                }
                if(val == 'add'){
                    if(this.active == val){
                        
                        this.$store.commit('setchangestate',true);
                    }else{
                        //关掉框选
                        this.$store.commit('openselect',false);
                        _viewer.unloadExtension('Viewing.Extension.SelectionWindow');
                        //关掉框选
                        console.log('关掉框选');
                        this.$store.commit('setchangestate',false);
                    }
                    
                }
            },
            showbac(){
                if(this.$store.state.baclevel){
                    this.$store.commit('setbaclevel',false);
                }else{
                    if(this.active == 'add'){
                        //关掉框选
                        this.$store.commit('openselect',false);
                        _viewer.unloadExtension('Viewing.Extension.SelectionWindow');
                        //关掉框选
                        console.log('关掉框选');
                    }
                    this.active = "";
                }
            }
        },
        computed:{
            planaddstate(){
                return this.$store.state.planadd;
            },
            showhead(){
                return this.$store.state.showhead;
            },
            openadd(){
                return this.$store.state.openadd;
            }
        },
        mounted(){
            let vm = this;
            vm.$nextTick(function(){
                vm.active = "plan";
                $(".toolBars").on("click","label",function(){
                    vm.$store.commit("setshowfooter");
                })
            })
        },
        watch:{
            showhead(){
                this.active = '';
            },
            planaddstate(){
                this.active = '';
            },
            openadd(val){
                if(val == 2){
                    this.active = 'add';
                }else if(val == 3){
                    this.active = '';
                    //关掉框选
                    vm.$store.commit('openselect',false);
                    _viewer.unloadExtension('Viewing.Extension.SelectionWindow');
                    //关掉框选
                    console.log('关掉框选');
                }
                this.$store.commit("setopenadd",1);
            }
        }
    };
</script>