<style scoped lang="less">
   @import "../../less/quality/detailview.less";
</style>
<template>
    <div class="detailmain">
        <Card class="detailbox">
            <div class="detailbody">
                <span>构件编号【{{idstate[0]}}】 类型【{{idstate[1]}}】</span>
                <Steps :current="2" direction="vertical">
                    <Step v-for="item,index in processdata">

                        <div class="collapse">
                            <div class="colhead" @click="checkCol(index)">
                                <span class="headdis">{{item.statusname}}</span>
                                <span v-if="item.status_record == null" class="noinput">状态未录入</span>
                            </div>
                            <div class="colbox up">
                                <div class="detailpage" v-for="it,detailIndex in item.status_record">
                                    <Row>
                                        <Col span = "8" class="lines">
                                            <span class="expand-key">人员: </span>
                                            <span class="expand-value">{{it.actorname}}</span> 
                                        </Col>
                                        <Col span = "8" class="lines">
                                            <span class="expand-key">时间: </span>
                                            <span class="expand-value">{{changetime(it.time)}}</span> 
                                        </Col>
                                        <Col span = "8" class="lines">
                                            <span class="expand-key">完成百分比: </span>
                                            <span class="expand-value">{{it.percentage}}%</span> 
                                        </Col>
                                        <Col span = "24" class="lines1">
                                            <span class="expand-key">描述: </span>
                                            <span class="expand-value">{{it.description}}</span>
                                        </Col>
                                        <ul :id = "index" style="width: 100%;" >
                                                <li v-for="itimg,cindex in it.pbstatusdocuments" class="imgfile" v-if="itimg.filetype.indexOf('image')>=0">
                                                    <img :data-original="nowIp+'/'+itimg.filepath+itimg.name" :src="nowIp+'/'+itimg.filepath+itimg.name" @click="showNewImg(index)">
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
        <Spin fix v-if="loading"></Spin>
    </div>
</template>
<script>
    export default{
        props:[
        'idstate'
        ],
        data(){
            return{
                addimg:[],
                value1:null,
                issuedata:null,
                nowIp:this.$store.state.serverIp,
                operation:[],
                imgId:[],
                dealValue:null,
                processdata:[],
                loading:true
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
            openCr(){
                let that = this;
                navigator.camera.getPicture(function (imageData) {
                    this.addimg.push(imageData);
                    var imgdata = that.convertImgToBase64(imageData);
                    that.createUpload(imgdata);
                }, function (message) {
                    that.$Message.error(message);
                }, {  
                   quality: 50,  
                   destinationType: Camera.DestinationType.FILE_URI,  
                   encodingType: Camera.EncodingType.JPEG,  
                   sourceType: 2,
                   allowEdit:true,
                   MediaType:0
                })
            },
            createUpload(filestr) {
                let vm = this;
                let wt = plus.nativeUI.showWaiting();
                let task = plus.uploader.createUpload( vm.$store.state.serverIp + "/uploadfile_conc/", {
                        method: "POST",
                        blocksize: 204800,
                        priority: 100
                    },
                    function(t, status) {
                        if(status === 200) {
                            let responseObj = eval('(' + t.responseText + ')');
                            //JSON.parse()
                            plus.uploader.clear(true);
                            console.log(t.responseText);
                            vm.imgId.push(responseObj.docId);
                            console.log(imgId);
                            wt.close();
                        } else {
                            plus.uploader.clear(true);
                            wt.close();
                        }
                    }
                );
                task.addFile(filestr, {
                    key: 'Filedata'
                });
                task.start();
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
                let newImgId = vm.imgId.join(',');
                mui.ajax({
                    url:`${vm.$store.state.serverIp}/task/issue/dealissue/?issueId=${vm.$store.state.issueId}&operId=${operId}&feedback=${vm.dealValue}&Chuli_RelateFileList=${newImgId}&token=`+vm.$store.state.sessionid,
                    type:"get",
                    success:function(res){
                        if(res.issuc == "false") {
                            vm.$Message.error(res.error);
                        }else{
                            vm.$Message.success('处理成功');
                        }
                        
                    }
                })
            },
            changetime(time){
                let reg =/^\d{4}-\d{2}-\d{2}/;
                let reg1 =/\d{2}:\d{2}/;
                let r = time.match(reg);
                let r1 = time.match(reg1);
                return r+" "+r1;
            }
        },
        mounted(){
            let vm = this;
            mui.ajax({
                url:`${vm.$store.state.serverIp}/task/goujian/statusrecoreds/?pbid=${vm.$store.state.issueId}&_=1517991983633&token=`+vm.$store.state.sessionid,
                type:"get",
                success:function(res){
                        vm.processdata = res.statuslist;
                        vm.loading = false;
                    
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