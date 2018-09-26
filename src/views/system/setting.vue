<style scoped lang="less">
    @import "../../less/system/setting.less";
    @import "../../less/all/animat.less";
</style>
<template>
    <div class="mains">
        <div class="toolBars">
            <span class="titlehead">{{title}}</span>
        </div>
        <transition name="maindrawer">
            <div class="main maindrawer" v-if="show">
            <div class="user">
                <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" class="avatar"/>
                <span>
                    {{userName}}
                </span>
            </div>
<!--             <ul class="operation">
                <li class="clear-fix">
                    非WiFi环境下载提示
                    <i-switch  v-model="download" class="after">
                        <span slot="open">开</span>
                        <span slot="close">关</span>
                    </i-switch>
                </li>
                <li class="clear-fix" @click="clearCache">
                    清除缓存
                    <span class="after">{{cache}}</span>
                </li>
                <li class="clear-fix" @click="changeProject">
                    切换项目
                </li>
            </ul> -->
            <ul class="operation" style="margin-top: 16px;">
                <li class="clear-fix" @click="checkUpdate">
                    版本更新
                    <span class="after">当前版本：1.0.0</span>
                </li>
                <li class="clear-fix">
                    关于我们
                    <span class="after"><Icon type="chevron-right"></Icon></span>
                </li>
                <li class="clear-fix" @click="callback">
                    意见反馈
                    <span class="after"><Icon type="chevron-right"></Icon></span>
                </li>
            </ul>
            <Button type="error" long :loading="loading" @click="logout" style="margin-top: 16px;">退出登录</Button>
            <Modal
                    v-model="modal"
                    @on-ok="asyncOK"
                    oktext="确认退出">
                <p>确定退出登录？</p>
            </Modal>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                download:false,
                loading:false,
                modal:false,
                cache:0,
                suggest:null,
                title:"系统管理",
                show:false,
            }
        },
        methods:{
            checkUpdate(){
                // let a = plus.nativeUI.showWaiting("正在查询更新......");
                setTimeout(()=>{
                    a.close()
                },500)
            },
            callback(){
                let vm = this;
                vm.$Modal.confirm({
                    title:"意见反馈",
                    render(h){
                        return h("Input",
                            {
                                props:{
                                    type:"textarea",
                                    placeholder:"请输入意见",
                                    rows:3
                                },
                                model: {
                                    value: vm.suggest,
                                    callback(t) {
                                        vm.suggest = t
                                    },
                                    expression: "suggest"
                                }
                            })
                    },
                    loading:true,
                    onOk(){
                        setTimeout(()=>{
                            vm.$Modal.remove();
                            vm.suggest = null;
                            // plus.nativeUI.alert('您好,您反馈的问题我们已经收到,我们正在积极的处理,会尽快给您答复。')
                        },500)
                    }
                })
            },
            clearCache(){
                let vm = this;
                let [u,p,s] = [ localStorage.user,localStorage.password,localStorage.state];
                // plus.nativeUI.confirm("清除缓存？", function (event) {
                //     let index = event.index;
                //     if(index===0){
                //         let a = plus.nativeUI.showWaiting();
                //         plus.cache.clear( function () {
                //             plus.nativeUI.alert( "缓存已清除", ()=>{
                //                 plus.cache.calculate(( size )=>{
                //                     let sizer = ['byte','KB','MB','GB'];
                //                     let count = 0;
                //                     while (size>=1000){
                //                         size = size/1000;
                //                         count++
                //                     }
                //                     vm.cache = size.toFixed(2) + sizer[count];
                //                     a.close();
                //                     [ localStorage.user,localStorage.password,localStorage.state] = [u,p,s];
                //                 });
                //             }, "OK" );
                //         });
                //     }
                // });
            },
            logout(){
                this.modal = true;
            },
            asyncOK(){
                let vm = this;
                vm.loading = true;
                mui.ajax({
                    url:`${vm.$store.state.serverIp}/wslogout/?token=`+vm.$store.state.sessionid,
                    success(res){
                        vm.loading = false;
                        vm.$Message.info("登出成功");
                        localStorage.state = null;
                        _viewer.finish();
                        localStorage.nowmodel = '';
                        localStorage.belongmodel = "";
                        vm.$router.push("/");
                    }
                })
            },
            changeProject(){
                this.$router.push({path: '/select'});
            }
        },
        computed:{
            userName(){
                return this.$store.state.name?this.$store.state.name.name:"加载中...";
            }
        },
        mounted(){
            let vm = this;
            vm.$nextTick(function(){
                vm.show = true;
            })
        }
    }
</script>