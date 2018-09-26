<style scoped lang="less">
    @import url('../../less/plan/constructionRecord.less');
    @import "../../less/all/animat.less";
</style>
<style type="text/css">
    .chosehead label{
        width:calc(100% - 26px) !important;
        text-align: left !important;
    }
    .deleteit{
        position: absolute;
        top: -12px;
        right: -1px;
        display: inline-block;
        width: 10px;
        height: 10px;
        font-size: 18px;
    }
    .conlinequetion .weui-cell{
        padding: 10px 15px 10px 0px !important;
        margin-top: -7px !important;
    }
    .goujianmodal .ivu-modal-body{
        padding: 0px 16px !important;
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
        <Form class="form" :label-width="86" ref="formValidate" :model="form" label-position="left">
            <FormItem label="添加构件" style="margin-bottom: 5px !important">
                <span class="qrline" @click="showconstr = true"><i class="iconfont icon-tree"></i>
                </span>
                <span class="qrline" @click="scanQR"><i class="iconfont icon-qrscanner" style="font-size: 28px"></i></span>
                
                <span class="qrline" @click="choseway('pointer')" style="margin-left: 10px"><i class="iconfont icon-add"></i></span>
                <span class="qrline" @click="choseway('all')"><i class="iconfont icon-add2"></i></span>
            </FormItem>
            <FormItem label="已选构件" style="margin-bottom: 5px !important" @click.native="openlists">
                <div class="choseline" v-if="addData.length == 0">请添加构件</div>
                <div class="choseline" v-else>{{addData[0].number}}{{addData[0].pbtype}}</div>
                <!-- <span style="color: #d44c4c;float: right;">{{addData.length}}</span> -->
                <div class="badge-value">
                  <badge :text="addData.length"></badge>
                </div>
            </FormItem>
            <FormItem label="选择状态" prop="state" v-if="addData.length > 0" style="margin-bottom: 5px !important">
                    <popup-picker :data="states" v-if="changestates" class="conlinequetion" v-model="form.state" style="width: 100%" placeholder="请选择状态" :displayFormat="chosetem" :disabled = "states.length == 0"></popup-picker>
            </FormItem>
<!--             <FormItem label="场地仓位">
                <group>
                    <popup-picker :data="duichangs" v-model="form.duichang" style="width: 100%" placeholder="请选择状态" :displayFormat="chosetem"></popup-picker>
                </group>
            </FormItem> -->
            <div style="margin-bottom: 17px;">
                <ul id="imgurl" >
                    <li v-for="item,index in img" style="float:left;margin-right: 10px;position: relative">
                        <img :src="item" :data-original="item" width="60" height="60" @click="showImg" :key="item">
                        <span @click="deleteimg(index)" class="deleteit">
                            <Icon type="close-circled"></Icon>
                        </span>
                        
                    </li>                  
                </ul>
                <div class="addButton" @click="showcamera = true">
                    <Icon type="plus-round"></Icon>
                </div>
            </div>
<!--             <FormItem label="录入时间" prop="nowdate">
                <datetime v-model="form.nowdate" style="width: 100%" placeholder="请选择时间" format="YYYY-MM-DD" :start-date="startDate"></datetime>
            </FormItem> -->
            <div>
                 <group>
                    <x-textarea v-model="form.addon" placeholder="请输入描述..." :show-counter="true" :max="200" :rows="3"></x-textarea>
                  </group>
            </div>
            <div class="showlog" :class="{'showlogbu':showdata.length > 0}">{{showdata}}</div>
            <Button class="submitbutton" type="success" long @click="submit" :loading="loading">提交</Button>
        </Form>
        <Modal
                :closable="false"
                :mask-closable="false"
                v-model="showconstr"
                class="goujianmodal">
                <p slot="header" style="color:#999;text-align:left">
                    <span>构件选择</span>
                </p>
            <selectconstr v-if="showconstr" ref="goujian" @givegoujian="getgoujian"></selectconstr>
            <div slot="footer">
                <Button type="text" size="large" @click="showconstr = false">取消</Button>
                <Button type="error" size="large" @click="subgoujian">确定</Button>
            </div>
        </Modal>
        <Modal  
                :closable="false"
                class="goujianmodal"
                v-model="openlist">
                <div slot="header" style="text-align: left;font-size: 14px;">
                    <div style="height: 32px;line-height: 32px">
                        <div style="float: left">构件列表</div>
                        <Button style="float: right" @click.native="deleteall">全部删除</Button>
                    </div>
                </div>
                <div class="tablecontent" ref="goujianlist">
                    <ul>    
                            <li class="tableline">
                                <div class="linecontent">构件编码</div>
                                <div class="linecontent">当前状态</div>
                                <div class="linejindu">构件类型</div>
                                <span class="percent">当前进度</span>
                                <span class="del" style="font-size: 14px">操作</span>
                            </li>
                            <li class="tableline" v-for="(item,index) in addData">
                                <div class="linecontent">{{item.number}}</div>
                                <div class="linecontent">{{item.status}}({{item.statuspercent}}%)</div>
                                <div class="linejindu">{{item.pbtype}}</div>
                                <span class="percent">
                                    <donumber :index="index" :min="0" :max="100" :value="item.nowpercent" @numbervalue="numbervalue"></donumber>
                                </span>
                                <span class="del" @click="onButtonClick(item,index)"><Icon type="trash-a"></Icon></span>
                            </li>
                    </ul>
                    
                </div>
                <div style="text-align:center" v-if="addData.length == 0">请关闭从新选择构件</div>
                <div slot="footer">
                    <Button type="error" @click="openlist = false">关闭</Button>
                </div>
        </Modal>
        <transition name="bottomdrawer">
            <div v-if="showcamera" style="bottom: 48px" class="bottomdrawer newcamera">
                <div @click="openCr(1);showcamera = false">拍照上传</div>
                <div @click="openCr(2)">从相册选择</div>
                <div @click="showcamera = false">取消</div>
            </div>
        </transition>
        <div style="position: fixed;top: 0px;left: 0px;bottom: 0px;background-color: #000;opacity: 0.5;z-index: 9999;right: 0px;" v-if="showcamera" @click="showcamera = false"></div>
    </div>
</template>
<script>
    import { Datetime,PopupPicker,Group,Swipeout, SwipeoutItem, SwipeoutButton,XTextarea,Badge} from 'vux';
    import selectconstr from '../all/selectconstruction.vue';
    import BScroll from 'better-scroll';
    import donumber from '../all/donumber.vue';
    export default {
        components:{
            Datetime,
            PopupPicker,
            Group,
            Swipeout,
            SwipeoutItem,
            SwipeoutButton,
            XTextarea,
            selectconstr,
            donumber,
            Badge
        },
        data(){
            return {
                form:{
                    tabs:[],
                    state:[],
                    addon:'',
                    tab:[],///autoComplete的存储的构件名
                    nowdate: (time=>{return time.format('yyyy-MM-dd hh:mm');})(new Date),
                    duichang:[]
                },
                startDate:(time=>{
                    return time.format('yyyy-MM-dd');
                })(new Date),
                loading:false,
                showcamera:false,
                states:[],
                duichangs:[],
                scroll:null,
                showdata:'',
                img:[],//链接
                docId:[],//ID
                addData: [],
                treeData:[],
                modelData:[],
                showconstr:false,
                goujiancontent:'',
                openlist:false,

            }
        },
        methods:{
            choseway(val){
                this.$store.commit('openselect',true);
                if(val == 'pointer'){
                    this.choseways = 'pointer';
                     _viewer.unloadExtension('Viewing.Extension.SelectionWindow');
                     this.$Message.success('打开点选！');
                }else{
                    this.choseways = 'all';
                    _viewer.loadExtension('Viewing.Extension.SelectionWindow');
                    _viewer.selectionWindowSetModel(_viewer.model);
                    this.$Message.success('打开框选！');
                }
            },
            showImg(){
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
                this.$store.commit('setqrstate',true);
            },
            openCr(where){
                let that = this;
                let width = document.body.clientWidth - 150;
                navigator.camera.getPicture(function (imageData) {
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
                    vm.docId.push(newdata.docId);
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
            submit(){
                let vm = this;
                let arrs = [];
                if(this.addData.length == 0){
                    this.showdata = "请添加构件";
                    return;
                };
                if(vm.form.state.length == 0){
                    this.showdata = "请选择状态";
                    return;
                };
                // if(vm.docId.length == 0){
                //     this.showdata = "请上传照片";
                //     return;
                // };
                if(vm.form.addon.length == 0){
                    this.showdata = "请添加备注";
                    return;
                };
                vm.loading = true;
                this.addData.forEach(val=>{
                    let obj = {
                        typetable:"构件",
                        relatedid:val.id,
                        percent:val.percent,
                    }
                    arrs.push(obj);
                })
                let data={
                    goujian:JSON.stringify(arrs),
                    status:Number(vm.form.state[0]),
                    lururq:vm.form.nowdate,
                    beizhu:vm.form.addon,
                    relatefiles:vm.docId,
                    duichang:''
                };
                mui.ajax({
                    type:"POST",
                    url:`${vm.$store.state.serverIp}/task/goujian/update/?token=`+vm.$store.state.sessionid,
                    data:data,
                    success(res){
                        if(res.color_code==='blue'){
                            vm.$Message.success('成功录入进度！');
                            vm.loading = false;
                            vm.clear();
                            vm.$store.commit('setplanadd',!vm.$store.state.planadd);
                            getpbstatuslist(localStorage.colorstate);
                            //关掉框选
                            vm.$store.commit('openselect',false);
                            _viewer.unloadExtension('Viewing.Extension.SelectionWindow');
                            //关掉框选
                        } else {
                            vm.$Message.error(res.result_string);
                            vm.loading = false;
                        }
                    },
                    error(){vm.$Message.error("提交失败，检查网络后重试");
                        vm.loading = false;
                    }
                })

            },
            clear(){
                this.addData = [];
                this.form.addon = "";
                this.form.state = "";
                this.img = [];
                _selectPbtypes.clear();

            },
            onButtonClick(val,index) {
                this.form.tab.splice(index,1);
                this.form.tabs.splice(index,1);
                this.addData.splice(index,1);
                deletepbfromList(val,index);

            },
            deleteall(){
                this.addData.forEach((val,index) => {
                    deletepbfromList(val,index);
                })
                this.addData = [];
            },
            addqrdata(qr){
                    let vm = this;
                    vm.form.tabs=[];
                    let arrays = [];
                    let arr = [];
                    this.$store.commit('setchangestate',false);
                    mui.ajax({
                        type: "post",
                        url: `${serverIp}/task/goujian/transpblist/?token=`+vm.$store.state.sessionid,
                        data:{
                            type:"elelist",
                            elelist:JSON.stringify(qr),
                        },
                        cache: false,
                        success: function(data) {
                            if(data.res == true) {
                                let nData = data.pblist;

                                //根据选择的构件渲染模型
                                let haserror = true;
                                data.pblist.forEach(val => {
                                    if(_selectPbtypes.size > 0 && !_selectPbtypes.has(val.pbtype)) {
                                      let error = "只能同时选择一种构件类型!";
                                      haserror = false;
                                      _Wvue.$Message.error(error);
                                    } else {
                                      _selectPbtypes.add(val.pbtype);
                                    }
                                });
                                if(!haserror){
                                    return false;
                                }
                                vm.confirmit(nData);

                                data.statuslist.forEach((val,index) => {
                                    if(val.id == data.defaultstatus){
                                        vm.form.state = [`${val.id}`]
                                    }
                                    let obj = {
                                        value: val.id,
                                        name: val.statusname,
                                    };
                                    arrays.push(obj);
                                });
                                vm.states[0] = arrays;
                                vm.addData = vm.hebing(vm.addData,nData);

                                vm.addData.forEach(val=>{
                                    val.percent = val.nowpercent;
                                });
                                vm.$store.commit('setchangestate',true);
                                
                                vm.$store.commit('clearQR'); 
                            } else {
                            }

                        },
                        error(res){
                            console.log(res);
                        }
                    }); 
            },
            confirmit(data){
                data.forEach(val => {
                if(_extdata.groups) {
                  if(_beGroupMapDataLoad) {
                    var groupdbids = _group2dbidmaps[val.id];
                    console.log(groupdbids);
                    if(groupdbids) {
                      groupdbids.forEach(dbid => {
                        _selectDbids[dbid] = true;
                        _viewer.setThemingColor(dbid, colorSelected);
                        setChildThemingColor(dbid, colorSelected);
                      })
                    }
                  }
                }
                if(!_selectDbids[val.dbid]) {
                  _selectDbids[val.dbid] = true;
                  _viewer.setThemingColor(val.dbid, colorSelected);
                  setChildThemingColor(val.dbid, colorSelected);
                }
            });
            },
            chosetem(a,b){
                let tem;
                this.states[0].forEach((val,index) => {
                    if(val.value == a) {
                        tem = val.name;
                    }
                });
                return tem;
            },
            deleteimg(index){
                    this.img.splice(index,1);
                    this.docId.splice(index,1);
            },
            getgoujian(data){
                let vm = this;
                let haserror = true;
                this.goujiancontent = "选择构件";
                //根据选择的构件渲染模型
                JSON.parse(data).pblist.forEach(val => {
                    if(_selectPbtypes.size > 0 && !_selectPbtypes.has(val.pbtype)) {
                      let error = "只能同时选择一种构件类型!";
                      haserror = false;
                      _Wvue.$Message.error(error);
                    } else {
                      _selectPbtypes.add(val.pbtype);
                    }
                });
                if(!haserror){
                    return;
                }

                JSON.parse(data).pblist.forEach(val => {

                    if(_extdata.groups) {
                      if(_beGroupMapDataLoad) {
                        var groupdbids = _group2dbidmaps[val.id];
                        console.log(groupdbids);
                        if(groupdbids) {
                          groupdbids.forEach(dbid => {
                            _selectDbids[dbid] = true;
                            _viewer.setThemingColor(dbid, colorSelected);
                            setChildThemingColor(dbid, colorSelected);
                          })

                        }
                      }
                    }

                    if(!_selectDbids[val.dbid]) {
                      _selectDbids[val.dbid] = true;
                      _viewer.setThemingColor(val.dbid, colorSelected);
                      setChildThemingColor(val.dbid, colorSelected);
                    }
                });

                vm.addData = vm.hebing(vm.addData,JSON.parse(data).pblist);
                this.addData.forEach(val=>{
                    val.percent = val.nowpercent;
                });
                let arrays = [];
                JSON.parse(data).statuslist.forEach((val,index) => {
                    if(val.id == JSON.parse(data).defaultstatus){
                        vm.form.state = [`${val.id}`]
                    };
                    let obj = {
                        value: val.id,
                        name: val.statusname,
                    };
                    arrays.push(obj);
                });
                this.states[0] = arrays;
                this.showconstr = false;//关掉模态框
            },
            subgoujian(){
                this.$refs.goujian.subgou();
            },
            openlists(){
                this.openlist = true;
                this.scroll = new BScroll(this.$refs.goujianlist,{click: true});
            },
            numbervalue(val,index){
                this.addData[index].percent = val;
            },
            hebing(arr1,arr2){
                for(var i = 0;i<arr1.length;i++){
                    for(var j = 0;j<arr2.length;j++){
                        if(arr1[i].id == arr2[j].id){
                            arr1.splice(i,1);
                        }
                    }
                }
                for(var i = 0;i<arr2.length;i++){
                    arr1.push(arr2[i]);
                }
                return arr1;
            },
        },
        mounted(){
            if(this.$store.state.environment==="dev"){
                this.img.push("https://i.loli.net/2017/08/21/599a521472424.jpg");
            }
        },
        computed:{
            qr(){
                return this.$store.state.QR;
            },
            modelproperty(){
                return this.$store.state.modelproperty;
            },
            changestates(){
                return this.$store.state.changestate;
            },
            selectlist(){
                return this.$store.state.selectlist;
            }
        },
        watch:{
            qr(val,old){
                 if(val != null) {
                    let vm = this;
                    mui.ajax({
                        url:`${vm.$store.state.serverIp}/task/getelebyqrcode/?token=`+vm.$store.state.sessionid,
                        type:"get",
                        data:{
                            qrcode:vm.$store.state.QR
                        },
                        success(res){
                            if(JSON.parse(res).issuc == 'true'){
                                vm.addqrdata(JSON.parse(res).element);
                            }
                        }
                    })
                    vm.$store.commit('clearQR'); 
                };
            },
            modelproperty:{
                handler(val,old){
                    if(val == null){
                        return;
                    }
                    let vm = this;
                    let goudata = JSON.parse(val);
                    let newarr = [];
                    let arrdata = {};
                    let obj = {
                        typetable:'构件',
                        relatedid:Number(goudata.id),
                    }
                    newarr.push(obj);
                    this.$store.commit('setchangestate',false);
                    if(goudata.type == "elelist"){
                        arrdata={
                            type:goudata.type,
                            elelist:JSON.stringify(newarr)
                        }
                    }else if(goudata.type == "dbIdslist"){
                        arrdata={
                            type:goudata.type,
                            _curUnitId:_curUnitId,
                            _curMajor:_curMajor,
                            dbIdslist:JSON.stringify(goudata.id)
                        }
                    }
                    mui.ajax({
                        type: "post",
                        url: `${serverIp}/task/goujian/transpblist/?token=`+vm.$store.state.sessionid,
                        data:arrdata,
                        cache: false,
                        success: function(data) {
                            vm.addData = vm.hebing(vm.addData,data.pblist);
                            vm.addData.forEach(val=>{
                                val.percent = val.nowpercent;
                            });
                            let arrays = [];
                            if(data.statuslist.length > 0){
                                data.statuslist.forEach((val,index) => {
                                    if(val.id == data.defaultstatus){
                                        vm.form.state = [`${val.id}`]
                                    };
                                    let obj = {
                                        value: val.id,
                                        name: val.statusname,
                                    };
                                    arrays.push(obj);
                                });
                                vm.states[0] = arrays;
                            }
                            vm.$store.commit('setchangestate',true);
                        },
                        error(res){
                            vm.$Message.error(res);
                        }
                    });
                    vm.$store.commit('setmodelproperty',null);
                },
                immediate: true,
                deep: true
            },
            'form.tabs':{
                deep: true,
                handler(value){
                    let vm = this;
                    console.log(value);
                    if(value.length == 0){
                        return;
                    };
                    mui.ajax({
                        url:`${vm.$store.state.serverIp}/task/getelestatuslist/?token=`+vm.$store.state.sessionid,
                        type:'POST',
                        data:{elelist:JSON.stringify(value)},
                        success(res){
                            if(res.statuslist.length===0){
                                vm.$Message.error('构件状态不统一，不能统一验收。');
                            }
                        }
                    })
                }
            },
            selectlist:{
                handler(val,old){
                    let vm = this;
                    let arrays = [];
                    let obj = {};
                    if(val == null){
                        return;
                    }
                    vm.addData = vm.hebing(vm.addData,val.pblist);
                    if(val.statuslist.length > 0){
                        val.statuslist.forEach((value,index) => {
                            if(value.id == val.defaultstatus){
                                vm.form.state = [`${value.id}`]
                            };
                            obj = {
                                value: value.id,
                                name: value.statusname,
                            };
                            arrays.push(obj);
                        });
                        vm.states[0] = arrays;
                    }
                },
                immediate: true,
                deep: true
            }
        }
    }
</script>