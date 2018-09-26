<style scoped lang="less">
    @import "../../less/all/animat.less";
</style>
<style scoped>
    .index {
        width: 1024px;
        height: 733px;
        margin: 0 auto;
        padding:10px 20px;
    }
    .block{
        display: inline-block;
        width: 10px;
        height: 10px;
        background-color: #328AC6;
    }
    .title{
        font-size: 18px;
    }
    .ivu-switch-checked{
        background-color: #D44C57;
        border: 1px solid #D44C57;
    }
    .small-title{
        font-size: 16px;
        color: #328AC6;
        margin-left: 10px;
    }
    .pull-right{
        float: right;
        margin-right: 72px;
    }
    .header{
        width: 100%;
        margin-bottom: 10px;
    }
    .c-content{
        width: 100%;
        margin-top: 10px;
        position: relative;
        border:2px solid #EFEFEF;
        height: 290px;
    }
    .c-content img{
        width: 100%;
        height: 100%;
    }
    .remark{
        min-height: 60px;
        border-left:1px solid #e9eaec;
        border-right:1px solid #e9eaec;
        border-bottom:1px solid #e9eaec;
        width: 100%;
        padding: 20px;
        font-size: 14px;
    }
    .times{
        width: 100%;
        height: 90px;
        overflow-x: auto;
        margin-bottom: 20px;
    }
    .times-content{
        width:1200px;
    }
    .times p{
        color: #fff;
        text-align: center;
        font-size: 18px;
        padding-top:10px;
        width: 100px;
        height: 80px;
        background-color: #DCDEDD;
        float: left;
        border-right: 1px solid #F7F9F8;
        cursor: pointer;
    }
    .times p span{
        display: inline-block;
        font-size: 12px;
        height: 30px;
    }
    .active{
        background-color:#D04A49!important;
    }
    .toolBars {
      width: 100%;
      height: 35px;
      background-color: #FFF;
      line-height: 35px;
      text-align: center;
      font-size: 20px;
      color: gray;
    }
    .pull-right1{
        margin:11px;
        float: right;
    }
</style>
<template>
    <v-touch class="main" id="maintest" v-on:swipeleft="onSwipeLeft()">
        <div class="toolBars">
            <span class="titlehead">{{title}}</span>
            <span class="title pull-right">自动定位</span>
            <i-switch class="pull-right1" size="small" v-model="switch1" @on-change="change"></i-switch>
        </div>
        <Row type="flex" align="middle">
            <i-Col span="24">
                <div class="header">
                    <span class="block"></span><span class="title"> 当前所在房间</span><span class="small-title">(1F 3区 设备房)</span>
                    
                    <div class="c-content">
                        <img src="../../../src/img/spaceBG.jpg" alt="">
                    </div>
                </div>
                <div class="times">
                    <div class="times-content">
                        <p>室内装修<span>2017.05.10-2017.06.20</span></p>
                        <p>室内装修<span>2017.05.10-2017.06.20</span></p>
                        <p class="active">室内装修<span>2017.05.10-2017.06.20</span></p>
                        <p>室内装修<span>2017.05.10-2017.06.20</span></p>
                        <p>室内装修<span>2017.05.10-2017.06.20</span></p>
                        <p>室内装修<span>2017.05.10-2017.06.20</span></p>
                        <p>室内装修<span>2017.05.10-2017.06.20</span></p>
                        <p>室内装修<span>2017.05.10-2017.06.20</span></p>
                        <p>室内装修<span>2017.05.10-2017.06.20</span></p>
                        <p>室内装修<span>2017.05.10-2017.06.20</span></p>
                        <p>室内装修<span>2017.05.10-2017.06.20</span></p>
                        <p>室内装修<span>2017.05.10-2017.06.20</span></p>
                    </div>
                </div>
                <i-col span="16" style="padding-right: 20px;">
                    <i-table border :columns="columns1" :data="data1"></i-table>
                    <p class="remark">进行室内粗装饰、包括吊顶、墙面涂料、底板的铺设等...</p>
                    <i-table  :columns="columns3" style="margin-top: 20px" :data="data3"></i-table>
                </i-col>
                <i-col span="8">
                    <i-table  :columns="columns2" :data="data2"></i-table>
                </i-col>
            </i-Col>
        </Row>
    </v-touch>
</template>
<script>
    export default {
        data () {
            return {
                switch1: true,
                title:"空间管理",
                columns1: [
                    {
                        title: '使用单位',
                        key: 'danwei'
                    },
                    {
                        title: '负责人',
                        key: 'name'
                    },
                    {
                        title: '时间',
                        key: 'time'
                    }
                ],
                data1: [
                    {
                        danwei: '爱仕达装饰公司',
                        name: '王小明',
                        time: '2017.07.20-2017.10.20'
                    }
                ],
                columns2:[
                    {   title:'关联的文档',
                        key:'file'
                    },
                    {
                        title:'操作',
                        align:'center',
                        key:'action',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'ios-download-outline',
                                        size:30
                                    }
                                }),
                                h('Icon', {
                                    props: {
                                        type: 'trash-a',
                                        color:'#D04A49',
                                        size:30
                                    },
                                    style:{
                                        marginLeft:'20px',
                                        cursor:'pointer'
                                    }
                                })
                            ]);
                        }
                    }
                ],
                columns3:[
                    {
                        title:'堆放的构建与材料',
                        key:'stuff'
                    }
                ],
                columns4:[
                    {
                        title:'备注',
                        key:'remark'
                    }
                ],
                data2:[
                    {
                        file:'LED灯说明文档.doc'
                    },
                    {
                        file:'吊顶安装方法.doc'
                    },
                    {
                        file:'电路布线图.pdf'
                    },
                    {
                        file:'房间设计图.doc'
                    }
                ],
                data3:[
                    {
                        stuff:'本空间无构建与材料堆放'
                    }
                ]
            };
        },
        methods: {
            change (status) {
                this.$Message.info('开关状态：' + status);
            },
            onSwipeLeft() {
                alert("yes");
            }
        },
        mounted(){

        }
    };
</script>

