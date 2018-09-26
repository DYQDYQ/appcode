<style scoped lang="less">
   @import "../../less/quality/detailview.less";
</style>
<style type="text/css">
    /*.detailbox .ivu-card-head{
        border-bottom: 0px solid #e3e8ee !important;
    }*/
    .deleteit{
        position: absolute;
        top: -12px;
        right: -1px;
        display: inline-block;
        width: 10px;
        height: 10px;
        font-size: 18px;
    }
    .camermodal .ivu-modal-body{
        padding: 0px !important;
    }
    .opencamer{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
    }
    .opencamer div{
        width: 100%;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #e9eaec;
        text-align: center;
        font-size: 14px;
    }
    .opencamer div:last-child{
        border-bottom: 0px solid #999;
    }
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 0;
        }
    }
    .imgfile{
        width: 100px !important;
        height: 100px !important;
        overflow: hidden !important;
        margin: 10px;
        background: #dddee1;
        text-align: center;
    }
    .imgfile img{
        height: 100% !important;
    }
</style>
<template>
    <div class="detailmain">
        <Card class="detailbox">
            <Row slot="title" class="detailhead">
                <Col span="24" class="lines lineshead borderbottom">
                    <span class="expand-key">编号: </span>
                    <span class="expand-value">{{detailrow.number}}</span>
                </Col>
                <Col span="12" class="lines borderbottom bacbottom">
                    <span class="expand-key">发起人: </span>
                    <span class="expand-value">{{detailrow.faqiren}}</span>
                </Col>
                <Col span="12" class="lines borderbottom bacbottom">
                    <span class="expand-key">发起时间: </span>
                    <span class="expand-value">{{detailrow.faqishijian}}</span>
                </Col>
                <Col span="12" class="lines borderbottom">
                    <span class="expand-key">结束时间: </span>
                    <span class="expand-value">{{detailrow.deadline}}</span>
                </Col>
                <Col span="12" class="lines borderbottom">
                    <span class="expand-key">当前状态: </span>
                    <span class="expand-value">{{detailrow.dangqianjieduan.jianduan}}</span>
                </Col>
                <Col span="12" class="lines borderbottom bacbottom">
                    <span class="expand-key">专业: </span>
                    <span class="expand-value">{{detailrow.major}}</span>
                </Col>
                <Col span="12" class="lines borderbottom bacbottom">
                    <span class="expand-key">优先级: </span>
                    <span class="expand-value">{{detailrow.priority}}</span>
                </Col>
                <Col span="24" class="lines1 borderbottom">
                    <span class="expand-key">关联元素: </span>
                    <span class="expand-value">{{detailrow.guanlianyuansudis}}</span>
                </Col>
                <Col span="24" class="lines1 borderbottom bacbottom">
                    <span class="expand-key">负责人: </span>
                    <span class="expand-value">{{detailrow.dangqianfuzeren}}</span>
                </Col>
                 <Col span="24" class="lines1 borderbottom">
                    <span class="expand-key">备注: </span>
                    <span class="expand-value">{{detailrow.describe}}</span>
                </Col>
                <Col span="24" class="lines1" v-if="detailrow.dangqianjieduan.jianduan != '已结束'">
                    <span class="expand-key">处理意见: </span>
                    <span class="expand-value">
                        <Input v-model="dealValue" size="large" type="textarea" :rows="4"></Input>
                    </span>
                </Col>
                <Col span="24" class="lines1" v-if="detailrow.dangqianjieduan.jianduan != '已结束'">
                    <span class="expand-key">上传图片: </span>
                    <span class="expand-value">
                        <ul>
                            <li v-for="item,index in addimg" style="float:left;margin-right: 10px;position: relative">
                                <img :src="item" width="60" height="60" @click="showImg(item,index)" :key="item">
                                <span @click="deleteimg(index)" class="deleteit">
                                    <Icon type="close-circled"></Icon>
                                </span>
                            </li>
                        </ul>
                        
                        <div class="addButton" @click="opencam = true">
                            <Icon type="plus-round"></Icon>
                        </div>
                    </span>
                </Col>

                <Col span="24" class="lines1 submitline" v-if="detailrow.dangqianjieduan.jianduan != '已结束'">
                    <Button type="error" class="submitlinebu" v-for="it in operation" @click="dealButton(it.id,detailrow.needfile)">{{it.name}}</Button>
                </Col>
                
            </Row>
            <div class="detailbody">
                <span>审核流程</span>
                <Steps :current="2" direction="vertical">
                    <Step v-for="item,index in processdata">

                        <div class="collapse">
                            <div class="colhead" @click="checkCol(index)">
                                {{item.stepName}}
                            </div>
                            <div class="colbox up">
                                <div class="detailpage" v-for="it,detailIndex in item.operationRecord">
                                    <Row>
                                        <Col span = "8" class="lines">
                                            <span class="expand-key">人员: </span>
                                            <span class="expand-value">{{it.actorName}}</span> 
                                        </Col>
                                        <Col span = "8" class="lines">
                                            <span class="expand-key">操作: </span>
                                            <span class="expand-value">{{it.operaName}}</span> 
                                        </Col>
                                        <Col span = "8" class="lines">
                                            <span class="expand-key">时间: </span>
                                            <span class="expand-value">{{it.oprtime}}</span> 
                                        </Col>
                                    <!-- <Col span = "24">
                                        <span class="expand-key">意见: </span>
                                        <span class="expand-value">{{item.opinion}}</span>
                                    </Col> -->
                                        <Col span = "24" class="lines1">
                                            <span class="expand-key">备注: </span>
                                            <span class="expand-value">{{it.comment}}</span>
                                        </Col>
                                        <Col span = "24">
                                            <span class="expand-key">相关文件: </span>
                                            <span class="expand-value">{{item.doclist}}</span>
                                        </Col>
                                        <ul :id = "index" style="width: 100%;" >
                                                <li v-for="itimg,cindex in it.imglist" class="imgfile">
                                                    <img :data-original="nowIp+'/'+itimg.filepath+itimg.name" :src="nowIp+'/'+itimg.filepath+itimg.name" @click="showNewImg(index)">
                                                    <!-- <div :data-original="nowIp+'/'+itimg.filepath+itimg.name" :style="{background: 'url('+`'${nowIp}/${itimg.filepath}${itimg.name}'`+')'}" @click="showNewImg(index)" class="imgbac"></div> -->
                                                    
                                                </li>
                                        </ul>
                                        
                                    </Row>
                                </div>
                            </div>
                        </div>
                        
                    </Step>
                </Steps>
            </div>
        </Card>
        <Modal  
                :closable="false"
                :mask-closable="false"
                width="300"
                v-model="opencam"
                class="camermodal">
                <div class="opencamer">
                    <div @click="openCr(1);opencam = false">拍照上传</div>
                    <div @click="openCr(2)">从相册选择</div>
                </div>
            <div slot="footer">
                <Button type="error" size="large" @click="opencam = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    export default{
        props:[],
        data(){
            return{
                addimg:[],
                value1:null,
                issuedata:null,
                opencam:false,
                detailrow:{
                    dangqianjieduan:{}
                },
                nowIp:this.$store.state.serverIp,
                operation:[],
                imgId:[],
                dealValue:null,
                processdata:[]
            }
        },
        methods:{
            showImg(src,index){
                let vm = this;
                vm.$Modal.confirm({
                    render(r){
                        return r(
                            'img',
                            {
                                attrs:{
                                    src,
                                },
                                style:{
                                    width:"350px"
                                },
                            }
                        )
                    },
                    cancelText:"删除",
                    onCancel(){
                        vm.addimg.splice(index,1)
                    }
                })
            },
            showNewImg(uiId){
               var viewer = new Viewer(document.getElementById(uiId), {
                    url: 'data-original',
                    navbar: false,
                    movable: false,
                });
            },
            openCr(where){
                let that = this;
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
                    popoverOptions: new CameraPopoverOptions(400,300,100,100,Camera.PopoverArrowDirection.ARROW_ANY),
                })
            },
            Upload(fileurl) {
                let vm = this;
                let success = function(r){
                    let newdata = JSON.parse(r.response);
                    vm.addimg.push(fileurl);
                    vm.imgId.push(newdata.docId);
                    vm.$Message.success("上传图片上传成功");
                    vm.opencam = false;
                };
                let fail = function(error){
                    vm.$Message.error("上传图片失败,请重新上传");
                    vm.opencam = false;
                };
                let options = new FileUploadOptions();
                options.fileKey = "Filedata";  
                options.fileName = fileurl.substr(fileurl.lastIndexOf('/') + 1);
                options.httpMethod = "POST"; 

                let ft = new FileTransfer();
                let SERVER = vm.$store.state.serverIp+"/uploadfile_conc/?token="+vm.$store.state.sessionid;
                ft.upload(fileurl,encodeURI(SERVER),success,fail,options);
            },
            checkCol(it) {
                if($(".colbox").eq(it).hasClass("up")){
                    $(".colbox").eq(it).slideUp(300).removeClass("up");

                }else{
                    $(".colbox").eq(it).slideDown(300).addClass("up");
                }
            },
            dealButton(operId,needfile){
                let vm = this;
                if(vm.dealValue == ''){
                    this.$Message.warning('处理意见不能为空！');
                    return;
                };
                if(needfile){
                    if(vm.imgId.length == 0) {
                        this.$Message.warning('请添加附件');
                        return;
                    }
                };
                 let newImgId = vm.imgId.join(',')+',';
                mui.ajax({
                    url:`${vm.$store.state.serverIp}/task/issue/dealissue/?issueId=${vm.$store.state.issueId}&operId=${operId}&feedback=${vm.dealValue}&Chuli_RelateFileList=${newImgId}&token=`+vm.$store.state.sessionid,
                    type:"get",
                    success:function(res){
                        if(res.issuc == "false") {
                            vm.$Message.error(res.error);
                        }else{
                            vm.$Message.success('处理成功');
                            vm.$store.commit('setbaclevel',false);
                        }
                        
                    }
                })
            },
            deleteimg(index){
                    this.addimg.splice(index,1);
                    this.imgId.splice(index,1);
            },
        },
        mounted(){
            let vm = this;
            if(vm.$store.state.environment==="dev"){
                vm.addimg.push("https://i.loli.net/2017/08/21/599a521472424.jpg");
            }
            mui.ajax({
                url:`${vm.$store.state.serverIp}/task/issue/dealconfig/?issueId=${vm.$store.state.issueId}&_=1517991983633&token=`+vm.$store.state.sessionid,
                type:"get",
                success:function(res){
                        vm.detailrow = res.issue;
                        vm.dealValue = vm.detailrow.defaultcomment;
                        vm.operation = res.StepOperation;
                    
                }
            });
            mui.ajax({
                url:`${vm.$store.state.serverIp}/task/issue/issuetrace/?issueId=${vm.$store.state.issueId}&token=`+vm.$store.state.sessionid,
                type:"get",
                success:function(res){
                    console.log(res);
                    if(res.res == "sucess") {
                        vm.processdata = res.eventStepsRecord;
                    }
                }
            });
            
        },
        computed:{
            // issueId(){
            //     return this.$store.state.issueId;
            // }
        },
        watch:{

        }
    }
</script>