var _isWholeModel = false;
var _viewer = null;
var _stat = null;
var _curUnitId = ""; //单位工程
var _curMajor = ""; //专业
var _selElevations = ""; //楼层 ,字符串格式 1,2
var _selZones = ""; //区域
var _selPbtypes = ""; //构件类型 ,字符串格式 1,2

var _selectionmode = "";
var _homeview = []; //模型初始位置

var _selectedId = null;
var _modellist = [];
var _selectDbids = [];
var _selectPbtypes = new Set();

var _floorData = [];
var _hideData = [];

var _group2dbidmaps = {};
var _dbid2groupmaps = {};
var _beGroupMapDataLoad = false;

var _mouseXY = null;

var sqlitdb = {};
var filestep = 'getmodel';
var filenewurl ='';
var nofilebacpath = '';

var colorSelected = null;

var pagy = 10;
let serverIp = "/api";
function changeIp(where) {
    if(where == "dev") {
        serverIp="/api";
    }else {
        serverIp = localStorage.server;
    }    
}

if(!colorSelected) {
    colorSelected = new THREE.Vector4(255 / 255, 192 / 255, 203 / 255, 0.5);
  }
//www下1.txt文件文件路径，用于webserver找不到文件后返回到浏览器
// window.resolveLocalFileSystemURL(cordova.file.applicationDirectory,function(fs){
//         fs.getDirectory('www',{create:false},function(entry){
//             entry.getFile('1.txt',{create:false},function(ds){
//             console.log('找到1.txt文件');
//             nofilebacpath = ds.toURL().substr(7,ds.toURL().length);
//         },function(error){
//             console.log('找不到1.txt文件');
//             console.log(error);
//         })
//     },function(error){
//          console.log('找不到www文件');
//     })
// })

//cordova 缓存代码
function choselocalmodel(data){
    filenewurl = '';
  selectdb(data);
}

function selectdb(data){
    let select = null;
      sqlitdb = window.sqlitePlugin.openDatabase({name: "my.db", location: 'default', createFromLocation: 2});
      sqlitdb.transaction(function(tx) {
        tx.executeSql("SELECT path, version FROM model_table WHERE projectid = ? AND unitid = ? AND majorid = ? AND modelid = ?",[data.projectid,data.unitid,data.majorid,data.modelid], function (zx, resultSet) {
          console.log("select:" + resultSet);
          for(var x = 0; x < resultSet.rows.length; x++) {
            console.log("path: " + resultSet.rows.item(x).path +
              ", version: " + resultSet.rows.item(x).version);
          };
          console.log('查询成功');
          console.log(resultSet.rows);
          select = resultSet.rows;

        },function(error){
          console.log('查询失败');
          console.log(error);
        })
      },function (error) {

        sqlitdb.close();
      },function () {
        console.log('close3 ok');
        sqlitdb.close();
        chosemodel(select,data);
      })
}

function chosemodel(selectdata,newdata){
  console.log('nextdo');
  if(selectdata.length > 0){//如果数据库里面有数据
    console.log(selectdata.item(0));
    console.log(selectdata.item(0).version);
    if(selectdata.item(0).version == newdata.version){
      console.log('加载原模型');
      console.log(selectdata.item(0).path);
      loadDocument(selectdata.item(0).path);
      filestep = 'getmodel';
    }else{
      console.log('更新模型');
      filestep = 'update';
      removeaddfile(`${newdata.projectid}a${newdata.unitid}a${newdata.majorid}a${newdata.modelid}`,newdata);
    }
  }else{//如果数据库里面没有数据
    filestep = 'down';
    console.log('下载模型模型');
    createDirectory(`${newdata.projectid}a${newdata.unitid}a${newdata.majorid}a${newdata.modelid}`,newdata);
  }
}

function createDirectory(name,data) {
  console.log('createDirectory');
  console.log(name);
  window.resolveLocalFileSystemURL(cordova.file.documentsDirectory, function (fs) {
    console.log('fsname');
    console.log(fs);
      fs.getDirectory('NewDirInRoot', {create: true}, function (dirEntry) {
        console.log('www路径');
        console.log(dirEntry);
        dirEntry.getDirectory(name,{create: true}, function (entry) {
          console.log('创建下载文件夹:');
          downzip(entry,name,data);
        }, function (error) {
          console.log('创建下载文件夹报错:'+error);
          console.log(error);
        })
      }, function(error){
        console.log(error);
      })
  },function(error){
    console.log('createDirectory'+error);
  })
}

function removeaddfile(name,data) {
  console.log(name);
  window.resolveLocalFileSystemURL(cordova.file.documentsDirectory, function (fs) {
    fs.getDirectory('NewDirInRoot', {create: false}, function (entry) {
      entry.getDirectory(name, {create: false}, function (e) {
        e.removeRecursively(function () {
          console.log('删除文件成功');
          entry.getDirectory(name, {create: true}, function (ex) {
            downzip(ex,name,data);
          })
        }, function (err) {
          console.log('删除文件失败')
        });
      }, function (error) {
        console.log('文件夹不存')
      })
    })
  })
}

function downzip(fileEnter,name,data) {
    console.log('downzip');
    console.log(data.path);
    var percent = 0;
    var fileTransfer = new FileTransfer();
    _Wvue.$store.commit('setpercentstate','下载中....');
    fileTransfer.onprogress = function(progressEvent) {
       if(progressEvent.lengthComputable) {
            percent = (progressEvent.loaded / progressEvent.total)*100;
            console.log('下载中1212');
            console.log(percent);
            _Wvue.$store.commit('setpercent',parseInt(percent));
       }       

    };
    console.log(fileEnter);
    let url = encodeURI(data.path);
    var fileURL = fileEnter.toURL() + name +".zip";
    fileTransfer.download(
    url,
    fileURL,
    function (entry) {
      console.log('fileEnter:' + fileURL);
      console.log("download complete: " + entry.toURL());
      unzip(entry.toURL(), fileEnter,name,data);
    },
    function (error) {
      console.log("download error source " + error.source);
      console.log("download error target " + error.target);
      console.log("download error code" + error.code);
    },
    false,
    {
      headers: {
        "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
      }
    }
  )
}

function unzip(pathUrl, url,name,data) {
    console.log('unzip');
    var PathToFileInString = pathUrl,
      PathToResultZip = url.toURL();
    console.log('PathToFileInString', PathToFileInString);
    console.log('PathToResultZip', PathToResultZip);
    window.zip.unzip(PathToFileInString, PathToResultZip, function (res) {
    console.log('解压成功');
    let lengthReader = url.createReader();
    lengthReader.readEntries(function(entr){
        if(entr.length <= 1){
            alert('模型文件压缩格式错误，重新加载服务器模型');
            url.removeRecursively(function () {
              console.log('删除文件成功');   
            }, function (err) {
              console.log('删除文件失败')
            });
            loadDocument(data.modelfile);
        }else{
            getsvf(url,data);
        }
    })
    // url.getFile(data.svfname,{ create: true, exclusive: false },function(enter){
    //     let newdata = data;
    //     let suburl = dirEntry.toURL()+newfilelist[i].name;
    //     newdata.newpath = suburl.substr(7,substr.length);
    //     if(filestep == 'update'){
    //       updatedb(newdata);
    //     }else if(filestep == 'down'){
    //       insertdb(newdata);
    //     }
    // })
    // console.log(data);
  }, function (progressEvent) {
    console.log('unzip失败:');
    console.log(progressEvent);
  })
}
function updatedb(data){
    sqlitdb = window.sqlitePlugin.openDatabase({name: "my.db", location: 'default', createFromLocation: 2});
    sqlitdb.transaction(function(tx) {
    tx.executeSql("UPDATE model_table SET path = ? , version = ? WHERE projectid = ? AND unitid = ? AND majorid = ? AND modelid = ?",[data.projectid,data.newpath,data.version,data.unitid,data.majorid,data.modelid],function(t, res){
        console.log('更新数据成功');
        loadDocument(data.newpath);
    },function(error){
        console.log('更新数据失败');
    })
    },function(error){
        console.log('更新数据失败2');
        console.log(error);
        sqlitdb.close();
    },function(){
        console.log('close4');
        sqlitdb.close();
    })
}
function insertdb(data){
      sqlitdb = window.sqlitePlugin.openDatabase({name: "my.db", location: 'default', createFromLocation: 2});
      sqlitdb.transaction(function(tx) {
        tx.executeSql("INSERT INTO model_table (projectid,unitid, majorid,modelid,path,version) VALUES (?,?,?,?,?,?)",[data.projectid,data.unitid,data.majorid,data.modelid,data.newpath,data.version],function (tx,res) {
          console.log("插入数据成功");
          console.log(data.newpath);
          loadDocument(data.newpath);
        },function (error) {
          sqlitdb.close();
          console.log('插入数据失败:'+ error);
        })
      },function(error){
        sqlitdb.close();
        console.log('插入数据失败:111'+ error);
      },function(){
        console.log('close2 ok');
        sqlitdb.close();
      })
}
function getsvf(dirEntry,data){
    if(filenewurl !=''){
        return true;
    };
    var directoryReader = dirEntry.createReader();
    directoryReader.readEntries(function(entries){
        console.log('查找文件名成功');
        console.log(entries.length);
        console.log(data);
        var newfilelist = new Array(entries.length);
        var svfname = null;
        for (var i = 0; i < entries.length; i++) {
          newfilelist[i] = {};
          newfilelist[i].name = entries[i].name;
          console.log(newfilelist[i].name);

          if(newfilelist[i].name.indexOf('svf') == -1){
            dirEntry.getDirectory(entries[i].name, {create:false}, function(fs){
                console.log('获取到的fs');
                console.log(fs.toURL());
                getsvf(fs,data)
            });
          }else{
            let newdata = data;
            filenewurl = dirEntry.toURL()+newfilelist[i].name;
            newdata.newpath = "http://localhost:8080"+filenewurl.substring(7,filenewurl.length);
            console.log('获取到的newpath');
            console.log(newdata.newpath);
            if(filestep == 'update'){
              updatedb(newdata);
            }else if(filestep == 'down'){
              insertdb(newdata);
            }
            return true;
          }
        }
    })
}


//加载默认模型
function loadInitialModel() {
    mui.ajax({
        type: "get",
        url: serverIp + "/task/modelview/getinitialmodel/?token="+_Wvue.$store.state.sessionid,
        cache: false,
        dataType: "json",
        success: function(data) {
            if(data.issuc == "true") {
                _curUnitId = data.unitid;
                _curMajor = data.majorid;
                _isWholeModel = data.iswhole;
                _selectionmode = data.selectionmode;
                _homeview = eval(data.homeview);
                _extdata = eval(data.extdata);
                var options = {};
                options.env = "Local"; // AutodeskProduction, AutodeskStaging, or AutodeskDevelopment (set in global var in this project)
                options.document = serverIp+data.modelfile;
                if(_extdata.saveInOss){
                    options.document = data.modelfile;
                }
                if(_extdata.groups) {
                    _beGroupMapDataLoad = false;
                    getgroupmaps();
                }

                // options.document = '/src/models/tujianjiegou20170726/LMV/0/0.svf';
                _Wvue.$store.commit("setbelongmodel",Number(data.modelid));
                elevations();pbtypes(); 
                loadDocument(options.document);
            }

            //          LoadAllCustomTrees();
        }
    });
}

function getModelFile() {
    if(localStorage.modelvalue){
      _curUnitId = localStorage.modelvalue.split(',')[0];
      _curMajor = localStorage.modelvalue.split(',')[1];
    }
    $.ajax({
        type: "get",
        url: serverIp + "/task/modelview/getmodelfile/?token="+_Wvue.$store.state.sessionid,
        cache: false,
        dataType: "json",
        data: {
            "_curMajor": _curMajor,
            "_curUnitId": _curUnitId,
        },
        success: function(data) {
            if(data.issuc == "true") {
                _curUnitId = data.unitid;
                _curMajor = data.majorid;
                _isWholeModel = data.iswhole;
                _selectionmode = data.selectionmode;
                _homeview = eval(data.homeview);
                _extdata = eval(data.extdata);

                let modelfile= serverIp+data.modelfile;
                if(_extdata.saveInOss){
                    modelfile = data.modelfile;
                }
                if(_extdata.groups) {
                    _beGroupMapDataLoad = false;
                    getgroupmaps();
                }
                 _Wvue.$store.commit("setbelongmodel",Number(data.modelid));

                let i = modelfile.lastIndexOf("/");
                let svfname = modelfile.substring(i+1,modelfile.length);
                let obj = {
                    projectid:_Wvue.$store.state.projectid,
                    unitid:data.unitid,
                    majorid:data.majorid,
                    modelid:data.modelid,
                    path:data.modelzipfile,
                    version:data.version,//版本
                    svfname:svfname,
                    newpath:'',
                    modelfile:modelfile,
                };
                if(serverIp == '/api' || !data.modelzipfile){
                    loadDocument(modelfile);
                }else{
                    choselocalmodel(obj);//选择是否要用本地数据
                }
                elevations();pbtypes();
            } else {
                alert("没有对应单位工程专业模型！");
            }
        }
    });
}

function getgroupmaps() {

    $.ajax({
        type: "get",
        url: serverIp + "/task/modelview/getgroupmaps/?token="+_Wvue.$store.state.sessionid,
        cache: false,
        dataType: "json",
        data: {
            "_curMajor": _curMajor,
            "_curUnitId": _curUnitId,
        },
        success: function(data) {
            if(data.res) {
                _dbid2groupmaps = data.dbid2groupmaps;
                _group2dbidmaps = data.group2dbidmaps;
                _beGroupMapDataLoad = true;
            } else {
                alert("加载构件组-构件关系失败！");
            }
        }
    });
}
//获取所有模型
function getmodelfiles() {
    mui.ajax({
        url: serverIp + "/task/modelfiles/?token="+_Wvue.$store.state.sessionid,
        type: "get",
        cache: false,
        dataType: "json",
        data: {
            perPage: 999999
        },
        success: function(data) {
            console.log(JSON.stringify(data));
            _modellist = data.results;
        }
    });
}

function pbtypes(perPage) {

    var options = {};
    if(perPage == null || perPage == '') {
        perPage = 999999;
    }
    options.perPage = perPage;
    options.major = _curMajor;
    mui.ajax(serverIp + '/task/pbtypes/?token='+_Wvue.$store.state.sessionid, {
        data: options,
        dataType: 'json', //服务器返回json格式数据
        type: 'get', //HTTP请求类型
        timeout: 10000, //超时时间设置为10秒；
        success: function(data) {
            console.log(JSON.stringify(data));
            _hideData = [];
            for(var i=0;i<_modellist.length;i++){
                if(_modellist[i].relatedmajorid==_curMajor){
//                      _modellist[i].list = data.results;
                    var hd = _modellist[i];
                    hd.list = data.results;
                    _hideData.push(hd);
                }
            }
        },
        error: function(xhr, type, errorThrown) {
            console.log(type);
        }
    });
}
function elevations(perPage) {
    var that = this;
    var options = {};
    if(perPage == null || perPage == '') {
        perPage = 999999;
    }
    options.perPage = perPage;
    options.unitproject = _curUnitId;
    mui.ajax(serverIp + '/task/elevations/?token='+_Wvue.$store.state.sessionid, {
        data: options,
        dataType: 'json', //服务器返回json格式数据
        type: 'get', //HTTP请求类型
        timeout: 10000, //超时时间设置为10秒；
        success: function(data) {
//              console.log(JSON.stringify(data));
            _floorData = data.results;
        },
        error: function(xhr, type, errorThrown) {
            console.log(type);
        }
    });
}

// initialize the viewer into the HTML placeholder
function initializeViewer() {

    if(_viewer !== null) {
        //_viewer.uninitialize();
        _viewer.finish();
        _viewer = null;
    }
    // _viewer = new Autodesk.Viewing.Viewer3D(document.getElementById("viewer"), {});
    _viewer = new Autodesk.Viewing.Private.GuiViewer3D(document.getElementById("viewer"), {});

    var retCode = _viewer.initialize();
    if(retCode !== 0) {
        alert("ERROR: Couldn't initialize viewer!");
        console.log("ERROR Code: " + retCode); // TBD: do real error handling here
    }

}

// load a specific document into the intialized viewer
function loadDocument(urnStr) {
    $(".jindu").css('display','flex');//弹出静态页面
    // $(".jindu").fadeOut();

    if(!urnStr || (0 === urnStr.length)) {
        alert("You must specify a URN!");
        return;
    }

    initializeViewer();

    var fullUrnStr = urnStr;
    //清理Viewer
     _viewer.tearDown();
    //再次初始化Viewr
     _viewer.setUp();

    _viewer.load(fullUrnStr,'',null,function(err){
        $(".jindu").fadeOut();
        _Wvue.$store.commit('setpercent',null);
        _Wvue.$store.commit('setpercentstate',null);
        _viewer.displayViewCube( true );
        _Wvue.$Message.error('模型加载失败');
    });

    _viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function(e) {
        if(_viewer.model) {

            customViewer();
//          setContextMenu();
            _viewer.getObjectTree(function(objTree) {
                if(localStorage.colorstate){
                  getpbstatuslist(localStorage.colorstate);
                }else{
                  getpbstatuslist(`/task/modelview/getpbstatuslist/`);
                }
            });
            _viewer.createViewCube();//出現視圖控制
            _viewer.displayViewCube( true );
            // _viewer.displayHomeandInfoButton(false);
            const measureExtension = _viewer.getExtension( 'Autodesk.Measure' );

            // 当前量测工具支持的单位:
            // 'decimal-ft'
            // 'ft-and-fractional-in'
            // 'ft-and-decimal-in'
            // 'decimal-in'
            // 'fractional-in'
            // 'm'
            // 'cm'
            // 'mm'
            // 'm-and-cm'

            measureExtension.setUnits( 'm' );

        }
    });
    _viewer.navigation.toPerspective();
    _viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, onSelectedCallback);
    _viewer.addEventListener(Autodesk.Viewing.PROGRESS_UPDATE_EVENT, onProgressUpdateCallback);
    _viewer.setGhosting(true);//设置是否有网格线

    _viewer.setBackgroundColor(48, 153, 225, 255, 255, 255);

    _viewer.unloadExtension('Autodesk.ADN.Viewing.Extension.RadialMenu');
    _viewer.loadExtension('Autodesk.ADN.Viewing.Extension.RadialMenu');

    _viewer.impl.setGhostingBrightnessFunc();


}

function transPblist(dbIds) {
  var addDbids = [];
  dbIds.forEach(val => {
    if(!_selectDbids[val]) {
      addDbids.push(val);
    }

  });

  if(addDbids.length == 0) {
    return;
  }

  // _Wvue.$Message.loading({
  //   content: '正在获取对应构件信息，请稍后...',
  //   duration: 0
  // });
  $.ajax({
    type: "post",
    url: serverIp+"/task/goujian/transpblist/?token="+_Wvue.$store.state.sessionid,
    cache: false,
    dataType: "json",
    data: {
      "type": "dbIdslist",
      "_curUnitId": _curUnitId,
      "_curMajor": _curMajor,
      "_selElevations": _selElevations,
      "_selPbtypes": _selPbtypes,
      "_selZones": _selZones,
      "dbIdslist": JSON.stringify(addDbids)
    },
    success: function(data) {
      if(data.res) {

        var hasError = false;
        data.pblist.forEach(val => {
          if(_selectPbtypes.size > 0 && !_selectPbtypes.has(val.pbtype)) {
            let error = "只能同时选择一种构件类型，已选:"
            for(var x of _selectPbtypes) {
              error += x;
            }
            error += "," + val.pbtype
            _Wvue.$Message.error(error);
            hasError = true;
            return;
          } else {
            _selectPbtypes.add(val.pbtype);
            // dbIds.forEach(val => {
            //   if(!_selectDbids[val]) {
            //     _viewer.setThemingColor(val, new THREE.Vector4(0.82, 0.33, 0.33, 0.5))
            //   }

            // });
          }
        });



        if(!hasError) {
          _Wvue.$store.commit('setopenadd',2);
           _Wvue.$store.commit('setchangestate',true);
          _Wvue.$store.commit('setselectlist',data);
          data.pblist.forEach(val => {

            if(_extdata.groups) {
              if(_beGroupMapDataLoad) {
                var groupdbids = _group2dbidmaps[val.id];
                console.log(groupdbids);
                if(groupdbids) {
                  groupdbids.forEach(dbid => {
                    _selectDbids[dbid] = true;
                    _viewer.setThemingColor(dbid, colorSelected);
                    setChildThemingColor(dbid, colorSelected);
                  })

                }
              }
            }

            if(!_selectDbids[val.dbid]) {
              _selectDbids[val.dbid] = true;
              _viewer.setThemingColor(val.dbid, colorSelected);
              setChildThemingColor(val.dbid, colorSelected);
            }
          });
        }

      } else {
        addDbids.forEach(val => {
          delete _selectDbids[val];
          _viewer.setThemingColor(val, null);
          setChildThemingColor(val, null);
        });


        alert(data.error);
      }
    },
    error: function(data) {
      alert("服务器错误");
      return false;
    },
  });
}

function deletepbfromList(val,index) {
  if(index == 0){
    _selectPbtypes.clear();
  }
  _viewer.setThemingColor(val.dbid, null);
  setChildThemingColor(val.dbid, null);
  delete _selectDbids[val.dbid];

  if(_extdata.groups) {
    if(_beGroupMapDataLoad) {
      var groupdbids = _group2dbidmaps[val.id];
      if(groupdbids) {
        groupdbids.forEach(dbid => {
          _viewer.setThemingColor(dbid, null);
          setChildThemingColor(dbid, null);
          delete _selectDbids[dbid];
        })

      }
    }
  }

}

function setGhostingBrightness2(color=0x101010,opacity=0.1){

    this.fadeMaterial.color = new THREE.Color(color);
    this.fadeMaterial.opacity = opacity;

    _viewer.impl.invalidate(true,false,false);
}
function onProgressUpdateCallback(value){//控制进度页面
    console.info('控制进度页面');
    console.info(value);
    _Wvue.$store.commit('setpercentstate','渲染中....');
    if(value.state == 1){
        _Wvue.$store.commit('setpercent',parseInt(value.percent*0.5));
    }else if(value.state == 2){
        _Wvue.$store.commit('setpercent',parseInt(value.percent*0.5) + 50);
    }
    if(value.state == 2 && value.percent == 100){
        _viewer.removeEventListener(Autodesk.Viewing.PROGRESS_UPDATE_EVENT, onProgressUpdateCallback);
        setTimeout(function(){
            $(".jindu").fadeOut();
            _Wvue.$store.commit('setpercent',null);
            _Wvue.$store.commit('setpercentstate',null);
            _viewer.displayViewCube( true );

        },1000);
    }

}
    
avp.Viewer3DImpl.prototype.setGhostingBrightnessFunc = function()
{
    this.setGhostingBrightness = setGhostingBrightness2;
   
};




function onNodeSelectProc(id,type="dbid"){
    getpbproperty(id,type);
}

//模型选中回调
var selIndex=false;
function onSelectedCallback(event) {
    console.log(event);

    if(event.dbIdArray.length > 0) {
        _selectedId = event.dbIdArray[0];
        console.log(_selectedId);

        if(_extdata.groups && _Wvue.$store.state.goujianstatus == 'big') {
            if(1 == event.dbIdArray.length) {
                if(_beGroupMapDataLoad) {
                    group = _dbid2groupmaps[_selectedId];
                    groupdbids = _group2dbidmaps[group];
                    console.log(groupdbids);
                    if(groupdbids) {
                        _viewer.select(groupdbids);
                        onNodeSelectProc(group, "pbid");
                    } else {
                        //alert("没有找到构件，对应构件组！");
                        onNodeSelectProc(_selectedId);
                    }
                } else {
                    alert("正在加载构件组-构件关系，请稍后选择构件！");
                }
            }

        } 
        else
         {
            onNodeSelectProc(_selectedId);
          }
        // getpbproperty(_selectedId);
        getrelatefilelist(_selectedId);

    }else{
        _selectedId = null;
    }

    if(_Wvue.$store.state.select){
      transPblist(event.dbIdArray);
      return false;
    }

    return false;
}

function setContextMenu() {
    Autodesk.ADN.Viewing.Extension.AdnContextMenu = function(viewer) {
        Autodesk.Viewing.Extensions.ViewerObjectContextMenu.call(this, viewer);
    };

    Autodesk.ADN.Viewing.Extension.AdnContextMenu.prototype =
        Object.create(Autodesk.Viewing.Extensions.ViewerObjectContextMenu.prototype);

    Autodesk.ADN.Viewing.Extension.AdnContextMenu.prototype.constructor =
        Autodesk.ADN.Viewing.Extension.AdnContextMenu;

    Autodesk.ADN.Viewing.Extension.AdnContextMenu.prototype.buildMenu =

        function(event, status) {

            var menu = Autodesk.Viewing.Extensions.ViewerObjectContextMenu.prototype.buildMenu.call(
                this, event, status);

            if(_selectedId) {
                menu.push({
                    title: "质量验收",
                    target: function() {
                        pbrelatefile(_selectedId,"local");
                    }
                });
                menu.push({
                    title: "发起问题",
                    target: function() {
                        pbrelatefile(_selectedId,"cloud");
                    }
                });
            }
            return menu;
        };

    _viewer.setContextMenu(new Autodesk.ADN.Viewing.Extension.AdnContextMenu(_viewer));

}

function setPbStatus(data) {
    _pbDbidList = [];
    for(var each in data.pbstatuslist) {
        var color = getColorByStr(data.pbstatuslist[each].color);
        for(var eachpb in data.pbstatuslist[each].pblist) {

            if(_extdata.groups && data.pbstatuslist[each].pblist[eachpb].lvmdbid == null) {
                if(_beGroupMapDataLoad) {
                    var groupdbids = _group2dbidmaps[data.pbstatuslist[each].pblist[eachpb].id];
                    console.log(groupdbids);
                    if(groupdbids) {
                        groupdbids.forEach(dbid => {
                            _pbDbidList.push(dbid);
                            _viewer.setThemingColor(dbid, color);
                            setChildThemingColor(dbid, color);
                        })

                    }
                }
            } else {
                _viewer.setThemingColor(parseInt(data.pbstatuslist[each].pblist[eachpb].lvmdbid), color);
                setChildThemingColor(parseInt(data.pbstatuslist[each].pblist[eachpb].lvmdbid), color);
                _pbDbidList.push(parseInt(data.pbstatuslist[each].pblist[eachpb].lvmdbid));
            }

        }
    }

    
}

function setFliterPb(data) {
    var dbids = [];
    for(var each in data.pblist) {
        if(_extdata.groups && data.pblist[each].lvmdbid == null) {
            if(_beGroupMapDataLoad) {
                var groupdbids = _group2dbidmaps[data.pblist[each].id];
                console.log(groupdbids);
                if(groupdbids) {
                    groupdbids.forEach(dbid => {
                        dbids.push(dbid);
                    })

                }
            }
        } else {
            dbids.push(parseInt(data.pblist[each].lvmdbid));
        }

    }
    _viewer.isolateById(dbids);


}

//构件筛选
function filterPblist() {
    if(_selectedId){
        setChildThemingColor(_selectedId, null);
    }
    _viewer.setCutPlanes();
    mui.ajax({
        type: "get",
        url: serverIp + "/task/modelview/filterPblist/?token="+_Wvue.$store.state.sessionid,
        cache: false,
        dataType: "json",
        data: {
            "_selElevations": _selElevations,
            "_selPbtypes": _selPbtypes,
            "_curUnitId": _curUnitId,
            "_selZones": _selZones,
            "_curMajor": _curMajor,
        },
        success: function(data) {
            setFliterPb(data);
        }
    });
}
//获取构件属性
function getpbproperty(id,type) {
    var dbId='';
    var pbId='';
    if(type=="dbid"){
        dbId=id;
    }else if(type=="pbid"){
        pbId=id;
    }
    mui.ajax({
        type: "get",
        url: `${serverIp}/task/modelview/getpbproperty/?token=`+_Wvue.$store.state.sessionid,
        cache: false,
        dataType: "json",
        data: {
            "dbId": dbId,
            "pbId": pbId,
            "_curUnitId": _curUnitId,
            "_curMajor": _curMajor,
        },
        success: function(data) {
            if(data.issuc == "true") {
                console.log(data);
                _Wvue.$store.commit('getpbproperty',"{}");
                _Wvue.$store.commit('getpbproperty',JSON.stringify(data));
            } else {
            }

        }
    });
}

//获取关联文件

function getrelatefilelist(dbId) {
    mui.ajax({
        type: "get",
        url: `${serverIp}/task/modelview/getrelatefilelist/?token=`+_Wvue.$store.state.sessionid,
        cache: false,
        dataType: "json",
        data: {
            "RelateId": dbId,
            "RelateType": "构件",
        },
        success: function(data){
            if(data.issuc == "true") {
                _Wvue.$store.commit('getrelatefilelist',"[]");
                _Wvue.$store.commit('getrelatefilelist',JSON.stringify(data.filelist));
            }
        }
    })
}

//获取构件状态
function getpbstatuslist(url) {
    _viewer.clearThemingColors();
    mui.ajax({
        type: "get",
        url: `${serverIp}${url}?token=`+_Wvue.$store.state.sessionid,
        cache: false,
        dataType: "json",
        data: {
            "_selElevations": _selElevations,
            "_selPbtypes": _selPbtypes,
            "_curUnitId": _curUnitId,
            "_selZones": _selZones,
            "_curMajor": _curMajor,
            "_isWholeModel": _isWholeModel,
        },
        success: function(data) {
            if(data.issuc == "true") {
               setPbStatus(data);
               if(_pbDbidList.length>0){
                    _viewer.isolateById(_pbDbidList);
               }else{
                    _viewer.hide(1);
               }
            }
        }
    });
}

function getpbstatuscolor(where) {
    let colorarr = [];
    if(where == 'plan' || where == 'all') {
        $.ajax({
            type: "get",
            url: `${serverIp}/task/modelview/getcounttypelist/?token=`+_Wvue.$store.state.sessionid,
            cache: false,
            async: false,
            dataType: "json",
            data: {
                "_curUnitId":_curUnitId,
                "_curMajor":_curMajor,
                "_isWholeModel":_isWholeModel
            },
            success: function(data){
                colorarr = data.counttypelist;
            }
        })
    }else if(where == 'quality'){
        colorarr = [
            {
                color:"#e1b274",
                name:"质量问题"
            },
            {
                color:"#f6f634",
                name:"验收提示"
            }
        ]
    }else if(where == 'safety'){
        colorarr = [
            {
                color:"#ED002F",
                name:"安全告警"
            },
            {
                color:"#BAF300",
                name:"危险源"
            },
            {
                color:"#00A779",
                name:"安全检查"
            }
        ]
    }
    return colorarr;
}

function transViewCustom() {
    if(_homeview.length >= 3) {
        //var newCamPos = new THREE.Vector3(-149715.3552195181,-119243.66328031197,34681.408770079055);
        var newCamPos = new THREE.Vector3(_homeview[0], _homeview[1], _homeview[2]);

        var target = new THREE.Vector3(0, 0, 0);
        var cam = _viewer.navigation.getCamera();
        _viewer.navigation.setRequestTransition(true, newCamPos, target, cam.fov);
    }
}

var _modeindex = 0;

function customViewer() {

    if(_selectionmode=="FIRST_OBJECT"){
        _viewer.setSelectionMode(Autodesk.Viewing.SelectionMode.FIRST_OBJECT);
    }else if(_selectionmode=="LAST_OBJECT"){
        _viewer.setSelectionMode(Autodesk.Viewing.SelectionMode.LAST_OBJECT);
    }

    //
    transViewCustom();
    setTimeout(function() {
        _viewer.autocam.setCurrentViewAsHome();
    }, 1000);

    //custom background color-----[pgb]
    //  _viewer.setBackgroundColor(48, 153, 225, 255, 255, 255);
    //_viewer.setBackgroundColor(60, 141, 188, 255,255, 255);

    // var viewerToolbar = _viewer.getToolbar(true);
    // var navTools = viewerToolbar.getControl(Autodesk.Viewing.TOOLBAR.NAVTOOLSID);
    // viewerToolbar.removeControl(navTools);
    // var modelTools = viewerToolbar.getControl(Autodesk.Viewing.TOOLBAR.MODELTOOLSID);
    // viewerToolbar.removeControl(modelTools);
    // var settingsTools = viewerToolbar.getControl(Autodesk.Viewing.TOOLBAR.SETTINGSTOOLSID);
    // viewerToolbar.removeControl(settingsTools);

}

function getMeshPosition(fragId) {

    var mesh = _viewer.impl.getRenderProxy(_viewer.model, fragId);

    var pos = new THREE.Vector3();

    pos.setFromMatrixPosition(mesh.matrixWorld);

    return pos;
}

function getColorByStr(strColor) {
    var color = null;
    if(strColor != undefined && strColor.length == 7) {
        var r = (parseFloat(parseInt(strColor.substr(1, 2), 16) / 255).toFixed(2));
        var g = (parseFloat(parseInt(strColor.substr(3, 2), 16) / 255).toFixed(2));
        var b = (parseFloat(parseInt(strColor.substr(5, 2), 16) / 255).toFixed(2));

        color = new THREE.Vector4(r, g, b, 0.5); // r, g, b, intensity
    }
    return color;
}

function setChildThemingColor(root, color) {

    var it = _viewer.model.getData().instanceTree;

    it.enumNodeChildren(root, function(dbId) {
        _viewer.setThemingColor(dbId, color);
    }, true);

}

function getOriginalWorldBoundingBox(fragIds) {

    var fragBoundingBox = new THREE.Box3();
    var nodeBoundingBox = new THREE.Box3();

    var fragmentBoxes = _viewer.model.getFragmentList().boxes;

    fragIds.forEach(function(fragId) {

        var boffset = fragId * 6;

        fragBoundingBox.min.x = fragmentBoxes[boffset];
        fragBoundingBox.min.y = fragmentBoxes[boffset + 1];
        fragBoundingBox.min.z = fragmentBoxes[boffset + 2];
        fragBoundingBox.max.x = fragmentBoxes[boffset + 3];
        fragBoundingBox.max.y = fragmentBoxes[boffset + 4];
        fragBoundingBox.max.z = fragmentBoxes[boffset + 5];

        nodeBoundingBox.union(fragBoundingBox);
    });

    return nodeBoundingBox;
}

function getModifiedWorldBoundingBox(fragIds) {

    var fragbBox = new THREE.Box3();
    var nodebBox = new THREE.Box3();

    fragList = _viewer.model.getFragmentList();
    fragIds.forEach(function(fragId) {

        fragList.getWorldBounds(fragId, fragbBox);
        nodebBox.union(fragbBox);
    });

    return nodebBox;
}

function getFragmentIdByDbIds(objectIds) {
    var FragmentIds = [];

    var it = _viewer.model.getData().instanceTree;
    for(var i = 0; i < objectIds.length; i++) {

        var dbid = objectIds[i];

        it.enumNodeFragments(dbid, function(fragId) {

            FragmentIds.push(fragId);

        }, true);
    }

    return FragmentIds;
}

//获取节点fragIds，对应的包围盒
function getWorldBoundingBox(fragIds) {
    var fragbBox = new THREE.Box3();
    var nodebBox = new THREE.Box3();
    fragList = _viewer.model.getFragmentList();
    fragIds.forEach(function(fragId) {
        fragList.getWorldBounds(fragId, fragbBox);
        nodebBox.union(fragbBox);
    });
    return nodebBox;
}

//剖切测试
function cutPlans(dbid){
    _viewer.select(dbid);
    _viewer.isolate(dbid);
    _viewer.fitToView(dbid);
    
    //原理：a*x + b*y + c*z + d = 0;
    var FragmentIds = getFragmentIdByDbIds(dbid);
    var nodeBoundingBox = getWorldBoundingBox(FragmentIds);
    console.log(nodeBoundingBox)
    var scale=0.2;
    var planes=[];
    var vector4_z1=null;
    var vector4_z2=null;
    if(nodeBoundingBox.max.z<0){
        var vector4_z1 = new THREE.Vector4(0,0,1,0-nodeBoundingBox.max.z*(1-scale));
    }else{
        var vector4_z1 = new THREE.Vector4(0,0,1,0-nodeBoundingBox.max.z*(1+scale));
    }
    
    if(nodeBoundingBox.min.z<0){
        var vector4_z2 = new THREE.Vector4(0,0,-1,nodeBoundingBox.min.z*(1+scale));
    }else{
        var vector4_z2 = new THREE.Vector4(0,0,-1,nodeBoundingBox.min.z*(1-scale));
    }
    planes.push(vector4_z1);
    planes.push(vector4_z2);
    
    
    if(nodeBoundingBox.max.y<0){
        var vector4_y1 = new THREE.Vector4(0,1,0,0-nodeBoundingBox.max.y*(1-scale));
    }else{
        var vector4_y1 = new THREE.Vector4(0,1,0,0-nodeBoundingBox.max.y*(1+scale));
    }
    if(nodeBoundingBox.min.y<0){
        var vector4_y2 = new THREE.Vector4(0,-1,0,nodeBoundingBox.min.y*(1+scale));
    }else{
        var vector4_y2 = new THREE.Vector4(0,-1,0,nodeBoundingBox.min.y*(1-scale));
    }
    planes.push(vector4_y1);
    planes.push(vector4_y2);
    if(nodeBoundingBox.max.x<0){
        var vector4_x1 = new THREE.Vector4(1,0,0,0-nodeBoundingBox.max.x*(1-scale));
    }else{
        var vector4_x1 = new THREE.Vector4(1,0,0,0-nodeBoundingBox.max.x*(1+scale));
    }
    if(nodeBoundingBox.min.x<0){
        var vector4_x2 = new THREE.Vector4(-1,0,0,nodeBoundingBox.min.x*(1+scale));
    }else{
        var vector4_x2 = new THREE.Vector4(-1,0,0,nodeBoundingBox.min.x*(1-scale));
    }
    planes.push(vector4_x1);
    planes.push(vector4_x2);
    
    _viewer.setCutPlanes(planes)
}

//扫描二维码获取构件信息
function getQrpbproperty(dbId) {
    let numberlist = [];
    numberlist.push(dbId);
    mui.ajax({
        type: "post",
        url: `${serverIp}/task/goujian/transpblist/?token=`+_Wvue.$store.state.sessionid,
        data:{
            type:"numberlist",
            numberlist:JSON.stringify(numberlist),
        },
        cache: false,
        success: function(data) {
            console.log(data);
            if(data.res == true) {

                 localStorage.pbpropertydata = JSON.stringify(data);
            } else {
            }

        },
        error(res){
            console.log(res);
        }
    });
}
//从模型上获取构件信息
function getmodelpbproperty(dbId) {
    let dbIdslist = [];
    dbIdslist.push(dbId);
    mui.ajax({
        type: "post",
        url: `${serverIp}/task/goujian/transpblist/?token=`+_Wvue.$store.state.sessionid,
        data:{
            type:"dbIdslist",
            "_curMajor": _curMajor,
            "_curUnitId": _curUnitId,
            "_selElevations":_selElevations,
            "_selPbtypes":_selPbtypes,
            "_selZones":_selZones,
            "dbIdslist":JSON.stringify(dbIdslist),
        },
        cache: false,
        success: function(data) {
            console.log(data);
            if(data.res == true) {
                _Wvue.$store.commit('setmodelproperty',"{}");
                _Wvue.$store.commit('setmodelproperty',JSON.stringify(data));
            } else {
            }

        },
        error(res){
            console.log(res);
        }
    });
}

//获取dbids对应构件
function getelebydbid(dbId) {
    mui.ajax({
        type: "POST",
        url: `${serverIp}/task/getelebydbid/?token=`+_Wvue.$store.state.sessionid,
        cache: false,
        dataType: "json",
        data: {
            "_curMajor": _curMajor,
            "_curUnitId": _curUnitId,
            "_selElevations":_selElevations,
            "_selPbtypes":_selPbtypes,
            "_selZones":_selZones,
            "dbIdslist": JSON.stringify(dbId),
        },
        success: function(data) {
            if(data.res == true) {
                _Wvue.$store.commit('setmodelproperty',"{}");
                _Wvue.$store.commit('setmodelproperty',JSON.stringify(data.results));
            }

        }
    });
}

      //小地图Begin----------------------------------------------------
      var _camera;
      var _lastState;
      var _newTarget=null;
      var _oldTarget=null;
      var _postion;
      var _curTag = null;
      var _oldfov = null;

      function _findTarget() {
            var eyeVec = _camera.target.clone().sub(_camera.position).normalize();
            var hit = _viewer.impl.rayIntersect(new THREE.Ray(_camera.position, eyeVec));
            return (hit && hit.intersectPoint) ?
                hit.intersectPoint :
                _camera.target;
        };

      function goToFocus(newPostion){
         //1、斜率k=(y2-y1)/(x2-x1)
         //2、y=kx+b
         //3、2点距离
         //4、求另外一个点
         var k=(_postion.y-_oldTarget.y)/(_postion.x-_oldTarget.x);
         var b=-k*newPostion.x+newPostion.y;
         var dis = Math.sqrt(Math.pow((_postion.y-_oldTarget.y),2)+Math.pow((_postion.x-_oldTarget.x),2));
         var jiaodu = Math.atan(b);
         var x= dis*Math.sin(jiaodu)+newPostion.x;
         var y= dis*Math.cos(jiaodu)+newPostion.y;
         newPostion.z=_postion.z;
         
         var target = new THREE.Vector3(x,y,_postion.z);
         var up = new THREE.Vector3(0,0,1);
         _viewer.navigation.setRequestTransition(true, newPostion, target, _oldfov, true);
         // _viewer.navigation.setRequestTransition(true, newPostion, target, _oldfov);
         
        
      }

      function getmapelevation(elevation){
        console.log(elevation);
        
        if(elevation.length>=0){
          var totalLevel = 0;
          if(elevation.length==1){
            totalLevel = elevation[0].level; 
          }else{
            totalLevel = elevation[elevation.length-1].level-elevation[0].level; 
          }
          
          var modelBox = _viewer.utilities.getBoundingBox();
          var totalHighModel = modelBox.max.z-modelBox.min.z
          
          var level = (_viewer.getCamera().position.z-modelBox.min.z)/totalHighModel*totalLevel + elevation[0].level;
          
          console.log(_viewer.getCamera().position.z);
          console.log(level);
          
          if(level<elevation[0].level || level>elevation[elevation.length-1].level){
            return;
          }
          
          elevation.forEach((val, index) => {
            if(val.staseleted){
              val.staseleted = false;
            }
            
            if(level>val.level){
              if(index+1<=elevation.length-1&&level<elevation[index+1].level){
                _Wvue.$store.commit('setnowfloor',val.name);
                val.staseleted=true;
              }
            }
          })
        }
      }
        
      function gotoElevation(value,curFloor,index){
  
        if(value.length>=0){
          var totalLevel = 0;
          if(value.length==1){
            totalLevel = value[0].level; 
          }else{
            totalLevel = value[value.length-1].level-value[0].level; 
          }
          
          var curLevel = curFloor.level;
          if(index+1<=value.length-1){
            curLevel = curFloor.level + (value[index+1].level - curFloor.level)/2.0;
          }
          
          var modelBox = _viewer.utilities.getBoundingBox();
          var totalHighModel = modelBox.max.z-modelBox.min.z
          
          
          var postion_z =  (curLevel-value[0].level)/totalLevel*totalHighModel+modelBox.min.z;
          
          console.log(postion_z);
          console.log(curLevel);
          
          var scale = 0;
          var higth = 150;
          
          _viewer.impl.scene.remove(_curTag);
          _postion.z = postion_z;

          var newCamPos = new THREE.Vector3(0, 0, postion_z + higth);
          var target = new THREE.Vector3(0, 0, postion_z);
          var up = new THREE.Vector3(0, 0, 1);
        
          //_viewer.navigation.setRequestTransition(true, newCamPos, target, 500,up);
          //修改为直接修改相机位置和目标 pgb
      //    var camera = _viewer.getCamera();
      //    camera.position.copy(newCamPos);
      //      camera.target.copy(target);
      //      camera.dirty = true;
      //      _viewer.applyCamera(camera);
              _viewer.navigation.setView( newCamPos, target );
          
        
          //原理：a*x + b*y + c*z + d = 0;
          var scale = scale;
          var planes = [];
          var vector4_z1 = null;
          var vector4_z2 = null;
          if(postion_z< 0) {
            var vector4_z1 = new THREE.Vector4(0, 0, 1, 0 - postion_z * (1 - scale));
          } else {
            var vector4_z1 = new THREE.Vector4(0, 0, 1, 0 - postion_z * (1 + scale));
          }
        
          planes.push(vector4_z1);
        
          _viewer.setCutPlanes(planes);
          
        }
      }
      //剖切测试
      function testCutPlans(scale,higth,value){
        _camera = _viewer.getCamera();
        var eyeVec = _camera.target.clone().sub(_camera.position).normalize();
        var hit = _viewer.impl.rayIntersect(new THREE.Ray(_camera.position, eyeVec));
        getpbproperty(hit.dbId,'dbid');
        _lastState = _viewer.getState();
        getmapelevation(value);
        _newTarget = null;
        
        var postion = _viewer.getCamera().position
        _postion = postion.clone();
        _oldTarget = _viewer.navigation.getTarget().clone();
        _oldfov = _viewer.getCamera().fov;

        var cubeGeometry = new THREE.SphereGeometry(3,0,0);
        var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        cube.position.x=postion.x;
        cube.position.y=postion.y;
        cube.position.z=postion.z;
        _viewer.impl.scene.add(cube);
        _curTag = cube;
            
        
        var newCamPos = new THREE.Vector3(0,0,postion.z+higth);
        var target = new THREE.Vector3(0, 0, postion.z);
        var up = new THREE.Vector3(0,0,1);
  
        //最后一个参数是视窗的大小！！pgb
        _viewer.navigation.setRequestTransition(true,newCamPos,target,500,up);

        //修改为直接修改相机的位置

        // _viewer.navigation.setView( newCamPos,target );
        
        
        //原理：a*x + b*y + c*z + d = 0;
        console.log(postion)
        var scale=scale;
        var planes=[];
        var vector4_z1=null;
        var vector4_z2=null;
        if(postion.z<0){
          var vector4_z1 = new THREE.Vector4(0,0,1,0-postion.z*(1-scale));
        }else{
          var vector4_z1 = new THREE.Vector4(0,0,1,0-postion.z*(1+scale));
        }
  

        planes.push(vector4_z1);
        
        
        _viewer.setCutPlanes(planes);


      }

      function beginclick(top,left){
        $("#viewermap").on("click",function(e){
          console.log(e);
          _newTarget=_viewer.clientToWorld(e.clientX - left,e.clientY - top);
          console.log(_newTarget);
          if(_newTarget){
            if(_curTag){
              _viewer.impl.scene.remove(_curTag);
            }
            
              var cubeGeometry = new THREE.SphereGeometry(3,0,0);
                var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
                var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        
                cube.position.x=_newTarget.intersectPoint.x;
                cube.position.y=_newTarget.intersectPoint.y;
                cube.position.z=_postion.z;
                _viewer.impl.scene.add(cube);
                 _curTag = cube;
                _viewer.impl.sceneUpdated(true);
          }
          
        });
      }
      
      
      
      function restord(){
        _viewer.impl.scene.remove(_curTag);
        console.log("测试");
        console.log(_curTag);
        $('.viewcube').css('display','block');
        _viewer.restoreState(_lastState);
        
      }
      function gonewposition(){
        _viewer.impl.scene.remove(_curTag);
        $('.viewcube').css('display','block');
        _viewer.restoreState(_lastState);
        if(!_newTarget){
          return;
        }
        _camera = _viewer.getCamera();
        goToFocus(_newTarget.intersectPoint);
        
      }
      //小地图end----------------------------------------------------