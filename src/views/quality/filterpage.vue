<style scoped lang="less">
    @import "../../less/quality/filterpage.less";
</style>
<style type="text/css">
    .ivu-tree-arrow{
        font-size: 14px !important;
    }
    .ivu-tree li .ivu-checkbox-wrapper{
        position: absolute !important;
        width: 100% !important;
    }
    .chosetime .weui-cell__ft{
        text-align: left !important;
    }
    .chosetime .weui-cells{
        margin-top: 0px !important;
        line-height: 37px !important;
    }
    .chosetime .weui-cell{
        padding: 0px !important;
    }
</style>
<template>
    <div class="filtermain" style="padding: 10px 10px 48px 10px !important">
        <Row class="filterline">
            <Col span="24" class="head">
                <Icon type="arrow-up-c"></Icon>
                <span>流程筛选</span>
            </Col>
            <Col span="24" v-for="items,index in processdata" style="margin: 0px 0px 5px 0px">
                <Tree :data="[items]" show-checkbox :render="renderContent" @on-check-change="getCheckedNodes" ref="index1"></Tree>
                <!-- <treemenu @gettreeid="gettreeid" :data="tree" :depth="0" :label="tree.label" :count="tree.count" :single="single"></treemenu> -->
            </Col> 
            
        </Row>
        <Row class="filterline">
            <Col span="24" class="head">
                <Icon type="arrow-up-c"></Icon>
                <span>优先级</span>
            </Col>
            <Col span="24" class="box">
                    <div class="priorityBtn" :class="isselect ? 'priorityseleted' : 'noit'" @click="isselect = !isselect;selectit(10);">严重</div>
                    <div class="priorityBtn" :class="isselect1 ? 'priorityseleted' : 'noit'" @click="isselect1 = !isselect1;selectit(5);">一般</div>
                    <div class="priorityBtn" :class="isselect2 ? 'priorityseleted' : 'noit'" @click="isselect2 = !isselect2;selectit(1);">轻微</div>
            </Col>
        </Row>
        <Row class="filterline">
            <div class="head" @click="openres = !openres">
                <Icon type="ios-people"></Icon>
                <span>负责方</span>
                <span v-if="responseList.length > 3" class="dropdown"><Icon type="android-arrow-dropdown"></Icon></span>
            </div>
            <Col span="24" class="box" :class="{'changebox':openres}" style="overflow:hidden">
                <div class="priorityBtn" :class="{'priorityseleted':formltem.response.indexOf(item.id) >= 0}" v-for="(item,index) in responseList" @click="chosepriau(item.id,'pri')">{{item.name}}</div>
            </Col>
        </Row>
        <Row class="filterline">
            <div class="head" @click="openpri = !openpri">
                <Icon type="person"></Icon>
                <span>发起人</span>
                <span v-if="prilist.length > 3" class="dropdown"><Icon type="android-arrow-dropdown"></Icon></span>
            </div>
            <Col span="24" class="box" :class="{'changebox':openpri}" style="overflow:hidden">
                <div class="priorityBtn" :class="{'priorityseleted':formltem.author.indexOf(item.id) >= 0}" v-for="item in prilist" @click="chosepriau(item.id,'author')">{{item.truename}}</div>
<!--                 <Select v-model="formltem.author" multiple>
                    <Option v-for="item in prilist" :value="item.id" :key="item.id">{{item.truename}}</Option>
                </Select> -->
            </Col>
        </Row>
        <Row class="filterline filterline1">
            <Col span="24" class="head">
                <Icon type="android-time"></Icon>
                <span>创建时间段</span>
            </Col>
            <Col span="7" class="box chosetime">
                <datetime v-model="formltem.begin" style="width: 100%" placeholder="请选择时间" format="YYYY/MM/DD" @on-confirm="startDate=formltem.begin;
                createnext = false;"></datetime>
            </Col>
            <Col span="2" class="box">
                <div style="width: 100%;height:32px;text-align: center;line-height: 32px;">—</div>
            </Col>
            <Col span="7" class="box chosetime" style="margin-left: 25px;">
                <datetime :readonly="createnext" v-model="formltem.begin1" style="width: 100%" placeholder="请选择时间" format="YYYY/MM/DD" :start-date="startDate"></datetime>
            </Col>
        </Row>
        <Row class="filterline filterline1">
            <Col span="24" class="head">
                <Icon type="android-time"></Icon>
                <span>更新时间段</span>
            </Col>
            <Col span="7" class="box chosetime">
                <datetime v-model="formltem.newadd" style="width: 100%" placeholder="请选择时间" format="YYYY/MM/DD" @on-confirm="addnext = false;addDate=formltem.newadd"></datetime>
            </Col>
            <Col span="2" class="box">
                <div style="width: 100%;height:32px;text-align: center;line-height: 32px;">—</div>
            </Col>
            <Col span="7" class="box chosetime" style="margin-left: 25px;">
                <datetime :readonly="addnext" v-model="formltem.newadd1" style="width: 100%" placeholder="请选择时间" format="YYYY/MM/DD" :start-date="addDate"></datetime>
            </Col>
        </Row>
        <Row class="filterline filterline1">
            <Col span="24" class="head">
                <Icon type="android-time"></Icon>
                <span>截止时间段</span>
            </Col>
            <Col span="7" class="box chosetime">
                <datetime v-model="formltem.end" style="width: 100%" placeholder="请选择时间" format="YYYY/MM/DD" @on-confirm="endDate=formltem.end;dienext = false"></datetime>
            </Col>
            <Col span="2" class="box">
                <div style="width: 100%;height:32px;text-align: center;line-height: 32px;">—</div>
            </Col>
            <Col span="7" class="box chosetime" style="margin-left: 25px;">
                <datetime :readonly="dienext" v-model="formltem.end1" style="width: 100%" placeholder="请选择时间" format="YYYY/MM/DD" :start-date="endDate"></datetime>
            </Col>
        </Row>
        <div class="bottomlist">
                <Button type="text" @click="cancelit" style="float: left">重置</Button>
                <Button type="error" @click="submitit">确定</Button>
        </div>
    </div>
</template>
<script>
    import { Datetime} from 'vux';
    import treemenu from './filtertree.vue';
    export default{
        components:{
            Datetime,
            treemenu
        },
        data(){
            return{
                single:false,
                isselect:false,
                isselect1:false,
                isselect2:false,
                processdata:null,
                createnext:false,
                dienext:false,
                addnext:false,
                openres:false,
                openpri:false,
                startDate:null,
                endDate:null,
                addDate:null,
                priority:[],
                formltem:{
                    pri:null,
                    author:[],
                    response:[],
                    begin:null,
                    begin1:null,
                    end:null,
                    end1:null,
                    newadd:null,
                    newadd1:null,
                    process:[],
                },
                prilist:[
                ],
                responseList:[],
                tree:{
                  label: 'root',
                  count:10,
                  check:false,
                  parentId:0,
                  id:1,
                  children: [
                    {
                      label: 'item1',
                      count:10,
                      check:false,
                      parentId:1,
                        id:2,
                      children: [
                        {
                          label: 'item1.1',
                          count:10,
                          check:false,
                          parentId:2,
                            id:3,
                        },
                        {
                          label: 'item1.2',
                          count:10,
                          check:false,
                          parentId:2,
                            id:4,
                          children: [
                            {
                              label: 'item1.2.1',
                              count:10,
                              check:false,
                              parentId:4,
                                id:5,
                            }
                          ]
                        }
                      ]
                    }, 
                    {
                      label: 'item2',
                      count:10,
                      check:false,
                      parentId:1,
                        id:7,
                    }
                  ]
                }
            }
        },
        mounted(){
            var vm = this;
            mui.ajax({
                url:`${vm.$store.state.serverIp}/task/issue/issuelistcount/?issuetype=zhiliang&token=`+vm.$store.state.sessionid,
                type: "get",
                success(res){
                    vm.processdata = res.templatetree;
                }
            });
            mui.ajax({
                url:`${vm.$store.state.serverIp}/task/issue/issuefilter_initdata/?issuetype=zhiliang&token=`+vm.$store.state.sessionid,
                type: "get",
                success(res){
                    if(res.issuc){
                        vm.responseList = res.majorList;
                        vm.prilist = res.createuserlist;
                        console.log(vm.responseList);
                        console.log(vm.prilist);
                    }
                }
            })

        },
        methods:{
            selectit(val){
                    let indexs = this.priority.indexOf(val);
                    if(indexs > -1){
                        this.priority.splice(indexs,1);
                    }else{
                        this.priority.push(val);
                    }
            },
            arrayN2A(val){
                let newVal = [];
                if(val.length > 0) {
                    val.forEach((value,index) => {
                        newVal.push(value.toString());
                    });
                    return newVal;
                }else{
                    return newVal;
                }
            },
            timein(time,time1) {
                let times = [];
                if(time != null && time1 != null) {
                    times.push(time);
                    times.push(time1);
                }
                return times;
            },
            submitit(){
                let vm = this;
                this.formltem.process = [];
                if(this.formltem.end == "" && this.formltem.end1 == ""){

                }else if(this.formltem.end !== "" && this.formltem.end1 !== "") {

                }else{
                    vm.$Message.error("请选择完整截止时间段");
                    return;
                };
                if(this.formltem.begin == "" && this.formltem.begin1 == ""){

                }else if(this.formltem.begin !== "" && this.formltem.begin1 !== "") {

                }else{
                    vm.$Message.error("请选择完整创建时间段");
                    return;
                };
                if(this.formltem.newadd == "" && this.formltem.newadd1 == ""){

                }else if(this.formltem.newadd !== "" && this.formltem.newadd1 !== "") {

                }else{
                    vm.$Message.error("请选择完整更新时间段");
                    return;
                };
                if(this.processdata.length > 0){
                    for(var i = 0;i<this.$refs.index1.length;i++){
                        this.$refs.index1[i].getCheckedNodes().forEach((val, index) => {
                            if(!val.hasOwnProperty("children")){
                                vm.formltem.process.push(val.id);
                            }   
                        })
                       
                    };
                }
                
                let newdata = {
                    issuecategorys:[],
                    fuzefenbao:this.arrayN2A(this.formltem.response),
                    createuser:this.arrayN2A(this.formltem.author),
                    deadline:this.timein(this.formltem.end,this.formltem.end1),
                    createtime:this.timein(this.formltem.begin,this.formltem.begin1),
                    updatetime: this.timein(this.formltem.newadd,this.formltem.newadd1),
                    priority:this.arrayN2A(this.priority),
                    // priority:[10,5],
                    stepIds:this.arrayN2A(this.formltem.process),
                    searchValue:"",

                };
                vm.$store.commit('getquiltylist',JSON.stringify(newdata));
            },
            cancelit(){
                if(this.processdata.length > 0){
                   for(var i = 0;i<this.$refs.index1.length;i++){

                        this.$refs.index1[i].getCheckedNodes().forEach((val, index) => {
                               val.checked = false;  
                        })
                       
                    }; 
                }
                
                this.processdata.forEach((val,index)=>{
                    val.checked = false;
                    val.indeterminate = false;
                });

                this.priority = [];
                this.formltem.response = [];
                this.formltem.author = [];
                this.formltem.end = null;
                this.formltem.end1 = null;
                this.formltem.begin = null;
                this.formltem.begin1 = null;
                this.priority = [];
                this.formltem.process = [];
                this.isselect=false;
                this.isselect1=false;
                this.isselect2=false;

            },
            renderContent(h, { root, node, data }){
                return h('span',{
                    style: {
                        display: 'inline-block',
                        float: 'right',
                        width: 'calc(100% - 50px)'
                    }
                },[
                  h('span',{
                           style:{
                                display: 'inline-block',
                                float: 'right',
                                width: "30px",
                                height: "14px",
                                borderRadius: '12px',
                                lineHeight: '14px',
                                textAlign: 'center',
                                backgroundColor: '#ddd',
                                fontSize: '14px',
                           } 
                 },data.count),
                 h('span',{
                    style:{
                        display: 'inline-block',
                        width: '160px',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        cursor:'pointer',
                        float: 'left',
                        fontSize: '14px',
                    },
                    attrs:{
                        title:data.title
                    }
                 },data.title)  
                ])
                 
            },
            getCheckedNodes(data){
                console.log(3333333333333333333333);
                console.log(data);
            },
            chosepriau(id,name) {
                if(name == 'pri') {
                    let num = this.formltem.response.indexOf(id);  
                    if(num >= 0) {
                        this.formltem.response.splice(num,1);
                    }else{
                        this.formltem.response.push(id);
                    }
                }else{
                    let num = this.formltem.author.indexOf(id);
                    if(num >= 0) {
                        this.formltem.author.splice(num,1);
                    }else{
                        this.formltem.author.push(id);
                    }
                }
                             
            },
            gettreeid(val){
                console.log('geyid');
                console.log(val);
            }
        }
    }
</script>