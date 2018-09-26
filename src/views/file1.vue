<style scoped lang="less">
    @import "../less/all/animat.less";
</style>
<style lang="less">
    @import "../less/file.less";
</style>
<style type="text/css">
    .elfinder-cwd-select,.elfinder-cwd-selectall{
        visibility: hidden;
    }
    .headimg{
        display: inline-block;
        
    }
</style>
<template>
    <div class="mains">
        <div class="toolBars">
<!--             <div class="filesearch" style="border-left: 0px">
                <Input v-model="value1" placeholder="搜索" icon="ios-search" ></Input>  
            </div>
            <label @click="addfile=true" style="border-left: 0px">
                    <Icon class="addicon" type="ios-plus-outline"></Icon>
            </label> -->
            <span class="titlehead">{{title}}</span>
        </div>
        <transition name="maindrawer">
            <Row class="main maindrawer" v-if="show">
                <i-col :span="7" class="filebox">
<!--                     <div class="filehead" v-if="path.length>1">
                        <div class="filebac" @click="change(1,'back');checkindex=null">
                            <Icon class="bacicon" type="arrow-return-left"></Icon>
                        </div>     
                    </div> -->
                    <Modal v-model="addfile" title="新建文件夹" :closable="false">
                        <div tyle="text-align:center">
                             <Input v-model="value2" placeholder="新建文件夹名称" style="height:30px;"></Input>
                        </div>
                        <div slot="footer">
                            <Button  size="small" @click="addfile=false">取消</Button>
                            <Button type="error" size="small" @click="addfile=false">确定</Button>
                        </div>
                    </Modal>
                    <div class="fileList">
                        <div v-if="current.length===0" style="line-height: 30px">文件夹是空的~~</div>
                        <div class="listbody" v-for="(item,index) in current">
                            <div class="items" @click="change(item.type,item.hash,item.url,$event);checkindex=null">
                                <div class="logos" :class="item.type"></div>
                                <div class="itemtime">
                                    <div>{{item.name}}</div>
                                    <div>{{getNowFormatDate(item.ts)}}</div>
                                </div>

                            </div>
<!--                             <span class="checkitem" @click="check(index)">
                                <Icon v-show="index == checkindex" type="chevron-down"></Icon>
                                <Icon v-show="index !== checkindex" type="chevron-up"></Icon>
                            </span> -->
                             <span class="checkitem" style="right: 20px;width: 10px">
                                <Icon type="chevron-right"></Icon>
                            </span>
                            <div class="showcheckitem" v-if="index == checkindex">
                               <div>
                                    <Icon type="ios-upload-outline"></Icon>
                                    <p>上传文件</p>
                               </div> 
                               <div>
                                    <Icon type="ios-trash-outline"></Icon>
                                    <p>删除</p>
                               </div> 
                               <div>
                                    <Icon type="more"></Icon>
                                    <p>更多</p>
                               </div> 
                            </div>
                        </div>
                    </div>            
                </i-col>
                <i-col :span="17" class="filebox1">
                    <!-- <img :src="src" v-if="img==='image'"> -->
                    <Table size="small" :columns="filelists" :data="filedata" :loading="loading"></Table>
                </i-col> 
            </Row>
        </transition>
    </div>
    
</template>
<script>
    export default {
        data(){
            return {
                path:['36_dir'],
                fs:null,
                src:'https://i.loli.net/2017/10/30/59f6f7eee90e7.png?type=image',
                loading:false,
                current:[],
                checkindex:null,
                value1:null,
                value2:null,
                addfile:false,
                show:false,
                title:"资料",
                filedata:[],
                filelists:[
                    {
                        title: '名称',
                        key: 'name',
                        render:(h,params) => {
                            return h('div',[
                                    h('div',{
                                        attrs:{
                                            class:`logos ${params.row.type}`,
                                        },
                                        style:{
                                            transform: 'scale(0.4,0.4)',

                                        }
                                    }),
                                    h('span',params.row.name)
                                ])
                        }
                    },
                    {
                        title: '修改于',
                        key: 'ts',
                    },
                    {
                        title: '备注',
                        key: 'remark',
                    },
                    {
                        title: '大小',
                        key: 'size',
                        width:'80'
                    }
                ]
            }
        },
        methods:{
            change(type,hash,url,e,where){
                let vm = this;
                try{
                    document.getElementsByClassName("listActive")[0].classList.remove("listActive");
                }
                catch(a){
                    console.log(1);
                }
                if(hash==='back'){
                    vm.path.pop();
                    let target = vm.path[vm.path.length-1];
                    vm.loading = true;
                    mui.ajax({
                        url: vm.$store.state.serverIp + "/task/ziliao/connector/?token="+vm.$store.state.sessionid,
                        data: {
                            cmd: 'tree',
                            target
                        },
                        success(res) {
                            let filedata = res.tree;
                            let file = [];
                            filedata.forEach(t=>{
                                if(t.name!=='根目录'){
                                    file.push({
                                        name:t.name,
                                        hash:t.hash,
                                        phash:t.phash,
                                        type:(mime=>{
                                            mime = mime.split('/');
                                            return mime[0]+(mime[0] != 'image' && mime[1] ? ' '+mime[1].replace(/(\.|\+)/g, '-') : '');
                                        })(t.mime),
                                        url:t.url,
                                        ts:vm.getNowFormatDate(t.ts),
                                        remark:t.remark,
                                        size:vm.changesize(t.size),
                                    })
                                }
                            });
                            vm.filedata = file;
                            vm.loading = false;
                        }
                    });
                    return
                }
                if(hash.indexOf("dir")!==-1){
                    vm.path.push(hash);
                    mui.ajax({
                        url: vm.$store.state.serverIp + "/task/ziliao/connector/?token="+vm.$store.state.sessionid,
                        data: {
                            cmd: 'tree',
                            target: hash
                        },
                        success(res) {
                            let content = res.tree;
                            let file = [];
                            content.forEach(t=>{
                                if(t.name!=='根目录'){
                                    file.push({
                                        name:t.name,
                                        hash:t.hash,
                                        phash:t.phash,
                                        type:(mime=>{
                                            mime = mime.split('/');
                                            return mime[0]+(mime[0] != 'image' && mime[1] ? ' '+mime[1].replace(/(\.|\+)/g, '-') : '');
                                        })(t.mime),
                                        url:t.url,
                                        ts:vm.getNowFormatDate(t.ts),
                                        remark:t.remark,
                                        size:vm.changesize(t.size),
                                    })
                                }
                            });
                            vm.filedata = file;
                        }
                    })
                } else {
                    vm.src = vm.$store.state.serverIp + url + "?type=" + type;
                    let element = e.currentTarget;
                    element.classList.add('listActive');
                    console.log(vm.src);
                    cordova.InAppBrowser.open(vm.src,'_blank','location=yes,toolbar=yes,toolbarposition=top,closebuttoncaption=yes');
                }
            },
            check(number) {
               var that = this;
               this.current.forEach((value,index) => {
                    if(number == index) {
                        if(that.checkindex != number) {
                           that.checkindex = number; 
                       }else {
                            that.checkindex = null;
                       }
                        
                    }  
               }) 
            },
            getNowFormatDate(obj) {
                let newDate = new Date();
                newDate.setTime(obj * 1000);
                let nowDate = newDate.format("yyyy-MM-dd hh:mm");
                return nowDate;
            },
            changesize(val){
                if(val<1024){
                    return val+'b';
                }else if(val<1048576 && val>=1024){
                    return  Math.round(val/1024) + 'Kb';
                }else if(val>=1028576 && val < 1073741824){
                    return (val/1028576).toFixed(2) + 'Mb';
                }else{
                    return (val/1073741824).toFixed(2) + 'Gb';
                }
            },
        },
        computed:{
            img(){
                let extension = this.src;
                return extension.substring(extension.indexOf("?type=") + 6);
            },
            state(){
                return this.$store.state.hideSideBar;
            }
        },
        watch:{
            src(URL){
                let extension = this.src;
                const type = extension.substring(extension.indexOf("?type=") + 6);
                // if(type.indexOf('image')===-1){
                //     let web =  plus.webview.getWebviewById( 'pdf' );
                //     web.loadURL((url=>{
                //         return url.split("?type=")[0]
                //     })(URL));
                //     web.show()
                // } else {
                //     plus.webview.hide( "pdf");
                // }
            },
            state(state){
                let extension = this.src;
                const type = extension.substring(extension.indexOf("?type=") + 6);
                // if(!state){
                //     plus.webview.hide( "pdf");
                // } else {
                //     if(type.indexOf('image')===-1){
                //         let web =  plus.webview.getWebviewById( 'pdf' );
                //         web.show()
                //     }
                // }
            }
        },
        mounted(){
            let vm = this;
            this.$nextTick(function(){
                vm.show = true;
            });
            mui.ajax({
                url:vm.$store.state.serverIp+"/task/ziliao/connector/?token="+vm.$store.state.sessionid,
                data:{
                    cmd:'tree',
                    target:'36_dir'
                },
                success(res){
                    let content = res.tree;
                    let file = [];
                    content.forEach(t=>{
                        if(t.name!=='根目录'){
                            file.push({
                                name:t.name,
                                hash:t.hash,
                                phash:t.phash,
                                type:(mime=>{
                                    mime = mime.split('/');
                                    return mime[0]+(mime[0] != 'image' && mime[1] ? ' '+mime[1].replace(/(\.|\+)/g, '-') : '');
                                })(t.mime),
                                url:t.url,
                                ts:t.ts,
                            })
                        }
                    });
                    vm.current = file;
                    console.log(vm.current);
                    vm.loading = false;
                }
            })
        }
    };
</script>