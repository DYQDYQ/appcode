<style scoped lang="less">
    @import "../../less/all/animat.less";
    @import "../../less/quality/overflow.less";
</style>
<style type="text/css">
    .searchbox .ivu-input {
      height: 26px;
    }
</style>
<template>
    <div class="main">
        <div class="qboxhead">
            <a class="topicon1 filter" @click="showfilter = !showfilter" :class="{'chosefilter' : showfilter}"><Icon type="android-funnel"></Icon></a>
            <Input v-model="searchlist" placeholder="搜索..." class="topiconleft searchbox" icon="ios-search" @on-click="searchButton"></Input>
        </div>
        <div style="position: absolute;z-index: 10;top: 39px;left: 0px">
            <Table :columns="columns1" :data="listdata" size="large" ref="table" :loading="loading" :height="tableHeight"></Table>
        </div>
            
        <div class="qboxbottom">
            <Page :total="total" :current="current" @on-change="changePage" :page-size="10" style="display: inline-block;vertical-align: top;"></Page>
<!--             <Button type="primary" icon="plus-round" style="float: right" @click="add">添加整改单</Button> -->
        </div>
 
        <transition name="leveldrawer">
            <detailview :idstate = "idstate" class="leveldrawer" v-if="showdetail"></detailview>
        </transition>
        <!-- 筛选 -->
        <transition name="rightdrawer">
            <filterpage class="rightdrawer" v-show="showfilter"></filterpage>
        </transition>
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
                idstate:[],
                saixuandata:{
                    time:'',
                    time1:'',
                    membervalue:'',
                    space:[],
                    state:[],
                },
                searchlist:"",
                tableHeight:document.body.clientHeight - 147,
                columns1:[
                    {
                        title:"编号",
                        key:"pbnumber",
                    },
                    {
                        title:"构件状态",
                        key:"statusname"
                    },
                    {
                        title:"验收人员",
                        key:"actorname",
                        width:80

                    },
                    {
                        title:"验收时间",
                        key:"time",
                        width:100
                    },
                    {
                        title:"单位工程",
                        key:"unitprojectname",
                        width:100
                    },
                    {
                        title:"标高",
                        key:"elevationname",
                        width:60
                    },
                    {
                        title:"专业",
                        key:"majorname",
                    },
                    {
                        title:"构件类型",
                        key:"pbtypename",
                    },
                    {
                        title:"操作",
                        width: 80,
                        render:(h,r)=>{
                            return h('Button',{
                                props: {
                                    type: 'error',
                                },
                                style:{
                                    height: '32px',
                                    backgroundColor: '#d44c4c',
                                    marginTop: (this.tableHeight - 43)/20 - 16 +'px',
                                    marginBottom: (this.tableHeight - 43)/20 - 16 +'px',
                                },
                                on: {
                                    click: () => {
                                        // this.$router.push("/main/issue/quality/"+r.row.issueId);
                                        // this.detailrow = r.row;
                                        console.log(r.row);
                                        this.idstate = [];
                                        this.$store.commit('setbaclevel',true);
                                        this.$store.commit('setissueId',r.row.precastbeam_id);
                                        this.idstate.push(r.row.pbnumber);
                                        this.idstate.push(r.row.pbtypename);
                                    }
                                }
                            },
                            "查看")
                        }
                    }
                ],
                data1:[
                        {
                            canupdate: true,
                            priority: {
                                text: "轻微",
                                class: "fa-arrow-down text-success"
                            },
                            guanlianyuansudis: "构件:BS-03-B2-01",
                            guanlianyuansu: [
                                "构件:BS-03-B2-01"
                            ],
                            issueId: 102,
                            dangqianfuzeren: "匡思羽,hl芳强,测试,郭丽清,任瑛楠,系统观察员",
                            dangqianjieduan: {
                                color: "project-index-bg-gray ",
                                jianduan: "未处理"
                            },
                            describe: "哦哦哦",
                            number: "ZL-1709291245-101",
                            faqishijian: "2017-09-29 12:45:43",
                            deadline: "2017-10-06",
                            each: "",
                            faqiren: "潘古兵",
                            needdeal: true,
                            unfinished: true,
                    }
                ],
                listdata:[]
            }
        },
        methods:{
            changePage(page){
                this.loading = true;
                let vm = this;
                mui.ajax({
                    url:`${vm.$store.state.serverIp}/task/pbstatusrecords/?page=${page}&perPage=10&precastbeam__pbtype__major=${vm.saixuandata.state[0] || ''}&precastbeam__pbtype=${vm.saixuandata.state[1] || ''}&precastbeam__elevation=${vm.saixuandata.space[1] || ''}&precastbeam__elevation__unitproject=${vm.saixuandata.space[0] || ''}&status=${vm.saixuandata.state[2] || ''}&search=${vm.saixuandata.membervalue}&time__gte=${vm.saixuandata.time || ''}&time__lte=${vm.saixuandata.time1 || ''}&ordering=-time&token=`+vm.$store.state.sessionid,
                    success(res){
                        vm.total = res.count;
                        vm.listdata = res.results;
                        vm.listdata.forEach((val,index)=>{
                            val.time = val.time.split('T')[0];
                        });
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
                    url:`${vm.$store.state.serverIp}/task/pbstatusrecords/?page=1&perPage=10&precastbeam__pbtype__major=&precastbeam__pbtype=&precastbeam__elevation=&precastbeam__elevation__unitproject=&status=&search=${vm.searchlist}&time__gte=&time__lte=&ordering=-time&token=`+vm.$store.state.sessionid,
                    type:'get',
                    success(res){
                        vm.listdata = res.results;
                        vm.listdata.forEach((val,index)=>{
                            val.time = val.time.split('T')[0];
                        });
                        vm.total = res.count;
                        vm.loading = false;
                    }

                })
            }
        },
        mounted(){
            let vm = this;
            vm.$nextTick(function(){
               vm.tableHeight = document.body.clientHeight - 160;
               // $("td").style.height=vm.tableHeight/10 + "px";
               // $("td").height(60);
            });
            console.log($(".ivu-table-small td"));
            mui.ajax({
                url:`${vm.$store.state.serverIp}/task/pbstatusrecords/?page=1&perPage=10&precastbeam__pbtype__major=&precastbeam__pbtype=&precastbeam__elevation=&precastbeam__elevation__unitproject=&status=&search=&time__gte=&time__lte=&ordering=-time&token=`+vm.$store.state.sessionid,
                type:'get',
                success(res){
                    vm.total = res.count;
                    vm.listdata = res.results;
                    vm.listdata.forEach((val,index)=>{
                        val.time = val.time.split('T')[0];
                    });
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
                if(val != null){
                    this.loading = true;
                    vm.saixuandata = JSON.parse(val);
                    mui.ajax({
                        url:`${vm.$store.state.serverIp}/task/pbstatusrecords/?page=1&perPage=10&precastbeam__pbtype__major=${vm.saixuandata.state[0] || ''}&precastbeam__pbtype=${vm.saixuandata.state[1] || ''}&precastbeam__elevation=${vm.saixuandata.space[1] || ''}&precastbeam__elevation__unitproject=${vm.saixuandata.space[0] || ''}&status=${vm.saixuandata.state[2] || ''}&search=${vm.saixuandata.membervalue}&time__gte=${vm.saixuandata.time || ''}&time__lte=${vm.saixuandata.time1 || ''}&ordering=-time&token=`+vm.$store.state.sessionid,
                        type: "get",
                        success(res){
                            vm.listdata = res.results;
                            vm.listdata.forEach((val,index)=>{
                                val.time = val.time.split('T')[0];
                            });
                            vm.total = res.count;
                            vm.showfilter = false;
                            vm.$store.commit('getquiltylist',null);
                            vm.loading = false;
                        },
                        error(status,errorThrown){
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