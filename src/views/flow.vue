<style scope lang="less">
    @import "../less/flow.less";
</style>
<template>
    <div class="main">
        <Row>
            <i-col :span="6" style="background-color: white;z-index: 2">
                <ul class="race">
                    <li v-for="item,index in record" @click="handleClick(index,item)" :class="{active:index===activeIndex}">{{item.stepName}}</li>
                    <li :class="{active:isNaN(activeIndex)}" @click="operation = true;activeIndex = NaN">当前阶段</li>
                </ul>
            </i-col>
            <i-col :span="18">
                <transition name="leave">
                    <Form :label="80" style="padding: 12px;vertical-align: top;width: 100%;display: inline-block;position: absolute" v-if="operation">
                        <FormItem label="">
                            <ul style="display: inline-block">
                                <li v-if="detail.number">编号：{{detail.number}}</li>
                                <li v-if="detail.major">专业：{{detail.major}}</li>
                                <li v-if="detail.guanlianyuansudis">关联元素：{{detail.guanlianyuansudis}}</li>
                                <li v-if="detail.describe">描述：{{detail.describe}}</li>
                            </ul>
                        </FormItem>
                        <FormItem label="添加图片">
                            <Poptip  v-for="item,index in img" v-model="imgBool[index]">
                                <img :src="item" width="60" height="60" @click="showImg(item)">
                                <div slot="content">
                                    确认删除？
                                    <Button type="error" size="small" @click="handelImg(index,true)">是</Button>
                                    <Button type="success" size="small" @click="handelImg(index,false)">否</Button>
                                </div>
                            </Poptip >
                            <div class="addButton" @click="openCr" v-if="img.length<=3">
                                <Icon type="plus-round" style="width: 50px;height: 50px;vertical-align: middle;text-align: center;line-height: 50px;border: 1px solid #DDDEE0;"></Icon>
                            </div>
                        </FormItem>
                        <FormItem label="处理情况">
                            <Input type="textarea" v-model="feedback"/>
                        </FormItem>
                        <Button :loading="loading" @click="submit" type="error" long>提交</Button>
                    </Form>
                </transition>
                <transition name="leave">
                    <div v-if="!operation" class="history">
                        <ul v-for="a in historyDetail" :class="{update:update}" :key="a.comment">
                            <li>操作者：{{a.actorName}}</li>
                            <li>操作记录：{{a.comment}}</li>
                            <li>
                                <img v-for="b in a.imglist" :src="complete(b)" width="60" height="60" :alt="b.shortname" @click="showImg(complete(b))">
                            </li>
                        </ul>
                    </div>
                </transition>
            </i-col>
        </Row>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                type:this.$route.params.type,
                id:this.$route.params.id,
                detail:{
                    number:null,
                    major:null,
                    guanlianyuansudis:null,
                    describe:null
                },
                record:[],
                activeIndex:NaN,
                img:[],//链接
                docId:[],//ID
                imgBool:[false,false,false],
                operation:true,
                historyDetail:null,
                loading:false,
                feedback:'',
                update:false
            }
        },
        methods:{
            showImg(src){
                this.$Modal.info({
                    title:"查看图片",
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
                    }
                })
            },
            submit(){
              let vm = this;
              if(vm.feedback.length===0){
                  vm.$Message.error("请输入处理情况。");
                  vm.loading = false;
                  vm.$router.go(-1);
                  return
              }
              mui.ajax({
                  url:`${vm.$store.state.serverIp}/task/issue/dealissue/?token=`+vm.$store.state.sessionid,
                  data:{
                      issueId:vm.id,
                      feedback:vm.feedback,
                      operId:1,///todo 确定操作ID
                      Chuli_RelateFileList:vm.docId.toString()
                  },
                  success(res){
                      if(res.issuc){
                          vm.$Notice.success({
                              title:"提交成功。"
                          });
                          vm.loading = false;
                          vm.$router.go(-1);
                      } else {
                          vm.$Notice.error({
                              title:"提交失败，请检查网络后再试。"
                          });
                          vm.loading = false;
                      }
                  },
                  error(){
                      vm.$Notice.error({
                          title:"提交失败，请检查网络后再试。"
                      });
                      vm.loading = false;
                  }
              })
            },
            handleClick(index,item){
                let vm = this;
                vm.operation = false;
                if(vm.activeIndex!==index){
                    vm.update = true;
                    setTimeout(()=>{
                        vm.update = false
                    },300)
                }
                vm.activeIndex = index;
                vm.historyDetail = item.operationRecord;
            },
            openCr(){
                let sorce = this.$store.state.serverIp;
                let vm = this;
                let w = window;
                var cmra = plus.camera.getCamera();
                cmra.captureImage(function(p) {
                    plus.io.resolveLocalFileSystemURL(p, function(entry) {
                        plus.zip.compressImage({
                            src: entry.fullPath,
                            dst: "_doc/barcode/",
                            overwrite: true, //覆盖
                            quality: 50,
                        }, function(event) {
                            //alert(JSON.stringify(event));
                            vm.img.push(event.target);
                            vm.createUpload(event.target)
                        }, function(error) {
                        });
                    }, function() {
                    });
                }, function(e) {
                    console.log(e.message);
                }, {
                    filename: "_doc/camera/"
                });
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
                            vm.docId.push(responseObj.docId);
                            wt.close();
                        } else {
                            //callerrorback('图片上传失败');
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
            handelImg(index,bool){
                this.imgBool = [false,false,false];
                if(bool){
                    this.img.splice(index,1)
                }
            },
            complete(src){
                return `${this.$store.state.serverIp}/${src.filepath}/${src.name}`
            }
        },
        mounted(){
            let vm = this;
            mui.ajax({
                url:`${vm.$store.state.serverIp}/task/issue/dealconfig/?token=`+vm.$store.state.sessionid,
                data:{
                    issueId:vm.id
                },
                success(res){
                    if(res.issuc==='true'){
                        vm.detail = res.issue
                    } else {
                        //alert(JSON.stringify(res));
                        vm.$Notice.error({
                            title:"服务器故障，请稍后再试"
                        })
                    }
                },
                error(){
                    if(vm.$store.state.environment==='dev'){
                        let  res = {
                            "StepOperation": [
                                {
                                    "id": 0,
                                    "name": "结束"
                                }
                            ],
                            "issuc": "true",
                            "RelateFormList": [
                                {
                                    "type": "biaodan",
                                    "id": 14,
                                    "name": "质量整改单"
                                }
                            ],
                            "issue": {
                                "issave": "False",
                                "major": "混凝土结构",
                                "stepid": 33,
                                "issueId": 10,
                                "dangqianjieduan": {
                                    "color": "#008040",
                                    "jianduan": "已结束"
                                },
                                "describe": "1211312321",
                                "dangqianbuzhou": "结束",
                                "number": "ZL-1704260947-9",
                                "faqishijian": "2017-04-26 09:48:17",
                                "isendstep": false,
                                "guanlianyuansudis": "构件:Steel Assembly,构件:Steel Assembly",
                                "RelateElement": [
                                    {
                                        "info": "构件:Steel Assembly",
                                        "typetable": "构件"
                                    },
                                    {
                                        "info": "构件:Steel Assembly",
                                        "typetable": "构件"
                                    }
                                ],
                                "deadline": "2017-04-28",
                                "faqiren": "潘古兵",
                                "defaultcomment": "",
                                "priority": "轻微"
                            }
                        };
                        vm.detail = res.issue
                    } else {
                        vm.$Notice.error({
                            title:"网络故障，请稍后再试"
                        })
                    }
                }
            });
            mui.ajax({
                url:`${vm.$store.state.serverIp}/task/issue/issuetrace/?token=`+vm.$store.state.sessionid,
                data:{
                    issueId:vm.id
                },
                success(res){
                    if(res.res==='sucess'){
                        vm.record = res.eventStepsRecord
                    } else {
                        alert(JSON.stringify(res));
                        vm.$Notice.error({
                            title:"服务器故障，请稍后再试"
                        })
                    }
                },
                error(){
                    if(vm.$store.state.environment==='dev'){
                        let  res = {
                            "res": "sucess",
                            "eventStepsRecord": [
                                {
                                    "projectevent_id": 10,
                                    "stepName": "发起问题",
                                    "relatedform_id": null,
                                    "id": 24,
                                    "formfile_id": null,
                                    "starttime": 1493171297,
                                    "operationRecord": [
                                        {
                                            "comment": "1211312321",
                                            "imglist": [],
                                            "eventstep_id": 24,
                                            "voiceList": [],
                                            "oprtime": 1493171298,
                                            "flowstepoper_id": null,
                                            "actorName": "潘古兵",
                                            "doclist": [],
                                            "id": 20,
                                            "actor_id": 2
                                        }
                                    ],
                                    "endtime": 1493171298,
                                    "flowstep_id": 30
                                },
                                {
                                    "projectevent_id": 10,
                                    "stepName": "处理问题",
                                    "relatedform_id": 14,
                                    "id": 25,
                                    "formfile_id": null,
                                    "starttime": 1493171298,
                                    "operationRecord": [
                                        {
                                            "comment": "dsfsfdsfdssfs",
                                            "operaName": "处理",
                                            "imglist": [
                                                {
                                                    "remark": null,
                                                    "name": "微信图片_2017050308594720170503150146_80.png",
                                                    "filepath": "upload/根目录/质量管理/质量整改单/ZL-1704260947-9/",
                                                    "filetype": "image/png",
                                                    "doctype": "normal",
                                                    "id": 78,
                                                    "creator_id": 2,
                                                    "version": null,
                                                    "filesize": 3044,
                                                    "shortname": "微信图片_20170503085947.png",
                                                    "createtime": 1493794907,
                                                    "previewfile": null
                                                }
                                            ],
                                            "eventstep_id": 25,
                                            "voiceList": [],
                                            "oprtime": 1493794908,
                                            "flowstepoper_id": 2,
                                            "actorName": "潘古兵",
                                            "doclist": [],
                                            "id": 32,
                                            "actor_id": 2
                                        }
                                    ],
                                    "endtime": 1493794908,
                                    "flowstep_id": 31
                                },
                                {
                                    "projectevent_id": 10,
                                    "stepName": "关闭问题",
                                    "relatedform_id": null,
                                    "id": 59,
                                    "formfile_id": null,
                                    "starttime": 1494050440,
                                    "operationRecord": [
                                        {
                                            "comment": "发士大夫撒旦",
                                            "operaName": "关闭问题",
                                            "imglist": [],
                                            "eventstep_id": 59,
                                            "voiceList": [],
                                            "oprtime": 1494050440,
                                            "flowstepoper_id": 3,
                                            "actorName": "潘古兵",
                                            "doclist": [],
                                            "id": 52,
                                            "actor_id": 2
                                        }
                                    ],
                                    "endtime": 1494050440,
                                    "flowstep_id": 32
                                }
                            ]
                        };
                        vm.record = res.eventStepsRecord
                    } else {
                        vm.$Notice.error({
                            title:"网络故障，请稍后再试"
                        })
                    }
                }
            })
        }
    }
</script>