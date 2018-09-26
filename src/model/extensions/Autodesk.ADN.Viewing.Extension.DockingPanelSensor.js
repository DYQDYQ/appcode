/////////////////////////////////////////////////////////////////////
// Autodesk.ADN.Viewing.Extension.DockingPanelSensor
// by Philippe Leefsma, May 2015
//
/////////////////////////////////////////////////////////////////////
AutodeskNamespace("Autodesk.ADN.Viewing.Extension");

Autodesk.ADN.Viewing.Extension.DockingPanelSensor = function(viewer, options) {

  Autodesk.Viewing.Extension.call(this, viewer, options);

  var _panel = null;

  /////////////////////////////////////////////////////////////////
  // Extension load callback
  //
  /////////////////////////////////////////////////////////////////
  this.load = function() {

    _panel = new Panel(
      viewer.container,
      guid());
      //    _panel.setVisible(true);
      console.log('Autodesk.ADN.Viewing.Extension.DockingPanelSensor loaded');
    return true;
  };

  /////////////////////////////////////////////////////////////////
  //  Extension unload callback
  //
  /////////////////////////////////////////////////////////////////
  this.unload = function() {
    _panel.setVisible(false);
    console.log('Autodesk.ADN.Viewing.Extension.DockingPanelSensor unloaded');
    return true;
  };

  Autodesk.Viewing.Viewer3D.prototype.LoadPanelSensor = function(show,device) {
    
    if(show == undefined) {
      if(_panel.isVisible()) {
        _panel.setVisible(false);
      } else {
        _panel.setVisible(true);
        loadDeviceModel('device',0,loadDeviceComplete);
      }
    } else {
      _panel.setVisible(show);
      if(show){
        loadDeviceModel('device',0,loadDeviceComplete);
      }
      
    }
  };

  /////////////////////////////////////////////////////////////////
  // Generates random guid to use as DOM id
  //
  /////////////////////////////////////////////////////////////////
  function guid() {

    var d = new Date().getTime();

    var guid = 'xxxx-xxxx-xxxx-xxxx'.replace(
      /[xy]/g,
      function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return(c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
      });

    return guid;
  }

  /////////////////////////////////////////////////////////////////
  // The demo Panel
  //
  /////////////////////////////////////////////////////////////////
  var Panel = function(parentContainer, id) {

    var _thisPanel = this;

    _thisPanel.content = document.createElement('div');

    Autodesk.Viewing.UI.DockingPanel.call(
      this,
      parentContainer,
      id,
      '设备详情', {
        shadow: true
      });

      var isShowtitle = true;
      var labeldis = 5;
      var detailfontsize = 30;

      $(_thisPanel.container).addClass('docking-panel-Sensor');
      var pagewidth = $("#viewer").width();
      var pageheight = $(window).height();
      var left = pagewidth - 620;
      var top = (pageheight - 800) * 0.5 < 0 ? 0 : (pageheight - 800) * 0.5;
      $('#' + id).css({
        'width': 600 + 'px',
        'height': 500 + 'px',
        'top': top + 'px',
        'left': left + 'px',
      });
      $(_thisPanel.container).append("<div id='subdevice'></div>");
      initSubDevice();
      _thisPanel.setVisible = function(show) {

        Autodesk.Viewing.UI.DockingPanel.prototype.
        setVisible.call(this, show);
        

      };

    /////////////////////////////////////////////////////////////
    // initialize override
    //
    /////////////////////////////////////////////////////////////
    _thisPanel.initialize = function() {

      this.title = this.createTitleBar(
        this.titleLabel ||
        this.container.id);

      this.closer = this.createCloseButton();

      this.container.appendChild(this.title);
      this.title.appendChild(this.closer);
      this.container.appendChild(this.content);

      this.initializeMoveHandlers(this.title);
      this.initializeCloseHandler(this.closer);
    };

    /////////////////////////////////////////////////////////////
    // onTitleDoubleClick override
    //
    /////////////////////////////////////////////////////////////
    var _isMinimized = false;

    _thisPanel.onTitleDoubleClick = function(event) {

      _isMinimized = !_isMinimized;

      if(_isMinimized) {

        $(_thisPanel.container).addClass(
          'docking-panel-minimized');
      } else {
        $(_thisPanel.container).removeClass(
          'docking-panel-minimized');
      }
    };
  };

  /////////////////////////////////////////////////////////////
  // Set up JS inheritance
  //
  /////////////////////////////////////////////////////////////
  Panel.prototype = Object.create(
    Autodesk.Viewing.UI.DockingPanel.prototype);

  Panel.prototype.constructor = Panel;

  /////////////////////////////////////////////////////////////
  // Add needed CSS
  //
  // /////////////////////////////////////////////////////////////
  // var css = [
  //
  //   'form.docking-panel-controls{',
  //   'margin: 20px;',
  //   '}',
  //
  //   'input.docking-panel-name {',
  //   'height: 30px;',
  //   'margin-left: 5px;',
  //   'margin-bottom: 5px;',
  //   'margin-top: 5px;',
  //   'border-radius:5px;',
  //   '}',
  //
  //   'div.docking-panel-Sensor {',
  //   'resize: none;',
  //   'z-index: 200;',
  //   '}',
  //
  //   'div.docking-panel-minimized {',
  //   'height: 34px;',
  //   'min-height: 34px',
  //   '}'
  //
  // ].join('\n');
  //
  // $('<style type="text/css">' + css + '</style>').appendTo('head');
};

Autodesk.ADN.Viewing.Extension.DockingPanelSensor.prototype =
  Object.create(Autodesk.Viewing.Extension.prototype);

Autodesk.ADN.Viewing.Extension.DockingPanelSensor.prototype.constructor =
  Autodesk.ADN.Viewing.Extension.DockingPanelSensor;

Autodesk.Viewing.theExtensionManager.registerExtension(
  'Autodesk.ADN.Viewing.Extension.DockingPanelSensor',
  Autodesk.ADN.Viewing.Extension.DockingPanelSensor);

var _subdevice;
function cameraChange(){
  updateSensorDate();
}

function initSubDevice(){
    _subdevice = new Vue({
        template:
                `<div>
                    <Tabs value="name1">
                        <TabPane label="设备模型" name="name1">
                            <div id="subviewer">
                              <Tooltip v-for="item in sensors" :content="item.name+':'+item.title" transfer="true" :style="item.style" placement="top-start" class="sensor">
                                <Icon  size="10" type="record" ></Icon>
                              </Tooltip>
                              <div class="sensor1div">

                                <Tag v-for="item in sensors1" :title="item.name+':'+item.title" type="dot" :color="item.color" class="sensor1">{{item.name}}:{{item.title}}</Tag>
                              <div>
                            </div>

                        </TabPane>
                        </TabPane>
                        <TabPane label="历史数据" name="name2">
                            <div id="devicechart">
                              <div id="chart1" style="width: 600px;height:430px;"></div>
                            </div>
                        </TabPane>
                        <TabPane label="监控列表" name="name3">
                            <i-Table border :columns="columns5" :data="data5"></i-Table>
                        </TabPane>
                        <TabPane label="设备信息" name="name4">
                          <row>
                            <Col span="2">
                              <Button-group vertical style="padding:5px">
                                <i-Button type="primary"  @click="goUp" icon="arrow-up-a"  title="向上溯源"> </i-Button>
                                <i-Button type="primary"  @click="goDown" icon="arrow-down-a"  title="向下溯源"></i-Button>
                                <i-Button type="warning"   title="显示三维逻辑">3D</i-Button>
                                <i-Button type="warning"   title="显示二维逻辑">2D</i-Button>
                                <i-Button type="success"  icon="cloud" @click="yujing"  title="预警信息">警</i-Button>
                                <i-Button type="success"  @click="weixiu" icon="wrench"  title="维修工单">修</i-Button>
                                <i-Button type="success"  @click="weibao" icon="ios-refresh-outline" title="维保工单">保</i-Button>
                              </Button-group>
                            </Col>
                            <Col span="1">
                              <br/>
                            </Col>
                            <Col span="21">
                              <i-Form :label-width="40">
                                <row>
                                  <Col span="12"v-for="(val, key) of device">
                                    <FormItem :label="key">
                                        <span>{{val}}</span>
                                    </FormItem>
                                  </Col>
                                </row>
                                <FormItem label="文件">
                                  <a v-for="file in devicefile" :href="file.url" target="_blank">
                                    <Tag type="border">{{file.name}}</Tag>
                                  </a>

                                </FormItem>
                              </i-Form>
                            </Col>
                          </row>
                        </TabPane>
                    </Tabs>
                    
                  </div>`,
        methods:{
            goDown(){
                if(this.selectDevice.length==0){
                    this.$Message.error('请先选择设备');
                    return;
                }
                var self=this;
                this.downloading=true;
                //moxing={type:urltype1,value:urlid}
                var tmpSelectDevice=[];
                var isover=this.selectDevice.length;
                var dbids=[];
                if(moxing.type=='floor'){
                    for(var d in this.selectDevice){
                        $.ajax({
                            url:`/device/deviceconnection/?device2_id=${this.selectDevice[d]}`,
                        }).done(function(res){
                            for(var i in res){
                                res[i].dbid.forEach(dbid=>{
                                    dbids.push(dbid.floorlmvdbid)
                                });
                                tmpSelectDevice.push(res[i].device1id);
                            }
                            isover += -1;
                            if(isover==0){
                                self.over(tmpSelectDevice,dbids);
                            }
                        });
                    }

                }else{
                    for(var d in this.selectDevice){
                        $.ajax({
                            url:`/device/deviceconnection/?device2_id=${this.selectDevice[d]}`,
                        }).done(function(res){
                            var dbids=[];
                            for(var i in res){
                                res[i].dbid.forEach(dbid=>{
                                    dbids.push(dbid.systemlmvdbid)
                                });
                                tmpSelectDevice.push(res[i].device1id);
                            }
                            isover += -1;
                            if(isover==0){
                                self.over(tmpSelectDevice,dbids);
                            }
                        });
                    }
                }

            },
            goUp (){
                if(this.selectDevice.length==0){
                    this.$Message.error('请先选择设备');
                    return;
                }
                var self=this;
                this.uploading=true;
                //moxing={type:urltype1,value:urlid}
                var tmpSelectDevice=[];
                var isover=this.selectDevice.length;
                var dbids=[];
                if(moxing.type=='floor'){
                    for(var d in this.selectDevice){
                        $.ajax({
                            url:`/device/deviceconnection/?device1_id=${this.selectDevice[d]}`,
                        }).done(function(res){
                            for(var i in res){
                                res[i].dbid.forEach(dbid=>{
                                    dbids.push(dbid.floorlmvdbid)
                                });
                                tmpSelectDevice.push(res[i].device2id);
                            }
                            isover += -1;
                            if(isover==0){
                                self.over(tmpSelectDevice,dbids);
                            }
                        });
                    }

                }else{
                    for(var d in this.selectDevice){
                        $.ajax({
                            url:`/device/deviceconnection/?device1_id=${this.selectDevice[d]}`,
                        }).done(function(res){
                            var dbids=[];
                            for(var i in res){
                                res[i].dbid.forEach(dbid=>{
                                    dbids.push(dbid.systemlmvdbid)
                                });
                                tmpSelectDevice.push(res[i].device2id);
                            }
                            isover += -1;
                            if(isover==0){
                                self.over(tmpSelectDevice,dbids);
                            }
                        });
                    }
                }
            },
            over(tmpSelectDevice,dbids){
                this.selectDevice=tmpSelectDevice;
                this.uploading=false;
                this.downloading=false;
                iselect=true;
                _viewer.impl.selector.setSelection(dbids);
                _viewer.utilities.fitToView();
            },
            weixiu(){
                window.open(`/repair/manage/?deviceid=${this.deviceid}`);
            },
            weibao(){
                window.open(`/device/manage/?deviceid=${this.deviceid}`);
            },
            yujing(){
                window.open(`/device/warn/?deviceid=${this.deviceid}`);
            },
            initchart1(myChart){
                
                var option = {
                  tooltip : {
                      trigger: 'item',
                      formatter : function (params) {
                        var date = new Date(params.value[0]);
                        data = date.getFullYear() + '-'
                               + (date.getMonth() + 1) + '-'
                               + date.getDate() + ' '
                               + date.getHours() + ':'
                               + date.getMinutes();
                        return data + '<br/>'
                               + params.value[1] + ', ' 
                               + params.value[2];
                      }
                  },
                  dataZoom: {
                      show: true,
                      start : 70
                  },
                  legend: {
                      data:['蒸汽加湿调节控制','冷热电动二通阀控制','过滤网压差状态','风阀调节控制','送风机开关','送风机故障报警','送风机手动自动状态']
                  },
                  calculable : true,
                  grid: {
                    y2: 80
                  },
                  xAxis : [
                      {
                          type : 'time',
                          splitNumber:10,
                      }
                  ],
                  yAxis : [
                      {
                          type : 'value'
                      }
                  ],
                  series : [
                      {
                          name:'蒸汽加湿调节控制',
                          type:'line',
                          showAllSymbol: true,
                          data: (function () {
                              var d = [];
                              var len = 0;
                              var now = new Date();
                              var value;
                              while (len++ < 15) {
                                  d.push([
                                      new Date(2017, 5, 1, 0, len * 1340),
                                      (Math.random()*30).toFixed(2) - 0,
                                      (Math.random()*100).toFixed(2) - 0
                                  ]);
                              }
                              return d;
                          })()
                      },
                      {
                          name:'冷热电动二通阀控制',
                          type:'line',
                          data: (function () {
                              var d = [];
                              var len = 0;
                              var now = new Date();
                              var value;
                              while (len++ < 15) {
                                  d.push([
                                      new Date(2017, 5, 1, 0, len * 1340),
                                      (Math.random()*30).toFixed(2) - 0,
                                      (Math.random()*100).toFixed(2) - 0
                                  ]);
                              }
                              return d;
                          })()

                      },
                      {
                          name:'过滤网压差状态',
                          type:'line',
                          data: (function () {
                              var d = [];
                              var len = 0;
                              var now = new Date();
                              var value;
                              while (len++ < 15) {
                                  d.push([
                                      new Date(2017, 5, 1, 0, len * 1340),
                                      (Math.random()*30).toFixed(2) - 0,
                                      (Math.random()*100).toFixed(2) - 0
                                  ]);
                              }
                              return d;
                          })()

                      },
                      {
                          name:'风阀调节控制',
                          type:'line',
                          data: (function () {
                              var d = [];
                              var len = 0;
                              var now = new Date();
                              var value;
                              while (len++ < 15) {
                                  d.push([
                                      new Date(2017, 5, 1, 0, len * 1340),
                                      (Math.random()*30).toFixed(2) - 0,
                                      (Math.random()*100).toFixed(2) - 0
                                  ]);
                              }
                              return d;
                          })()

                      },
                      {
                          name:'送风机开关',
                          type:'line',
                          data: (function () {
                              var d = [];
                              var len = 0;
                              var now = new Date();
                              var value;
                              while (len++ < 15) {
                                  d.push([
                                      new Date(2017, 5, 1, 0, len * 1340),
                                      (Math.random()*30).toFixed(2) - 0,
                                      (Math.random()*100).toFixed(2) - 0
                                  ]);
                              }
                              return d;
                          })()

                      },
                      {
                          name:'送风机故障报警',
                          type:'line',
                          data: (function () {
                              var d = [];
                              var len = 0;
                              var now = new Date();
                              var value;
                              while (len++ < 15) {
                                  d.push([
                                      new Date(2017, 5, 1, 0, len * 1340),
                                      (Math.random()*30).toFixed(2) - 0,
                                      (Math.random()*100).toFixed(2) - 0
                                  ]);
                              }
                              return d;
                          })()

                      },
                      {
                          name:'送风机手动自动状态',
                          type:'line',
                          data: (function () {
                              var d = [];
                              var len = 0;
                              var now = new Date();
                              var value;
                              while (len++ < 15) {
                                  d.push([
                                      new Date(2017, 5, 1, 0, len * 1340),
                                      (Math.random()*30).toFixed(2) - 0,
                                      (Math.random()*100).toFixed(2) - 0
                                  ]);
                              }
                              return d;
                          })()

                      }
                  ]
              };
              myChart.setOption(option, true);
            },

        },
        created(){
        },
        mounted: function () {
            this.initchart1(echarts.init(document.getElementById("chart1")));
            // this.initchart3();
        },
        destroy(){

        }
    });
    // return new _subdevice().$mount("#subdevice");
    _subdevice.$mount("#subdevice");
}
var dbidSensorMap={
  // 26:{name:'回风温湿度监视',title:'27℃/39%',color:'blue'},
  49:[{name:'蒸汽加湿调节控制',title:'30%',color:'#36B06A',p:[0,-34]},
      {name:'蒸汽加湿开度反馈',title:'32%',color:'#36B06A',p:[0,-68]}
  ],
  35:[{name:'冷热电动二通阀控制',title:'41%',color:'#36B06A',p:[0,0]},
      {name:'冷热电动二通阀开度反馈',title:'41%',color:'#36B06A',p:[0,34]},
  ],
  // 1:{name:'室内空气质量VOC检测',title:'0.60mg/m3',color:'blue'},
  46:[{name:'过滤网压差状态',title:'过低',color:'#ed3f14',p:[0,-68]}],
  // 48:{name:'防冻保护',title:'报警',color:'red'},
  50:[{name:'风阀状态/调节控制',title:'75%/70%',color:'#36B06A',p:[0,34]}],
  // 24:{name:'风阀状态',title:'75%',color:'blue'},
  56:[
    {name:'送风机开关',title:'开',color:'#36B06A',p:[0,34]},
    {name:'送风机故障报警',title:'关',color:'#36B06A',p:[0,-34]},
    {name:'送风机手动自动状态',title:'自动',color:'#36B06A',p:[0,0]},
  ]
};
function loadDeviceComplete(){
  _subviewer.setGhosting(true);
  _subviewer.hide([59,62,63,29,30]);
  _subviewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, cameraChange);
  _subviewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, SelectedCallback);
  _subdevice.sensors1=[
      {name:'回风温湿度监视',title:'27℃/39%',color:'red',style:{left:'20px',top:'130px'}},
      {name:'室内空气质量VOC检测',title:'0.60mg/m3',color:'green',style:{left:'120px',top:'90px'}},
      {name:'防冻保护',title:'16DBM',color:'green',style:{left:'480px',top:'200px'}},
      // {name:'风阀状态',title:'75%',color:'red',style:{left:'320px',top:'330px'}},
  ];
  // transViewCustom();
  updateSensorDate();
}

function updateSensorDate(){
  var dbidlist = [49,35,46,50,56];
  _subdevice.sensors=[];
  dbidlist.forEach(function(dbid){
    worldToClient(dbid);
  })
  
}

function transViewCustom(){
  var newCamPos = new THREE.Vector3(-0.9476211667060852,0.3321802616119385,14.724390029907227);
  var target = new THREE.Vector3(0,0,0);
  var cam=_subviewer.navigation.getCamera();
  var newRotation = new THREE.Vector3(-0.022556039541616293,-0.06425230550985349,1.2766917848834338);
  cam.setRotationFromAxisAngle(newRotation);
  // _subviewer.navigation.setRequestTransition(true,newCamPos,target,cam.fov);
  _subviewer.navigation.setView(newCamPos,target);
}

function worldToClient(dbid){
  var it = _subviewer.model.getData().instanceTree;
  // var fragIds = [];
  it.enumNodeFragments(dbid,(fragId,dbid)=>{
    // fragIds.push(dbid);
    var nodebBox = new THREE.Box3();
    var fragbBox = new THREE.Box3();
    var fragList = _subviewer.model.getFragmentList();
    // fragIds.forEach(function(fragId) {
      fragList.getWorldBounds(fragId, fragbBox);
      nodebBox.union(fragbBox);
    // });

    var center = nodebBox.center();
    // var m = _subviewer.worldToClient(nodebBox.min);
    var c = _subviewer.worldToClient(center);
    // var x = c.x+dbidSensorMap[dbid].p[0];
    // var y = c.y+dbidSensorMap[dbid].p[1];
    var x = c.x;
    dbidSensorMap[dbid].forEach(function(o){
      var y = c.y+o.p[1];
      _subdevice.sensors.push({name:o.name,title:o.title,style:{left:x+'px',top:y+'px',color:o.color}});
    })
    
  },true);
  
}

function SelectedCallback (object){
    console.log(object.dbIdArray[0]);

}
