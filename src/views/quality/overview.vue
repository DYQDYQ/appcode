<style scoped lang="less">
    @import "../../less/all/animat.less";
    @import "../../less/quality/overflow.less";
</style>
<template>
    <div class="main">
        <div class="qboxhead">
            <a class="topicon1 filter" @click="showfilter = !showfilter" :class="{'chosefilter' : showfilter}"><Icon type="android-funnel"></Icon></a>
            <Input v-model="searchlist" placeholder="搜索..." class="topiconleft searchbox" icon="ios-search" @on-click="searchButton"></Input>
        </div>
       <div class="table" v-for="item in listdata" :height="tableHeight" @click="checkit(item.issueId)">
           <div class="tableline">
                <div class="number">
                    <Icon type="record" :class="{'first':item.priority == 10,'secend':item.priority == 5,'three':item.priority == 1}"></Icon>
                    <span>{{item.number}}</span>
                </div>
                
                <div class="dis">{{item.describe}}</div>
                <div class="timeend">
                    <span><img src="../../img/yuqi.svg" class ="yuqi" v-if="item.unfinished"></span>
                    <span>{{item.deadline}}</span>
                </div>
           </div>
           <div class="tableline">

               <div>{{item.flowstep}}</div>
               <div>
                   <Icon type="ios-person"></Icon>
                   <span>{{item.faqiren}}</span>
               </div>
               <div>
                   <Icon type="ios-clock"></Icon>
                   <span>{{item.faqishijian}}</span>
               </div>
               <div class="dangqian">
                   <Icon type="connection-bars"></Icon>
                   <span>{{item.dangqianfuzeren}}</span>
               </div>
           </div>
       </div>
        <div class="qboxbottom">
            <Page :total="total" :current="current" @on-change="changePage" :page-size="10" style="display: inline-block;vertical-align: top;"></Page>
<!--             <Button type="primary" icon="plus-round" style="float: right" @click="add">添加整改单</Button> -->
        </div>

        <transition name="leveldrawer">
            <detailview class="leveldrawer" v-if="showdetail"></detailview>
        </transition>
        <!-- 筛选 -->
        <transition name="rightdrawer">
            <filterpage class="rightdrawer" v-show="showfilter"></filterpage>
        </transition>
        <Spin fix v-if="loading"></Spin>
    </div>
</template>
<script>
    import expandRow from './tableexpand.vue';
    import detailview from './detailview.vue';
    import filterpage from './filterpage.vue';
    export default {
        components:{
            detailview,
            filterpage
        },
        data(){
            return {
                total:0,
                current:1,
                loading:true,
                detailrow:null,
                showfilter:false,
                searchlist:"",
                tableHeight:document.body.clientHeight - 140,
                listdata:[],
                searchdata:{}
            }
        },
        methods:{
            changePage(page){
                this.loading = true;
                let vm = this;
                mui.ajax({
                    url:`${vm.$store.state.serverIp}/task/issue/list/?token=`+vm.$store.state.sessionid,
                    type:'post',
                    data:{
                        issuetype:'zhiliang',
                        page,
                        perPage:10,
                        filterval:vm.searchdata
                    },
                    success(res){
                        vm.total = res.total;
                        vm.listdata = res.issuelist;
                        vm.loading = false;
                    },
                    error(){

                    }
                })
            },
            add(){
                this.$router.push('/main/quality/add');
            },
            searchButton(){
                let vm = this;
                vm.loading = true;
                mui.ajax({
                    url:`${vm.$store.state.serverIp}/task/issue/list/?token=`+vm.$store.state.sessionid,
                    type:'post',
                    data:{
                        issuetype:'zhiliang',
                        page:1,
                        perPage:10,
                        filterval:JSON.stringify({
                            issuecategorys:[],
                            priority:[],
                            fuzefenbao:[],
                            createuser:[],
                            createtime:[],
                            deadline:[],
                            stepIds:[],
                            updatetime:[],
                            searchValue:vm.searchlist,
                        })
                        
                    },
                    success(res){
                        vm.listdata = res.issuelist;
                        vm.loading = false;
                    }

                })
            },
            checkit(id){
                this.$store.commit('setbaclevel',true);
                this.$store.commit('setissueId',id);
            }
        },
        mounted(){
            let vm = this;
            vm.$nextTick(function(){
               vm.tableHeight = document.body.clientHeight - 140;
               // $("td").style.height=vm.tableHeight/10 + "px";
               // $("td").height(60);
            });
            console.log($(".ivu-table-small td"));
            mui.ajax({
                url:`${vm.$store.state.serverIp}/task/issue/list/?token=`+vm.$store.state.sessionid,
                type:'post',
                data:{
                    issuetype:'zhiliang',
                    page:1,
                    perPage:10,
                    filterval:JSON.stringify({})
                },
                success(res){
                    vm.total = res.total;
                    vm.listdata = res.issuelist;
                    vm.loading = false;
                },
                error(){
                }
            })
        },
        computed:{
            showdetail(){
                return this.$store.state.baclevel;
            },
            getdata(){
                return this.$store.state.quiltylist;
            },
            issaibac(){
                return this.$store.state.saistate;
            },
        },
        watch:{
            getdata(val,old){
                let vm = this;
                if(val != null) {
                    vm.loading = true;
                    vm.searchdata = val;
                    mui.ajax({
                        url:`${vm.$store.state.serverIp}/task/issue/list/?token=`+vm.$store.state.sessionid,
                        data:{
                            issuetype:"zhiliang",
                            page:1,
                            perPage:10,
                            filterval:val,
                        },
                        type: "post",
                        success(res){
                            vm.listdata = res.issuelist;
                            vm.total = res.total;
                            vm.showfilter = false;
                            vm.loading =false;
                            vm.$store.commit('getquiltylist',null);
                        },
                        error(status,errorThrown){
                            console.log("我");
                            console.log(status);
                            console.log(errorThrown);
                        }
                    })
                }

            },
            issaibac(val,oldval){
                this.showfilter = false;
                
            }
        }
    }
</script>