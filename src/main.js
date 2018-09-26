import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import App from './app.vue';
import Stats from './noNpmSupported/stats/Stats';
import everment from './config/env';
// import $ from 'jquery';
import 'iview/dist/styles/iview.css';
import './less/theme/iview.css';
import './less/iviewbase.css';
import './less/iconfont/iconfont.css';
// import VueTouch from 'vue-touch';
Vue.use(VueRouter);
Vue.use(Vuex);

Vue.use(iView);

// Vue.use(VueTouch, {name: 'v-touch'});


// 路由配置
const RouterConfig = {
    mode: everment==='development'?'history':'hash',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    store.commit('changeTitle',to.meta.title);
    store.commit('toggle',true);
    next();
});

router.afterEach(() => {
    store.commit('toggle',true);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
    if(!store.state.name){
        store.dispatch("getUserInfo");
    }
});

if(!localStorage.server){
    localStorage.server = "http://test.cocc.bimsheng.com";
}

if(!localStorage.colorstate){
    localStorage.colorstate = '/task/modelview/getpbstatuslist/';
}
let environment,serverIp;
if(everment == "development"){
    environment='dev';
    serverIp="/api";
} else {
    environment='production';
    serverIp = localStorage.server;
}

const store = new Vuex.Store({
    state: {
        serverIp,
        environment,//运行环境，在dev模式下由于无法执行跨域请求，会自动进入成功函数或备用方法；

        hideSideBar:false,
        title:"",
        name:null,
        QR:null,
        leveltitle:"",
        baclevel:false,
        quiltybac:false,
        issueId:null,
        quiltylist:null,
        saistate:false,
        planadd:false,
        QRstates:null,
        qrpropertys:null,
        pbproperty:"{}",
        relatefilelist:"[]",
        qrstate:false,
        modelproperty:null,
        showhead:false,
        showfooter:false,
        showdetail:false,
        openadd:1,
        shitu:'',
        shitustate:'',
        restore:false,
        belongmodel:null,
        properties:null,
        percent:null,
        percentstate:null,
        propertylist:'',
        changestate:true,
        projectid:null,
        sessionid:'',
        goujianstatus:'small',
        nowfloor:[],
        unitprojectid:'',
        select:false,
        selectlist:null,

    },
    getters: {

    },
    mutations: {
        setunitprojectid(state,payload){
            state.unitprojectid = payload;
        },
        setnowfloor(state,payload){
            state.nowfloor = payload;
        },
        setshowhead(state,payload){
            state.showhead = !state.showhead;
        },
        setshowfooter(state,payload){
            state.showfooter = !state.showfooter;
        },
        setrestore(state,payload){
            state.restore = !state.restore;
        },
        toggle(state,payload){
            state.hideSideBar = payload;
        },
        changeTitle(state,payload){
            state.title = payload;
        },
        setUser(state,payload){
            state.name = payload;
        },
        addQR(state,payload){
            state.QR = payload.value;
        },
        clearQR(state){
            state.QR = null;
        },
        saveIp(state,payload) {
            state.serverIp = payload;
        },
        changeleveltitle(state,payload) {
            state.leveltitle = payload;
        },
        setbaclevel(state,payload) {
            state.baclevel = payload;
        },
        setquiltybac(state,payload) {
            state.quiltybac = payload;
        },
        setissueId(state,payload) {
            state.issueId = payload;
        },
        getquiltylist(state,payload) {
            state.quiltylist = payload;
        },
        setsaistate(state,payload){
            state.saistate = payload;
        },
        setplanadd(state,payload){
            state.planadd = payload;
        },
        QRstate(state,payload){
            state.QRstates = payload;
        },
        getqrpropertys(state,payload){
            state.qrpropertys = payload;
        },
        getpbproperty(state,payload) {
            state.pbproperty = payload;
        },
        getrelatefilelist(state,payload) {
            state.relatefilelist = payload;
        },
        setqrstate(state,payload) {
            state.qrstate = payload;
        },
        setmodelproperty(state,payload) {
            state.modelproperty = payload;
        },
        setshowdetail(state,payload) {
            state.showdetail = payload;
        },
        setopenadd(state,payload) {
            state.openadd = payload;
        },
        setshitu(state,payload){
            state.shitu = payload;
        },
        setshitustate(state,payload){
            state.shitustate = payload;
        },
        setbelongmodel(state,payload){
            state.belongmodel = payload;
        },
        getproperties(state,payload){
            state.properties = payload;
        },
        setpercent(state,payload){
            state.percent = payload;
        },
        setpercentstate(state,payload){
            state.percentstate = payload;
        },
        setchangestate(state,payload){
            state.changestate = payload;
        },
        setprojectid(state,payload){
            state.projectid = payload;
        },
        setsessionid(state,payload){
            state.sessionid = payload;
        },
        chosegoujianstatus(state,payload){
            state.goujianstatus = payload;
        },
        openselect(state,payload){
            state.select = payload;
        },
        setselectlist(state,payload){
            state.selectlist = payload;
        },
    },
    actions: {
        getUserInfo(content){
            $.ajax(`${content.state.serverIp}/userinfo/`, {
                dataType: 'json',
                type: 'get',
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                crossDomain:true,
                success: function(res) {
                    if(res.res==="success"){
                        content.commit("setUser",res.userinfo);
                    }
                },
                error: function(xhr, type, errorThrown) {
                    console.log(type);
                }
            });
        }
    }
});


// let stats = new Stats();
// stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild( stats.dom );
// requestAnimationFrame( animate );
// function animate() {
//     stats.begin();
//     stats.end();
//     requestAnimationFrame( animate );
// }

Date.prototype.format = function(fmt) { 
     var o = { 
        "M+" : this.getMonth()+1,                 //月份 
        "d+" : this.getDate(),                    //日 
        "h+" : this.getHours(),                   //小时 
        "m+" : this.getMinutes(),                 //分 
        "s+" : this.getSeconds(),                 //秒 
        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
        "S"  : this.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt; 
};

if(everment == 'development') {
    window._Wvue = new Vue({
        el: '#app',
        router: router,
        store: store,
        beforeCreate(){
            mui.init();
        },
        mounted(){
        },
        render: h => h(App)
    });
}else {
    document.addEventListener('deviceready',function() {
       window._Wvue = new Vue({
            el: '#app',
            router: router,
            store: store,
            beforeCreate(){
                mui.init();
            },
            mounted(){
            },
            render: h => h(App)
        });
        sqlitdb = window.sqlitePlugin.openDatabase({name: "my.db", location: 'default', createFromLocation: 2});
        sqlitdb.transaction(function(tx) {
          tx.executeSql('CREATE TABLE IF NOT EXISTS model_table (id integer primary key, projectid integer,unitid integer,majorid integer,modelid integer,version text,path text,new1 text,new2 text,new3 text)');
        },function(error){
          console.log(error);
          sqlitdb.close();
        },function(){
          console.log('close1 ok');
          sqlitdb.close();
        });
        window.resolveLocalFileSystemURL(cordova.file.documentsDirectory, function (fs) {
          fs.getDirectory('NewDirInRoot', {create: true}, function (entry) {
            console.log('NewDirInRoot 创建成功');
            console.log(entry.toURL());
          },function(error){
            console.log('NewDirInRoot 创建失败');
          });
        });
        //解决pad头部被状态栏覆盖
        // StatusBar.overlaysWebView(false);
        // window.webserver.start();
        // window.webserver.onRequest(
        //      function(request) {
        //         console.log('进来了');
        //         let newurl = '';
        //         let getname = request.path.substr(request.path.lastIndexOf('/')+1,request.path.length);
        //         let newstrindex = request.path.split('/NewDirInRoot/')[1].indexOf('/');
        //         let newstr = request.path.split('/NewDirInRoot/')[1].substr(0,newstrindex);
        //         window.resolveLocalFileSystemURL(cordova.file.documentsDirectory,function(fs){
        //             fs.getDirectory(newstr,{create:false},function(entry){
        //                 entry.getFile(getname,{create:false},function(ds){
        //                     console.log('找到文件');
        //                     newurl = request.path;
        //                     window.webserver.sendResponse(
        //                       request.requestId,
        //                       {
        //                         status:200,
        //                         body: newurl,
        //                         headers: {
        //                             'Content-Type': 'application/octet-stream'
        //                         }
        //                       }
        //                     )
        //                 },function(error){
        //                     console.log('找不到文件，传1.txt回去');
        //                     newurl = nofilebacpath;
        //                     window.webserver.sendResponse(
        //                       request.requestId,
        //                       {
        //                         status:200,
        //                         body: newurl,
        //                         headers: {
        //                             'Content-Type': 'application/octet-stream'
        //                         }
        //                       }
        //                     )
        //                 })
        //             },function(error){
        //                 config.log('找不到newstr');
        //             })
        //         })
        //         console.log(newurl);
        //      }
        // )
        
    },false)
}


