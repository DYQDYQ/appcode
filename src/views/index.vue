<style lang="less" rel="stylesheet/less" scoped>
    @import "../less/index.less";
    @import "../less/all/animat.less";
</style>
<style>
    .wPaint-menu {
        width: 332px !important;
    }
    #viewermap{
        overflow: hidden !important;
    }
    #wPaint{
        margin:0 auto;

    }
    #guiviewer3d-toolbar{
        opacity: 0 !important;
        visibility: hidden !important;
    }
    .jindu{
        position: absolute;
        top: 47px;
        left: 70px;
        width: calc(100% - 70px);
        height: calc(100% - 47px);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .jindushadow{
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background-color: #f5f5f5;
        opacity: 0.9;
    }
    .building .menu{
        display: none;
    }
    .vux-popup-mask.vux-popup-show{
        z-index: 9000!important;
    }
    .mapbutton{
        position: absolute;
        top: 60px;
        left: 100px;
        font-size: 14px;
        text-align: center;
        line-height: 20px;
        z-index: 10000;
        color: #333;
        background-color: #fff;
        border-color: #ccc;
        padding: 5px 10px;
        border-radius: 3px;
    }
    .mapgo{
        color: #fff;
        background-color: #d9534f;
        border-color: #d43f3a;
        position: absolute;
        top: 60px;
        right: 20px;
        font-size: 14px;
        text-align: center;
        line-height: 20px;
        z-index: 10000;
        padding: 5px 10px;
        border-radius: 3px;
    }
    .curfloor{
        position: absolute;
        bottom: 20px;
        right: 20px;
        color: #d44c4c;
    }
    .curfloor:before{
        content: "";
        width: 16px;
        height: 16px;
        margin-right: 2px;
        border-radius: 50%;
        background: #d9534f;
        position: relative;
        bottom: -16px;
        right: 21px;
        display: block;
    }
    .whichfloor{
        display: inline-block;
        margin-bottom: 0;
        font-weight: 400;
        text-align: center;
        border: 1px solid #d7dde4;
        padding: 2px 7px;
        width: 80px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        margin-left: 3px;
    }
    .chosefloor{
        height: auto;
        position: absolute;
        bottom: 60px;
        right: 0px;
        opacity: 0;
        min-width: 100px;
        max-width: 170px;

    }
    .movein{
        animation:mi .5s ease-in;
        animation-fill-mode: forwards;
    }
    @keyframes mi
    {
    from {transform:translate(170px, 0);opacity: 0}
    to {transform:translate(0px, 0);opacity: 1}
    }
    .moveou{
        animation:mo .5s ease-in;
        animation-fill-mode: forwards;
    }
    @keyframes mo
    {
    from {transform:translate(0px, 0);opacity: 1}
    to {transform:translate(170px, 0);opacity: 0}
    }
    .chosedfloor{
        background: #cf5353;
        color: #fff
    }
</style>
<template>
    <div style="width: 100%;height: 100%;position: relative">
        <div class="mainvue" v-show="!showqr">
            <div class="menus">
                <div class="menuHead"></div>
                <div class="menuButton" v-for="item in menu" :class="{'checkbac' : item.path ==  nowpath}" @click="goit(item.path,item.where)">
                    
                    <Icon :type="item.icon" class="menulisticon newicon"></Icon>
                    <span>{{item.name}}</span>
                </div>
            </div>
            <div class="cover" v-if="!hide" @click="re(false)"></div>
            <div class="buildwhere">
               <building ref="building" class="building"></building>
               <div class="tabwindow" v-if="!map">
                   <div v-for="item in colorarr">
                       <Icon type="record" :color="item.color"></Icon>
                       <span>{{item.name}}</span>
                   </div>
               </div>
               <canvas v-show='!map' id="joystick" width="150" height="150" style="position: absolute;left: 5px;bottom: 5px;z-index: 200;"></canvas>
               <div id="content">
                  <div id="wPaint"></div>              
                  <img src="" alt="" id="ceshi" style="display: none">
              </div>
              <!-- 设置框 -->
                <div class="range">
                        <group>
                            <x-switch title="抗锯齿" v-model="kangjuchi" @on-change="kangju"></x-switch>
                            <x-switch title="环境遮挡阴影" v-model="huanjing" @on-change="huanj"></x-switch>
                            <x-switch title="地面阴影" v-model="dimianying" @on-change="dimiany"></x-switch>
                            <x-switch title="地面反射" v-model="dimianfan" @on-change="dimianf"></x-switch>
                            <cell :inline-desc="'透明度('+setrange+'%)'" primary="content">
                            <range :min="10" :max="100" v-model="setrange" @on-change="changerange"></range>
                            </cell>
                        </group>
                    
                </div>
               <!-- <div class="jietu" @click="zhongli"></div> -->
               <div v-if="!map" class="tuoluo" :class="{'tuoluo1':zhonglival}" @click="zhongli"></div>
               <div v-if="!map" class="gohome" @click="gomodelhome"></div>
               <!-- <div class="showall" @click="showall"></div> -->
               <div v-if="!map" class="showall" @click="qiehuanstate"></div>
               <div v-if="!map" class="manyou" :class="{'manyou1':zhongman}" @click="zhongmanyou"></div>
            </div>

            <div class="footer" v-show="!map">
                <div class="controller specialcontrol">
<!--                     <label v-if="choseactive && nowpath.indexOf('constructionProgress') > -1" @click="choseway('all')" :class="{active:choseways == 'all'}"><Icon type="android-expand"></Icon></label>
                    <label v-if="choseactive && nowpath.indexOf('constructionProgress') > -1" @click="choseway('pointer')" :class="{active:choseways == 'pointer'}"><Icon type="record"></Icon></label>
                    <label v-if="nowpath.indexOf('constructionProgress') > -1" @click="choselist" :class="{active:choseactive}"><Icon type="android-contract"></Icon></label> -->
                    <label @click="openmap" :class="{active:map}" v-if="zhonglival || zhongman"><Icon type="navigate"></Icon></label>
                    <label @click="celiang('delet')" v-if="celian == 'begin'"><Icon type="trash-b"></Icon></label>
                    <!-- <label @click="celiang('biao')"><Icon type="arrow-expand"></Icon></label> -->
                    <label @click="celiang('begin')" :class="{active:celian == 'begin'}"><Icon type="android-create"></Icon></label>
                    <label @click="typeChange('shitu')" :class="{active:active=='shitu'}"><Icon type="ios-browsers"></Icon></label>
                    <label @click="typeChange('type')" :class="{active:active=='type'}"><Icon type="pie-graph"></Icon></label>
                    <label @click="typeChange('floor')" :class="{active:active=='floor'}"><Icon type="android-menu"></Icon></label>
                    <label @click="typeChange('building')" :class="{active:active=='building'}"><Icon type="cube"></Icon></label>
                    <label @click="typeChange('set')" :class="{active:active=='set'}"><Icon type="gear-a"></Icon></label>
                    <label v-if="nowpath.indexOf('plan') == -1" @click="typeChange('openbig')">
                        <Icon v-if="modelactive=='openbig'" type="stop"></Icon>
                        <Icon v-else type="ios-keypad"></Icon>
                    </label>

                </div>
            </div>
            <div class="jindu">
                    <div class="jindushadow"></div>
                        <i-circle
                            :size="150"
                            :percent="percent"
                            stroke-color="#d44c4c">
                            <span style="font-size:14px">{{percentstate}}</span>
                            <span style="font-size:24px">{{percent}}%</span>
                        </i-circle>
                </div>
            <keep-alive>
            <!-- 筛选功能窗口 -->
                <transition name="drawer">
                    <div class="drawer" v-show="showDrawer">
                        <locator :state="active" :floorstrstate="floorstractive" style="width: 100%" ref="locator"></locator>
                    </div>
                </transition>
            </keep-alive>
            
            <div class="maincontent">
               <router-view ref="maincontent"></router-view> 
            </div>
        </div>
        <div class="a" v-if="showqr">
            <qrscanner></qrscanner>
        </div>
        <div id="clickmenu" style="display: none"></div>
        <transition name="adddrawer">
            <shitu class="adddrawer" ref="addlists" @closeshitu="closeshitu" v-if="addjietu"></shitu>
        </transition>

        <!-- 地图屏蔽层 -->
        <transition name="maindrawer">
            <div id="viewermap" class="maindrawer" v-show="map" style="height: calc(100% - 97px);display: flex;align-items: center;justify-content: center;">
                <img v-if="maploading" src="../img/mapload.gif" width="300px">
                <span class="curfloor" @click="showfloor">您所在楼层:{{nowfloor}}</span>
                <div class="chosefloor" :class="showfloors ? 'movein':'moveou' ">
                    <div class="whichfloor" v-for="(item,index) in elevations" @click="changeElevation(elevations,item,index)" :class="{ chosedfloor:item.staseleted }">{{item.name}}</div>
                </div>
            </div>
        </transition>
        <div v-if="map" @click="bacmodel" class="mapbutton">关闭地图</div>
        <div v-if="map" @click="gomodel" class="mapgo">前往标记</div>
    </div>
</template>
<script>
    import qrscanner from './plannedQR.vue';
    import building from './building.vue';
    import locator from './locator/modelLocator.vue';
    import shitu from './all/addshitu.vue';
    import {  Group,Range, Cell ,XTextarea,Swipeout, SwipeoutItem, SwipeoutButton,XSwitch} from 'vux';
    export default {
        components: {
            qrscanner,
            building,
            locator,
            Range,
            Group,
            Cell,
            XTextarea,
            Swipeout,
            SwipeoutItem,
            SwipeoutButton,
            shitu,
            XSwitch
        },
        data(){
            return {
                choseways:'pointer',
                choseactive:false,
                showfloors:false,
                elevations:[],
                modelactive:'',
                setrange:50,
                watchID:'',
                map:false,
                watchnewID:'',
                state:'unknow',
                maploading:true,
                showset:true,
                kangjuchi:true,
                huanjing:true,
                dimianying:true,
                dimianfan:true,
                lasty:0,
                lastx:0,
                lastz:0,
                zhongman:false,
                celian:'',
                celiangchild:'',
                modelrouter:"/task/modelview/getpbstatuslist/",
                zhonglival:false,
                show:null,
                nowindex:0,
                showPro:false,
                addjietu:false,
                level:1,
                active:'',
                showDrawer:false,
                radioActive:false,
                floorstr:false,
                floorstractive:'floor',
                locatorData:"",
                colorarr:[],
                settime:null,
                percenttime:null,
                nowpath: '/main/all/modelView',
                checktime:0,
                firstvalue:null,
                menu:[
                    {
                        name:"项目概览",
                        open:false,
                        icon:"ios-paper",
                        show:"projectview",
                        path:"/main/all/modelView",
                        where:"all",
                        children:[
                            {name:"任务日程",path:"/main/all/project"},
                            {name:"模型视图",path:"/main/all/modelView"},
                        ]
                    },
                    {
                        name:"进度管理",
                        open:false,
                        icon:"ios-barcode",
                        path:"/main/plan/constructionProgress",
                        where:"plan",
                        children:[
                            {name:"施工进度",path:"/main/plan/constructionProgress"},
                            {name:"施工计划",path:"/main/plan/constructionPlan"},
                            {name:"进度录入",path:"/main/plan/constructionRecord"}
                        ]
                    },
                    {
                        name:"质量管理",
                        icon:"document-text",
                        path:"/main/quality/main",
                        where:"quality",
                        children:[
                            {name:"质量总览",path:"/main/quality/main"},
                            {name:"质量整改单",path:"/main/quality/deal"},
                            {name:"质量验收",path:"/main/quality/check"}
                        ]
                    },
                    {
                        name:"安全管理",
                        icon:"ios-locked",
                        path:"/main/safety/main",
                        where:"safety",
                        children:[
                            {name:"安全总览",path:"/main/safety/main"},
                            {name:"安全整改单",path:"/main/safety/deal"},
                        ]
                    },
                    {
                        name:"资料查看",path:"/main/file",
                        where:"file",
                        icon:"ios-folder",
                    },
                    {
                        name:"系统管理",
                        open:false,
                        icon:"ios-gear",
                        path:"/main/system/setting",
                        where:"system",
                        children:[
                            {name:"系统设置",path:"/main/system/setting"},
                            {name:"模型管理",path:"/main/system/model"}
                        ]
                    },
                    // {
                    //     name:"test",path:"/modelss",
                    //     icon:"ionic",
                    // },
//                    {
//                        name:"注销",path:"/"
//                    }
                ]
            }
        },
        computed: {
            hide () {
                return this.$store.state.hideSideBar
            },
            title(){
                return this.$store.state.title;
            },
            name(){
                return this.$store.state.name?this.$store.state.name.name:"加载中...";
            },
            setSize(){
                return 140/this.name.length>30?'font-size:30px':`font-size:${parseInt(140/this.name.length)}px`
            },
            showqr(){
                return this.$store.state.qrstate;
            },
            showfooter(){
                return this.$store.state.showfooter;
            },
            showdetail(){
                return this.$store.state.showdetail;
            },
            shitu(){
                return this.$store.state.shitu;
            },
            percent(){
                return this.$store.state.percent;
            },
            percentstate(){
                return this.$store.state.percentstate;
            },
            nowfloor(){
                return this.$store.state.nowfloor;
            },
            unitprojectid(){
                return this.$store.state.unitprojectid;
            }
        },
        watch:{
            showqr(val,old){
                console.log(val);
            },
            showfooter(){
                this.active = '';
                this.showDrawer = false;
            },
            showdetail(val){
                if(val){
                    this.typeChange('member');
                    this.showDrawer = true;
                }else{
                    this.typeChange('');
                    this.showDrawer = false;
                }
            },
            shitu(val){
                if(val != ''){
                   this.addjietu = true;
                   $('#wPaint-img').attr('src',this.$store.state.serverIp+val.url);
                }
                
            },
            percent(val){
                let vm = this;
                if(this.percenttime){
                    clearTimeout(this.percenttime);
                }
                if(val == null || val == 100){
                    return;
                }
                this.percenttime = setTimeout(function(){
                    _viewer.removeEventListener(Autodesk.Viewing.PROGRESS_UPDATE_EVENT, onProgressUpdateCallback);
                    $(".jindu").fadeOut();
                    _Wvue.$store.commit('setpercent',null);
                    _Wvue.$store.commit('setpercentstate',null);
                    vm.$Message.warning("模型加载超时");
                },7000)
            },
            unitprojectid(val){
                if(val != ''){
                    this.loadelevations(val);
                }
            }
        },
        methods: {
            checkopacity(){
                let newval = (0.1 - this.setrange/1000).toFixed(2);
                _viewer.impl.setGhostingBrightness(0x101010,newval);
            },
            reload(){
                window.location.reload()
            },
            open(item){
                item.open=!item.open;
            },
            scanQR(){
                if(this.$store.state.environment==='dev'){
                    alert('扫描二维码')
                } else {
                    this.$router.push({ path: '/commonQR'});
                }
                
            },
            re(state){
                let a = !state;
                this.$store.commit('toggle',a);
            },
            goit(root,where){
                this.colorarr = [];
                this.modelactive = '';
                this.$store.commit("setshowfooter");
                this.$router.push({path: root});
                this.nowpath = root;
                $(".fa-question").css("display","none");
                $('.showall').removeClass('hasShow');

                //关掉框选
                this.$store.commit('openselect',false);
                _viewer.unloadExtension('Viewing.Extension.SelectionWindow');
                //关掉框选
                
                //初始化大小构件选择
                if(where == 'plan'){
                    $(".fa-question").css("display","block");
                    this.$store.commit('chosegoujianstatus','big');
                }else{
                    this.$store.commit('chosegoujianstatus','small');
                }
                if(where == 'quality'){
                    localStorage.colorstate = '/task/qualitycenter/getpbstatuslist/';
                    getpbstatuslist("/task/qualitycenter/getpbstatuslist/");
                    this.colorarr = getpbstatuscolor(where);
                    $(".fa-question").css("display","block");
                    this.modelrouter = "/task/qualitycenter/getpbstatuslist/";
                }else if(where == 'safety'){
                    localStorage.colorstate = '/task/anquan/getpbstatuslist/';
                    getpbstatuslist("/task/anquan/getpbstatuslist/");
                    this.colorarr =  getpbstatuscolor(where);
                    this.modelrouter = "/task/anquan/getpbstatuslist/";
                    $(".fa-question").css("display","block");
                }else if(where == 'plan' || where == 'all'){
                    localStorage.colorstate = '/task/modelview/getpbstatuslist/';
                    getpbstatuslist("/task/modelview/getpbstatuslist/");
                    this.colorarr =  getpbstatuscolor(where);
                    this.modelrouter = "/task/modelview/getpbstatuslist/";
                }
                
            },
            showcalender(){
                this.$refs.maincontent.showit();
            },
            choselist(){
                    if(this.choseactive){
                        this.choseactive = false;
                        this.$store.commit('openselect',false);
                        _viewer.unloadExtension('Viewing.Extension.SelectionWindow');
                        this.choseways = 'pointer';
                        this.$Message.success('关闭框选！');
                    }else{
                        this.choseactive = true;
                        this.$store.commit('openselect',true);
                        
                    }
            },
            typeChange(type){
                if(type == 'openbig'){
                    if(this.modelactive == type){
                        this.modelactive = '';
                        this.$store.commit('chosegoujianstatus','small');
                        this.$Message.success('切换到小构件');
                    }else{
                        this.modelactive = type;
                        this.$store.commit('chosegoujianstatus','big');
                        this.$Message.success('切换到大构件');
                    }
                    return;
                }
                
                if(type == "set"){
                    if(this.active == type){
                        $(".range").animate({right:"-300px"},"fast");
                        this.active = '';
                        this.showDrawer = false;
                    }else{
                        $(".range").animate({right:"0px"},"fast");
                        this.active = type;
                        this.showDrawer = false;
                    }
                    return;
                }
                if(type == "addjietu"){
                    this.addjietu = !this.addjietu;
                    return;
                }
                this.showPro = !1;
                if(this.active===type){
                    this.active = '';
                    this.showDrawer = false;
                } else {
                    this.active = type;
                    this.showDrawer = true;
                    if(type==="structure"){
                        this.radioActive = false;
                    };
                };
                $(".range").animate({right:"-300px"},"fast");

            },
            jietu(){
                wpaint();
                capture();
                
            },
            gomodelhome(){
                $(".menu-selector").removeClass('open');
                $(".menu-selector").css({'display': 'none'});
                _viewer.clearSelection();
                _viewer.utilities.goHome();
            },
            showall(){
                _viewer.showAll();
                this.$store.commit("setrestore");
            },
            closeshitu(val){
                this.addjietu = false;
            },
            onSuccess(e){
                if(this.state == 'xindex'){
                    return;
                }
                    var o = window.orientation;  //获取设备方向
                    console.info('z'+e.alpha);
                    console.info('x'+e.beta);
                    console.info('y'+e.gamma);
                    if(this.lasty == 0){
                        this.lasty = e.gamma;
                    }
                    let direct = e.gamma - this.lasty;
                    console.info('direct'+direct);
                    if(direct > 1){
                            if(Math.abs(direct) > 10){
                                _viewer.changeTouchType(0,5*10);
                            }else{
                                _viewer.changeTouchType(0,5*Math.abs(direct));
                            }
                            
                        
                        
                        this.state = 'yindex';
                    }else if(direct < -1){
                        if(Math.abs(direct) > 10){
                            _viewer.changeTouchType(0,-5*10);
                        }else{
                            _viewer.changeTouchType(0,-5*Math.abs(direct));
                        }
                        
                        this.state = 'yindex';
                    }else{
                        _viewer.changeTouchType(0,0);
                        this.state = 'xindex';
                    }
                    
                    this.lasty = e.gamma;

            },
            onError(){
                this.$Message.error("错误");
            },
            ondirsucc(heading){
                if(this.state == 'yindex'){
                    return;
                }
                if(this.lastx == 0){
                    this.lastx = heading.magneticHeading;
                }
                let direct = heading.magneticHeading - this.lastx;
                if(direct < -1){
                    if(Math.abs(direct) >= 180){
                        if(Math.abs(direct)>1){
                        _viewer.changeTouchType(5*Math.abs(direct),0);
                        }else{
                            _viewer.changeTouchType(5,0);
                        }
                    }else{
                        if(Math.abs(direct)>1){
                        _viewer.changeTouchType(-5*Math.abs(direct),0);
                        }else{
                            _viewer.changeTouchType(-5,0);
                        }
                    }
                    this.state = 'xindex';
                }else if(direct > 1){
                    if(Math.abs(direct)>1){
                    _viewer.changeTouchType(5*Math.abs(direct),0);
                    }else{
                        _viewer.changeTouchType(5,0);
                    }
                    this.state = 'xindex';
                }else{
                    _viewer.changeTouchType(0,0);
                    this.state = 'yindex';
                }
                this.lastx = heading.magneticHeading;

            },
            ondirerror(error){
                console.info(error);
            },
            zhongli(){
                this.zhonglival = !this.zhonglival;
                $(".menu-selector").removeClass('open');
                $(".menu-selector").css({'display': 'none'});
                _viewer.clearSelection();
                if(this.zhonglival){
                    // this.checktime = 1;
                    // var options = {frequency: 3000}
                    // this.watchID = navigator.accelerometer.watchAcceleration(this.onSuccess, this.onError, options);
                     _viewer.loadExtension("Autodesk.ADN.Viewing.Extension.CustomFirstPersonTool");
                     $('.showall').removeClass('hasShow');
                     this.qiehuanstate();
                    // var watchnewID = navigator.compass.watchHeading(this.ondirsucc, this.ondirerror,options);

                }else{
                    // navigator.accelerometer.clearWatch(this.watchID); 
                    _viewer.unloadExtension("Autodesk.ADN.Viewing.Extension.CustomFirstPersonTool");
                    $('.showall').addClass('hasShow');
                    this.qiehuanstate();
                    // _viewer.changeDirection();
                    // this.checktime = 0;
                }
                

            },
            qiehuanstate(){
                if($('.showall').hasClass('hasShow')){
                    getpbstatuslist(this.modelrouter);
                    $('.showall').removeClass('hasShow');
                }else{
                    _viewer.clearThemingColors();
                    _viewer.showAll();
                    $('.showall').addClass('hasShow')
                }
                $(".menu-selector").removeClass('open');
                $(".menu-selector").css({'display': 'none'});
                _viewer.clearSelection();
            },
            celiang(val){
                if(val == 'begin'){
                    if(this.celian == ''){
                        this.celian = val;
                        $("#toolbar-measureTool-simple-distance").click(); 
                        $("#toolbar-measurementSubmenuTool").click();
                    }else{
                        this.celian = '';
                        $("#toolbar-measureTool-done").click();
                    }
                    _viewer.impl.sceneUpdated(true);
                    
                }
                if(val == 'delet'){
                    $("#toolbar-delete").click();
                    _viewer.impl.sceneUpdated(true);
                }
            },
            changerange(val){
                let vm = this;
                if(this.settime){
                    clearTimeout(this.settime);
                };
                this.settime = setTimeout(function(){
                    vm.checkopacity();
                },1500);
                
            },
            kangju(val){
                if(val){
                    this.kangjuchi = true;
                }else{
                    this.kangjuchi = false;
                }
                 _viewer.setQualityLevel(this.huanjing,this.kangjuchi)
            },
            huanj(val){
                if(val){
                    this.huanjing = true;
                }else{
                    this.huanjing = false;
                }
                 _viewer.setQualityLevel(this.huanjing,this.kangjuchi)
            },
            dimiany(val){
                _viewer.setGroundShadow(val);
            },
            dimianf(val){
                _viewer.setGroundReflection(val)
            },
            zhongmanyou(){
                this.zhongman = !this.zhongman;
                _viewer.clearSelection();
                if(this.zhongman){
                    $('.gohome').css("display","none");
                    $('.showall').css("display","none");
                    $('.tuoluo').css("display","none");
                    $('#joystick').css("display","none");
                    var options = {frequency: 50}
                     _viewer.loadExtension("Autodesk.ADN.Viewing.Extension.CustomFirstPersonTool");
                    this.watchnewID = navigator.compass.watchHeading(this.ondirsucc, this.ondirerror,options);
                    window.addEventListener('deviceorientation',this.onSuccess);


                }else{
                    $('.gohome').css("display","block");
                    $('.showall').css("display","block");
                    $('.tuoluo').css("display","block");
                    $('#joystick').css("display","block");
                    navigator.accelerometer.clearWatch(this.watchID);
                    window.removeEventListener('deviceorientation',this.onSuccess);
                    navigator.compass.clearWatch(this.watchnewID);
                    _viewer.unloadExtension("Autodesk.ADN.Viewing.Extension.CustomFirstPersonTool");
                    _viewer.changeDirection();
                }
            },
            openmap(){
                let vm = this;
                vm.maploading = true;
                this.map = true;
                if(this.map){
                    
                    _viewer.displayViewCube( false );
                    setTimeout(function(){
                        testCutPlans(0,150,vm.elevations);

                        beginclick(67,70);
                    },600)
                    setTimeout(function(){
                        vm.maploading = false;
                         $("#viewermap").css('background-color','transparent');
                    },2000)
                    
                }
            },
            gomodel(){
                this.map = false;
                $("#viewermap").off("click");
                $("#viewermap").css('background-color','#fff');
                gonewposition();
                this.showfloors = false;
                
            },
            bacmodel(){
                this.map = false;
                $("#viewermap").off("click");
                restord();
                $("#viewermap").css('background-color','#fff');
                $('.viewcube').css('display','block');
                this.showfloors = false;
            },
            loadelevations(val) {
                let vm = this;
                mui.ajax({
                    type: "get",
                    url: vm.$store.state.serverIp + "/task/elevations/?token="+vm.$store.state.sessionid,
                    cache: false,
                    dataType: "json",
                    data: {
                        "unitproject": val,
                        "perPage":999
                    },
                    success: function(data) {
                        data.results.forEach((val, index) => {
                            val.staseleted = false;
                        })
                        vm.elevations=data.results;
                        console.log('vm.elevations');
                        console.log(vm.elevations);
                    }
                });
            },
            changeElevation(elevations,value,index){

                this.elevations.forEach((val) => {
                    if(val.staseleted && value.id!=val.id){
                        val.staseleted = false;
                    }
                })
                value.staseleted=!value.staseleted;
                
                if(value.staseleted){
                    this.$store.commit('setnowfloor',value.name);
                    gotoElevation(elevations,value,index);
                }
            
            },
            getfirstfloor(){
                let vm = this;
                $.ajax({
                    url:vm.$store.state.serverIp + "/task/modelfiles/?token="+vm.$store.state.sessionid,
                    success(res){
                        let a = res.results;
                        a.forEach((val,index)=>{
                            if(localStorage.belongmodel) {
                                if(localStorage.belongmodel == val.id){
                                    vm.checknumber = index;
                                    vm.$store.commit("setbelongmodel",val.id);
                                    vm.$store.commit("setunitprojectid",val.relatedunitprojectid);
                                }
                           }
                           if(!localStorage.belongmodel || localStorage.belongmodel == ''){
                                if(val.isdefault){
                                   vm.checknumber = index;
                                   vm.$store.commit("setbelongmodel",val.id);
                                   vm.$store.commit("setunitprojectid",val.relatedunitprojectid);
                                }
                           }
                        })
                    }
                })
            },
            showfloor(){
                 this.showfloors = !this.showfloors;
            },
            choseway(val){
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
            }
        },
        mounted(){
            let vm = this;
            vm.$store.commit('setprojectid',localStorage.projectid);
            vm.$store.commit('setsessionid',localStorage.sessionid);
            console.log('localStorage.sessionid');
            console.log(localStorage.sessionid);
            this.nowpath = this.$route.path;
            this.$nextTick(function(){
                yaogan();
                this.$refs.building.load();
            });
            console.log('重新加载bug');
            this.$nextTick(function(){
                $(".specialcontrol").on("click","label",function(){
                    vm.$store.commit("setshowhead");
                })
            });
            this.colorarr =  getpbstatuscolor('all');
            this.getfirstfloor();
        },
    };
</script>