<style lang="less" rel="stylesheet/less" scoped>
    @import "../less/index.less";
    @import "../less/all/animat.less";
</style>
<style scoped>
    .view{
        width: 100%;
        height:100%;
        background-color: gray;
        width: 100%;
        position: relative;
    }
    .topbox{
        position: absolute;
        z-index: 999;
        right: 0px;
        top: 0px;
        width: 300px;
        height: 100%;
    }
</style>
<template>
    <div class="hhh" style="width:100%;height:100%;">
        <div id="viewer" class="view"></div>
        <!-- <div class="topbox">
            <Locator :state="active"></Locator>
        </div> -->
        <keep-alive>
            <!-- 筛选功能窗口 -->
                <transition name="drawer">
                    <div class="drawer" v-show="showDrawer">
                        <locator :state="active" style="width: 100%" ref="locator"></locator>
                    </div>
                </transition>
            </keep-alive>

            <div class="footer">
                <div class="controller specialcontrol">
                    <label @click="typeChange('member')" :class="{active:active=='member'}"><Icon type="eye"></Icon></label>
                    <label @click="typeChange('type')" :class="{active:active=='type'}"><Icon type="ios-flower-outline"></Icon></label>
                    <label @click="typeChange('floor')" :class="{active:active=='floor'}"><Icon type="social-buffer"></Icon></label>
                    <label @click="typeChange('building')" :class="{active:active=='building'}"><Icon type="ios-home-outline"></Icon></label>
                </div>
            </div>
    </div>
    
</template>
<script>
    // import Locator from "./plan/constructionRecord.vue"
    import locator from './locator/modelLocator.vue';
    export default {
        data(){
            return{
                active:"member",
                showDrawer:false
            }
        },
        methods:{
            load(){
                _isWholeModel = false;
                _viewer = null;
                _curUnitId = ""; //单位工程
                _curMajor = ""; //专业
                _selElevations = ""; //楼层 ,字符串格式 1,2
                _selZones = ""; //区域
                _selPbtypes = ""; //构件类型 ,字符串格式 1,2

                _selectionmode = "";
                _homeview = []; //模型初始位置

                _selectedId = null;
                _modellist = [];

                _floorData = [];
                _hideData = [];
                // changeIp(this.$store.state.environment);

                loadInitialModel();
                // newloadInitialModel();
            },
            newloadInitialModel() {
                let serverIp = 'api';
                // let serverIp = localStorage.server;
                let vm = this;
                $.ajax({
                    url:serverIp+'/task/modelview/getinitialmodel/?token='+vm.$store.state.sessionid,
                    type:'get',
                    cache: false,
                    dataType: "json",
                    success:function(data) {
                      if(data.issuc == "true") {
                        var options = {};
                        options.env = "Local";
                        _curUnitId = data.unitid;
                        _curMajor = data.majorid;
                        console.log(_curUnitId);
                        options.document = serverIp + data.modelfile;
                        vm.Initiy(options);
                      }
                    }
                })
            },
            Initiy(options){
              var viewerElement = document.getElementById('viewers');

              window._viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerElement, {});

              Autodesk.Viewing.Initializer(options,function() {
                _viewer.initialize();
                
                //_viewer.setSelectionMode(Autodesk.Viewing.SelectionMode.FIRST_OBJECT);
                _viewer.addEventListener (Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function (event) {
                  console.log("模型加载完成！");       
                 }) ;
                 
                _viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, onSelectedCallback);
                
                //加载模型
                _viewer.load(options.document);
                
                //改变背景颜色
                _viewer.setBackgroundColor(0, 59, 111, 255,255, 255);
                });
            },
            typeChange(type){
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

            },

        },
        mounted(){
            this.$nextTick(function(){
                this.load();
            })
        },
        components:{
            locator
        }
    }
</script>