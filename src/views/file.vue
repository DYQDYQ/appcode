<style scoped lang="less">
    @import "../less/all/animat.less";
</style>
<style lang="less">
    @import "../less/file.less";
</style>
<style type="text/css">
    .headimg{
        display: inline-block;
        
    }
    .filemain .ivu-tree ul li{
        margin:0px !important;
        position: relative;

    }
    .filemain .ivu-tree ul li .ivu-tree-arrow{
        position: absolute;
        cursor: pointer;
        width: 100%;
        text-align: left;
        z-index: 2;
    }
    .chosefile{
        background-color: #7C7479 !important;
        color: #fff !important;
    }
    .filemain .ivu-table-row-highlight td,.ivu-table-row-hover td{
        background-color: #7c7479 !important;
        color: #fff !important;
    }
    .showlock{
        visibility: visible !important;
    }
    .filebox{
        overflow-y: auto !important;
        overflow-x: hidden !important;
    }
    .filebox1{
        overflow-y: auto !important;
        overflow-x: hidden !important;
    }
</style>
<template>
    <div class="mains filemain">
        <div class="toolBars">
            <span class="titlehead">{{title}}</span>
        </div>
        <transition name="maindrawer">
            <Row class="main maindrawer" v-if="show">
                <i-col :span="7" class="filebox">
                    <div v-if="current.length===0" style="line-height: 30px">文件夹是空的~~</div>
                    <Tree :data="current" :load-data="loadData" :render="renderContent" @on-toggle-expand="loadchild"></Tree>            
                </i-col>
                <i-col :span="17" class="filebox1">
                    <!-- <img :src="src" v-if="img==='image'"> -->
                    <Table :height="tableheight" highlight-row ref="currentRowTable" size="small" :columns="filelists" :data="filedata" :loading="tableloading" @on-row-click="changetable"></Table>
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
                tableloading:true,
                current:[],
                checkindex:null,
                value1:null,
                value2:null,
                addfile:false,
                show:false,
                title:"资料",
                filedata:[],
                choseitem:'',
                tableheight:document.body.clientHeight - 47,
                filelists:[
                    {
                        title: '名称',
                        key: 'title',
                        width:350,
                        ellipsis:true,
                        render:(h,params) => {
                            return h('div',[
                                    h('div',{
                                        attrs:{
                                            class:`logos ${params.row.type}`,
                                        },
                                        style:{
                                            transform: 'scale(0.5,0.5)',
                                            marginLeft: '-16px',
                                            marginRight: "-10px",
                                        }
                                    }),
                                    h('span',{
                                        style:{
                                            verticalAlign:'middle'
                                        }
                                    },params.row.title)
                                ])
                        }
                    },
                    {
                        title: '修改于',
                        key: 'ts',
                        width:120,
                        ellipsis:true,
                    },
                    {
                        title: '备注',
                        key: 'remark',
                    },
                    {
                        title: '大小',
                        key: 'size',
                        width:80,
                        ellipsis:true,
                    }
                ]
            }
        },
        methods:{
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
            loadData(item,callback){
                let vm = this;
                let data = [];
                if(item.read == 0 && item.write == 0){
                    vm.$Message.warning('没有权限');
                    callback(data);
                }else{
                    vm.choseitem = item.hash;
                    vm.tableloading = true;
                    mui.ajax({
                        url: vm.$store.state.serverIp + "/task/ziliao/connector/?token="+vm.$store.state.sessionid,
                        data: {
                            cmd: 'open',
                            target: item.hash
                        },
                        success(res){
                            let filedata = res.files;
                                let file = [];
                                let rightfile = [];
                                filedata.forEach(t=>{
                                    if(t.name!=='根目录' && t.mime == 'directory'){
                                        file.push({
                                            title:t.name,
                                            hash:t.hash,
                                            loading:false,
                                            phash:t.phash,
                                            type:(mime=>{
                                                mime = mime.split('/');
                                                return mime[0]+(mime[0] != 'image' && mime[1] ? ' '+mime[1].replace(/(\.|\+)/g, '-') : '');
                                            })(t.mime),
                                            url:t.url,
                                            ts:vm.getNowFormatDate(t.ts),
                                            remark:t.remark,
                                            size:vm.changesize(t.size,t.mime),
                                            children:[],
                                            read:t.read,
                                            write:t.write
                                        })
                                    }
                                    if(t.name!=='根目录' && t.mime != 'directory'){
                                        rightfile.push({
                                            title:t.name,
                                            hash:t.hash,
                                            phash:t.phash,
                                            type:(mime=>{
                                                mime = mime.split('/');
                                                return mime[0]+(mime[0] != 'image' && mime[1] ? ' '+mime[1].replace(/(\.|\+)/g, '-') : '');
                                            })(t.mime),
                                            url:t.url,
                                            ts:vm.getNowFormatDate(t.ts),
                                            remark:t.remark,
                                            size:vm.changesize(t.size,t.mime),
                                            read:t.read,
                                            write:t.write
                                        })
                                    }
                                });
                                vm.filedata = file.concat(rightfile);
                                vm.tableloading = false;
                                data = file;
                                callback(data);
                        }
                    });
                }
                
                
            },
            loadchild(data){
                let vm = this;
                if(data.read == 0 && data.write == 0){
                    vm.$Message.warning('没有权限');
                    callback(data);
                }else{
                    vm.choseitem = data.hash;
                    mui.ajax({
                            url: vm.$store.state.serverIp + "/task/ziliao/connector/?token="+vm.$store.state.sessionid,
                            data: {
                                cmd: 'open',
                                target: data.hash
                            },
                            success(res){
                                let filedata = res.files;
                                    let file = [];
                                    let rightfile = [];
                                    filedata.forEach(t=>{
                                        if(t.name!=='根目录' && t.mime == 'directory'){
                                            file.push({
                                                title:t.name,
                                                hash:t.hash,
                                                phash:t.phash,
                                                loading:false,
                                                type:(mime=>{
                                                    mime = mime.split('/');
                                                    return mime[0]+(mime[0] != 'image' && mime[1] ? ' '+mime[1].replace(/(\.|\+)/g, '-') : '');
                                                })(t.mime),
                                                url:t.url,
                                                ts:vm.getNowFormatDate(t.ts),
                                                remark:t.remark,
                                                size:vm.changesize(t.size,t.mime),
                                                children:[],
                                                read:t.read,
                                                write:t.write
                                            })
                                        }
                                        if(t.name!=='根目录' && t.mime != 'directory'){
                                            rightfile.push({
                                                title:t.name,
                                                hash:t.hash,
                                                phash:t.phash,
                                                type:(mime=>{
                                                    mime = mime.split('/');
                                                    return mime[0]+(mime[0] != 'image' && mime[1] ? ' '+mime[1].replace(/(\.|\+)/g, '-') : '');
                                                })(t.mime),
                                                url:t.url,
                                                ts:vm.getNowFormatDate(t.ts),
                                                remark:t.remark,
                                                size:vm.changesize(t.size,t.mime),
                                                read:t.read,
                                                write:t.write
                                            })
                                        }
                                    });
                                    data.children = file;
                                    vm.filedata = file.concat(rightfile);
                                    vm.tableloading = false;
                            }
                    });
                }
                
            },
            getNowFormatDate(obj) {
                let newDate = new Date();
                newDate.setTime(obj * 1000);
                let nowDate = newDate.format("yyyy-MM-dd hh:mm");
                return nowDate;
            },
            changesize(val,type){
                if(type == 'directory'){
                    return ;
                };
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
            renderContent(h,{root, node, data}) {
                return h('span',{
                    style:{
                        display: 'inline-block',
                        width: '100%',
                        height: '20px',
                    },
                    'class':{
                        chosefile:this.choseitem == data.hash
                    }
                },[ 
                    h('span',[
                            h('div',{
                                attrs:{
                                    class:`logos ${data.type}`,
                                },
                                style:{
                                    transform: 'scale(0.5,0.5)',
                                    marginTop: '-15px',
                                    zIndex: '1'
                                }
                            }),
                            h('div',{
                                style:{
                                    display:'inline-block',
                                    textAlign: 'left',
                                    verticalAlign: "top",
                                    fontSize:"14px",
                                }
                            },data.title),
                            h('Icon',{
                                props:{
                                    type: 'android-lock',
                                },
                                style:{
                                    float: 'right',
                                    visibility: 'hidden',
                                    fontSize: '20px',
                                    marginRight: '16px',
                                },
                                'class':{
                                    showlock:data.write == 0 && data.read == 0,
                                }
                            })
                        ])
                ])
            },
            changetable(val){
                let vm = this;
                if(val.write == 0 && val.read == 0){
                    vm.$Message.warning('没有操作权限');
                }else if(val.type == 'directory'){
                    vm.tableloading = true;
                    vm.choseitem = val.hash;
                    mui.ajax({
                        url: vm.$store.state.serverIp + "/task/ziliao/connector/?token="+vm.$store.state.sessionid,
                        data: {
                            cmd: 'open',
                            target: val.hash
                        },
                        success(res){
                            let filedata = res.files;
                                let file = [];
                                let rightfile = [];
                                filedata.forEach(t=>{
                                    if(t.name!=='根目录' && t.mime == 'directory'){
                                        file.push({
                                            title:t.name,
                                            hash:t.hash,
                                            phash:t.phash,
                                            type:(mime=>{
                                                mime = mime.split('/');
                                                return mime[0]+(mime[0] != 'image' && mime[1] ? ' '+mime[1].replace(/(\.|\+)/g, '-') : '');
                                            })(t.mime),
                                            url:t.url,
                                            ts:vm.getNowFormatDate(t.ts),
                                            remark:t.remark,
                                            size:vm.changesize(t.size,t.mime),
                                            children:[],
                                            read:t.read,
                                            write:t.write
                                        })
                                    }
                                    if(t.name!=='根目录' && t.mime != 'directory'){
                                        rightfile.push({
                                            title:t.name,
                                            hash:t.hash,
                                            phash:t.phash,
                                            type:(mime=>{
                                                mime = mime.split('/');
                                                return mime[0]+(mime[0] != 'image' && mime[1] ? ' '+mime[1].replace(/(\.|\+)/g, '-') : '');
                                            })(t.mime),
                                            url:t.url,
                                            ts:vm.getNowFormatDate(t.ts),
                                            remark:t.remark,
                                            size:vm.changesize(t.size,t.mime),
                                            read:t.read,
                                            write:t.write
                                        })
                                    }
                                });
                                val.children = file;
                                vm.filedata = file.concat(rightfile);
                                vm.tableloading = false;
                                vm.openleft(val,vm.current,file);

                        }
                    });
                }else{
                    vm.$Message.success('打开'+val.title);
                    vm.src = vm.$store.state.serverIp + val.url + "?type=" + val.type; 
                    // cordova.InAppBrowser.open(vm.src,'_system','location=yes,toolbar=yes,toolbarposition=top,closebuttoncaption=yes');
                    cordova.InAppBrowser.open(vm.src,'_blank','location=yes,toolbar=yes,toolbarposition=top,EnableViewPortScale=yes');
                }
            },
            openleft(val,list,file){
                for(let i = 0;i<list.length;i++){
                    if(list[i].hash == val.phash){
                        for(var j = 0;j<list[i].children.length;j++){
                            if(list[i].children[j].hash == val.hash){
                                list[i].children[j].children = file;
                                list[i].children[j].expand = true;
                            }
                        }
                        list[i].expand = true;
                        return;
                    }else{
                        this.openleft(val,list[i].children,file);
                    }
                }
            }
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
                url:`${vm.$store.state.serverIp}/task/ziliao/connector/?cmd=open&target=1_dir&init=1&tree=1&token=`+vm.$store.state.sessionid,
                type:"GET",
                success(res){
                    let content = res.files;
                    let file = [];
                    content.forEach(t=>{
                        if(t.name!=='根目录' && t.mime == 'directory'){
                            file.push({
                                title:t.name,
                                loading: false,
                                hash:t.hash,
                                phash:t.phash,
                                type:(mime=>{
                                    mime = mime.split('/');
                                    return mime[0]+(mime[0] != 'image' && mime[1] ? ' '+mime[1].replace(/(\.|\+)/g, '-') : '');
                                })(t.mime),
                                url:t.url,
                                children: [],
                                read:t.read,
                                write:t.write
                            })
                        }
                    });
                    vm.current = file;
                    console.log(vm.current);
                    vm.tableloading = false;
                }
            })
        }
    };
</script>