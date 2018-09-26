<style scoped lang="less">
    @import url("../../less/addLocator.less");
    @import "../../less/quality/add.less";
    @import "../../less/all/animat.less";
</style>
<style>
    .deleteit{
        position: absolute;
        top: -12px;
        right: -1px;
        display: inline-block;
        width: 10px;
        height: 10px;
        font-size: 18px;
    }
    .newpop .weui-cell{
        padding: 10px 15px 10px 0px !important;
    }
    .linequetion .weui-cell__ft{
        text-align: left !important;
    }
    .linequetion .weui-cell{
        padding: 10px 15px 10px 0px !important;
        margin-top: -10px !important;
    }
    .newpop {
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
    .qrline{
        float: right;
        display: inline-block;
        height: 30px;
        font-size: 24px;
        background-color: #fff;
        border-color: #dddee1;
        width: 30px;
        text-align: right;
    }
    .newcamera{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
        height: 125px !important;
        background-color: #999 !important;
    }
    .newcamera div{
        height: 40px;
        line-height: 40px;
        margin-bottom: 1px;
        background-color: #fff !important;
        font-size: 14px;
        width: 100%;
        text-align: center;
    }
    .newcamera div:last-child{
        margin-top: 2px;
        margin-bottom: 0px;
    }
</style>
<template>
    <div class="main">
        <Form :label-width="80">
            <FormItem label="问题编号" style="margin-bottom: 5px !important">
                <div class="linequetion">
                    {{formItem.number||"获取中..."}}
                </div>
                
            </FormItem>
            <FormItem label="关联元素" style="margin-bottom: 5px !important">
                <div style="color: #999;height: 36px;line-height: 36px;display: inline-block;width: calc(100% - 40px)" @click="showfloor = true">{{floorscontent == ''? '选择元素' : floorscontent}}</div>
                <span class="qrline" @click="scanQR"><Icon type="qr-scanner"></Icon></span>
            </FormItem>
            <div class="addtables">
                <Tag type="border" closable color="red" v-if="formItem.tabs.length>0" v-for="item,index in formItem.tabs" @on-close="deletemember(index,'form')" :key="item.value">{{item}}</Tag>
                <Tag type="border" closable color="red" v-if="formItem.floorstabs.length>0" v-for="item,index in formItem.floorstabs" @on-close="deletemember(index,'floor')" :key="item.value">{{item.value}}</Tag>
            </div>
            <FormItem label="流程模板" prop="templates" style="margin-bottom: 5px !important">
                    <div v-if='showdisable' style="color: #999;height: 36px;line-height: 36px;" @click="showdef = true">请选择流程模板</div>
                    <popup-picker v-else class="newpop" :data="template" v-model="formItem.templates" style="width: 100%;margin-top: -7px;height: 36px;" placeholder="请选择流程模板" :displayFormat="chosetem"></popup-picker>
<!--                 <Select v-model="formItem.templates" size="small">
                    <Option v-for="item in template" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select> -->
            </FormItem>
            <FormItem label="截止日期" prop="deadLine">
                <div class="linequetion">
                    <datetime v-model="formItem.deadLine" placeholder="请选择时间" format="YYYY-MM-DD" :start-date="startDate"></datetime>
                </div>
                
            </FormItem>
            <FormItem label="优先级" style="margin-bottom: 5px !important">
                <div class="pridiv">
                    <div v-for="item,index in prilist" @click="priid = item.key" :class="{'priorityseleted':priid == item.key}">{{item.value}}</div>
                </div>
            </FormItem>
            <div style="width: 100%;margin-bottom: 17px;">
                <ul id="imgurl" >
                    <li v-for="item,index in img" style="float:left;margin-right: 10px;position: relative">
                        <img :src="item" :data-original="item" width="60" height="60" @click="showImg" :key="item">
                        <span @click="deleteimg(index)" class="deleteit">
                            <Icon type="close-circled"></Icon>
                        </span>
                        
                    </li>                  
                </ul>
                <div class="addButton" @click="opencam">
                    <Icon type="plus-round"></Icon>
                </div>
            </div>
            <div class="disdiv">
                <group>
                    <x-textarea v-model="formItem.describe" placeholder="请输入问题描述..." :show-counter="true" :max="200" :rows="3"></x-textarea>
                </group>
            </div>
            <div class="showlog" :class="{'showlogbu':showdata.length > 0}">{{showdata}}</div>
            <Button class="submitbutton" type="error" @click="submitForm">提交</Button>
        </Form>
        <Modal
                width="300"
                v-model="deleteimgs"
                :closable="false"
                :mask-closable="false"
                @on-ok="deleteimg">
            <span style="text-align:center;font-size: 14px">确认删除？</span>
        </Modal>
        <Modal
                width="300"
                :closable="false"
                v-model="showdef">
            <div style="text-align:center;font-size: 18px;font-weight: 700">用户没有设置处理流程，请联系系统管理员设置！</div>
            <div slot="footer">
                <Button type="error" size="large" @click="showdef = false">确定</Button>
            </div>
        </Modal>
        <transition name="bottomdrawer">
            <floors class="bottomdrawer" v-if="showfloor" @closefloor="closefloorstate" @subfloorsid="subfloorsid"></floors>
        </transition>
        <transition name="bottomdrawer">
            <div v-if="showcamera" style="bottom: 48px" class="bottomdrawer newcamera">
                <div @click="openCr(1);showcamera = false">拍照上传</div>
                <div @click="openCr(2)">从相册选择</div>
<!--                 <div @click="openCr(2,-100)">从相册选择1</div>
                <div @click="openCr(2,-50)">从相册选择2</div> -->
                <div @click="showcamera = false">取消</div>
            </div>
        </transition>
        <div style="position: fixed;top: 0px;left: 0px;bottom: 0px;background-color: #000;opacity: 0.5;z-index: 9999;right: 0px;" v-if="showfloor || showcamera" @click="showfloor = false;showcamera = false"></div>
<!--         <transition name="leftdrawer">
            <selectconstr class="leftdrawer" v-if="showconstr"></selectconstr>
        </transition> -->
    </div>
</template>
<script>
    import { Datetime,PopupPicker,Group ,XTextarea,Checker, CheckerItem} from 'vux';
    import floors from '../all/selectfloors.vue';
    export default {
        components:{
            Datetime,
            PopupPicker,
            Group,
            XTextarea,
            floors,
            Checker,
            CheckerItem
        },
        data(){
            return {
                startDate:(time=>{
                    return time.format('yyyy-MM-dd');
                })(new Date),
                formItem:{
                    number:"",
                    templates:[],
                    deadLine:null,
                    describe:null,
                    tabs:[],
                    tabsid:[],
                    floorstabs:[],
                    docId:[],//ID
                    floorsid:[],
                    fenquid:[],
                },
                template:[],
                img:[],//链接
                loading:false,
                addData: [],
                showdata:'',
                deleteimgs:false,
                indeximg:999,
                showdisable:false,
                showdef:false,
                showfloor:false,
                floorscontent:'',
                constrcontent:'',
                priid:5,
                showcamera:false,
                prilist:[
                    {
                        key:10,
                        value:'严重'
                    },
                    {
                        key:5,
                        value:'一般'
                    },
                    {
                        key:1,
                        value:'轻微'
                    }
                ]
            }
        },
        mounted(){
            
        },
        methods:{
            opencam(){
                this.showcamera = true;
            },
            showImg(src,index){
                let vm = this;
                var viewer = new Viewer(document.getElementById('imgurl'), {
                    url: 'data-original',
                    navbar: false,
                    movable: false,
                });
            },
            scanQR(){
                if(this.addData.length>=10){
                    this.$Notice.error({
                        title: '最多只能添加10个'
                    });
                    return;
                }
                // localStorage.QRwhat = 'addlist';
                // this.$router.push({ path: '/plannedQR'});
                this.$store.commit('setqrstate',true);
            },
            submitForm(){
                let vm = this;
                let newlist = '';
                let selectedGJs  = [];
                let selectedKJ = '';
                if(vm.formItem.templates.length == 0) {
                    vm.showdata = '请选择流程模板';
                    return;
                };
                if(vm.formItem.deadLine.length == 0) {
                    vm.showdata = '请选择截止时间';
                    return;
                };
                // if(vm.formItem.docId.length == 0) {
                //     vm.showdata = '请上传图片';
                //     return;
                // };
                if(vm.formItem.describe.length == 0) {
                    vm.showdata = '请添加问题描述';
                    return;
                };
                if(vm.formItem.docId.length > 0){
                    newlist = vm.formItem.docId.join(",")+",";
                }else{
                    newlist = vm.formItem.docId.join(",");
                };
                if(vm.formItem.tabsid.length>0){
                    vm.formItem.tabsid.forEach(v=>{
                        selectedGJs.push({
                            "relatedid":v,
                            "typetable":"构件",
                        }) 
                    })
                    
                }
                if(vm.formItem.floorstabs.length>0){
                    selectedKJ = vm.formItem.floorstabs[0].id;
                }
                vm.loading = true;
                $.ajax(`${vm.$store.state.serverIp}/task/issue/createissue/?token=`+vm.$store.state.sessionid, {
                    dataType: 'json',
                    type: 'post',
                    timeout: 10000,
                    data:{
                        qnumber:vm.formItem.number,
                        qdescribe:vm.formItem.describe,
                        selectedGJs:JSON.stringify(selectedGJs),
                        selectedKJ:selectedKJ,
                        dealTemplate:Number(vm.formItem.templates[0]),
                        issuePriority:vm.priid,///todo:添加优先级选择
                        deadline:vm.formItem.deadLine,
                        RelateFileList:newlist
                        // RelateFileList:`3530,`,
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    crossDomain:true,
                    success(res) {
                        if(res.issuc == "true"){
                            vm.$Message.success('提交成功');
                            let bacstate = vm.$store.state.quiltybac;
                            vm.$store.commit('setquiltybac',!bacstate);
                            vm.loading = false;
                            getpbstatuslist(localStorage.colorstate);
                        }else{
                            vm.$Message.error(res.error);
                        }
                    },
                    error(xhr, type, errorThrown) {
                    }
                });
                
            },
            openCr(where){
                let that = this;
                let width = document.body.clientWidth - 150;
                navigator.camera.getPicture(function (imageData) {
                    // var imgdata = that.convertImgToBase64(imageData);
                    
                    let newurl = "http://localhost:8080"+imageData.substring(7,imageData.length);
                    that.Upload(newurl);
                }, function (message) {
                }, {  
                   quality: 50,  
                   destinationType: Camera.DestinationType.FILE_URI,  
                   encodingType: Camera.EncodingType.JPEG,  
                   sourceType: where,
                   allowEdit:true,
                   MediaType:0,
                    popoverOptions: new CameraPopoverOptions(width,300,100,300,Camera.PopoverArrowDirection.ARROW_RIGHT),
                })
            },
            Upload(fileurl) {
                let vm = this;
                let success = function(r){
                    let newdata = JSON.parse(r.response);
                    vm.img.push(fileurl);
                    vm.formItem.docId.push(newdata.docId);
                    vm.$Message.success("上传图片上传成功");
                    vm.showcamera = false;
                };
                let fail = function(error){
                    vm.$Message.error("上传图片失败,请重新上传");
                    vm.showcamera = false;
                };
                let options = new FileUploadOptions();
                options.fileKey = "Filedata";  
                options.fileName = fileurl.substr(fileurl.lastIndexOf('/') + 1);
                options.httpMethod = "POST"; 

                let ft = new FileTransfer();
                let SERVER = vm.$store.state.serverIp+"/uploadfile_conc/?token="+vm.$store.state.sessionid;
                ft.upload(fileurl,encodeURI(SERVER),success,fail,options);
            },
            deletemember(index,who){
                if(who == 'form'){
                    this.formItem.tabs.splice(index,1);
                    this.formItem.tabsid.splice(index,1);
                }else if(who == 'floor'){
                    this.formItem.floorstabs = [];
                }
            },
            chosetem(a,b){
                let tem;
                this.template[0].forEach((val,index) => {
                    if(val.value == a) {
                        tem = val.name;
                    }
                });
                return tem;
            },
            deleteimg(index){
                    this.img.splice(index,1);
                    this.formItem.docId.splice(index,1);
            },
            closefloorstate(data){
                this.showfloor = data;
            },
            subfloorsid(data){
                if(data.length == 0){
                    return;
                }
                this.formItem.floorstabs = [];
                let obj = {
                    value:data[1],
                    id:data[0],
                }
                this.formItem.floorstabs.push(obj);
            },
            cleanlist(){
                // this.formItem.tabs = [];
                // this.formItem.tabsid = [];
            }

        },
        created(){
            let vm = this;
            if(vm.$store.state.environment==="dev"){
                vm.img.push("https://i.loli.net/2017/08/21/599a521472424.jpg");
            }
            mui.ajax(`${vm.$store.state.serverIp}/task/issue/getissuenumber/?issuetype=质量问题&token=`+vm.$store.state.sessionid,{
                crossDomain:true,
                success(res){
                    if(res.res==="sucess"){
                        vm.formItem.number = res.number;
                    }else {
                        vm.formItem.number = "获取失败，请重试";
                    }
                },
                error(xhr,type){
                    if(vm.$store.state.environment==="dev"){
                        vm.formItem.number = 'ZL-1111111111-111';
                    } else {
                        vm.formItem.number = '网络故障，请稍后再试';
                    }
                }
            });

            mui.ajax(`${vm.$store.state.serverIp}/task/issue/getmajortemplate/?issuetype=质量问题&token=`+vm.$store.state.sessionid,{
                crossDomain:true,
                success(res){
                    if(res.issuc==="true"){
                        let arr = [];
                        if(res.TemplateList.length == 0){
                            vm.showdisable = true;
                        }else{
                            res.TemplateList.forEach((val,index)=>{
                            let obj = {
                                value:val.id,
                                name:val.name,
                            }
                                arr.push(obj);
                            })
                            vm.template.push(arr);
                        }
                    }
                }
            });
        },
        computed:{
            qr(){
                return this.$store.state.QR;
            },
            modelproperty(){
                return this.$store.state.modelproperty;
            }
        },
        watch:{
            qr(val,oldval){
                if(val != null){
                    if(this.formItem.tabs.indexOf(val)<0){
                       this.formItem.tabs.push(this.$store.state.QR); 
                    };
                    this.$store.commit('clearQR');
                };
            },
            modelproperty:{
                handler(val,old) {
                    let vm = this;
                    if(val == null){
                    return;
                    }
                    let goudata = JSON.parse(val);
                    if(goudata.type == "elelist"){
                        let index = vm.formItem.tabsid.indexOf(Number(goudata.id));
                        if(index == -1){
                            vm.formItem.tabs.push('构件：'+Number(goudata.id));
                            vm.formItem.tabsid.push(Number(goudata.id));
                        }
                    }else if(goudata.type == "dbIdslist"){
                        mui.ajax({
                            type: "get",
                            url: `${serverIp}/task/modelview/getpbproperty/?token=`+vm.$store.state.sessionid,
                            cache: false,
                            dataType: "json",
                            data: {
                                "dbId": JSON.stringify(goudata.id[0]),
                                "pbId": '',
                                "_curUnitId": _curUnitId,
                                "_curMajor": _curMajor,
                            },
                            success: function(data) {
                                let index = vm.formItem.tabsid.indexOf(data.pbid);
                                if(index == -1){
                                    vm.formItem.tabs.push('构件：'+data.pbid);
                                    vm.formItem.tabsid.push(data.pbid);
                                }
                            }
                        });
                    }
                    vm.$store.commit('setmodelproperty',null);
                },
                immediate: true

            }

        }
    }
</script>