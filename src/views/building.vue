<style scoped>
    .view{
        height:100%;
        background-color: gray;
        width: 100%;
        position: relative;
    }
</style>
<template>
    <div id="viewer" class="view"></div>
</template>
<script>
    export default {
        methods:{
            load(){
                _isWholeModel = false;
                _viewer = null;
                _curUnitId = '';//单位工程
                _curMajor = '';//专业
                if(localStorage.nowmodel){
                    if(localStorage.nowmodel != ''){
                        _curUnitId = JSON.parse(localStorage.nowmodel)[0];
                        _curMajor = JSON.parse(localStorage.nowmodel)[1];
                    }
                };
                _selElevations = ""; //楼层 ,字符串格式 1,2
                _selZones = ""; //区域
                _selPbtypes = ""; //构件类型 ,字符串格式 1,2

                _selectionmode = "";
                _homeview = []; //模型初始位置

                _selectedId = null;
                _modellist = [];

                _floorData = [];
                _hideData = [];
                let options = {};
                options.env = "Local";
                Autodesk.Viewing.Initializer(options, function() {
                    getModelFile();
                    localStorage.nowmodel = '';
                });
            }
        }
    }
</script>