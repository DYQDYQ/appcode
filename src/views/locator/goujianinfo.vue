<style scoped lang="less">
@import url("../../less/all/modelLocator.less");
</style>
<style type="text/css">
    .ivu-collapse-header{
        padding-left: 12px !important;
        font-size: 14px !important;
        font-weight: 700 !important;
    }
    .ivu-collapse{
        border: 0px solid #d7dde4 !important;
    }
    .inforlist{
        height: 38px !important;
        background-color: #f7f7f7;
        line-height: 38px;
    }
    .choseit{
        color: #fff;
        background-color: #d44c4c; 
    }
    .listhead{
        color: #666;
    }
    .listli{
        border-bottom: 1px solid #dddee1;
    }
</style>
<template>
    <div class="boxbody wrappergou" ref="wrapper">
        <ul>
            <li class="inforlist">
                <span class="listhead">编号:</span>
                <span class="listcontend">{{infor.pbnumber}}</span>
            </li>
            <li class="inforlist">
                <span class="listhead">状态:</span>
                <span class="listcontend">{{infor.pbstatus}}</span>
            </li>
            <li class="inforlist">
                <span class="listhead">累计完成百分比(%):</span>
                <span class="listcontend">{{infor.curstatuspercent}}</span>
            </li>
            <li class="inforlist">
                <span class="listhead">类型:</span>
                <span class="listcontend">{{infor.pbtype}}</span>   
            </li>
            <li class="inforlist">
                <span class="listhead">空间:</span>
                <span class="listcontend">{{infor.pbelevation}}</span>
            </li>
            <li class="inforlist">
                <span class="listhead">备注:</span>
                <span class="listcontend">{{infor.statusdesc}}</span>
            </li>
            <li v-for="(item,index) in itemarr" class="listli">
            <Collapse>
                <Panel :name="`${index}`">
                {{item.name}}
                    <div slot="content">
                        <div v-for="it in item.children" style="margin-bottom: 5px;">
                            <div style="color: #000">{{it.displayName}}</div>
                            <div style="color: #999">{{it.displayValue}}</div>
                        </div>
                    </div>
                </Panel>
            </Collapse>
            </li>
        </ul>
    </div>
</template>
<script>
    import BScroll from 'better-scroll';
    export default{
        data(){
            return{
                itemarr:[],
                scroll:null,
            }
        },
        mounted(){
            this.$nextTick(function(){
                let height = document.body.clientHeight - 137;
                $(".wrappergou").css("height",height);
                this.scroll = new BScroll(this.$refs.wrapper,{click:true});
            })
        },
        computed:{
            infor(){
               return JSON.parse(this.$store.state.pbproperty);
                
            },
            properties(){
                return JSON.parse(this.$store.state.properties);
            }
        },
        watch:{
            infor(val,old){
                console.log(val);
            },
            properties(val){
                if(val == null){
                    return;
                }
                let arr = [];
                this.itemarr = [];
                val.properties.forEach((v,i)=>{
                    if(arr.indexOf(v.displayCategory) < 0 && v.displayCategory.indexOf('__')<0){
                        arr.push(v.displayCategory);
                        let obj = {
                            name: v.displayCategory,
                            children:[],
                        }
                        this.itemarr.push(obj);
                    }
                });
                val.properties.forEach((v,i)=>{
                    this.itemarr.forEach(value=>{
                        if(v.displayCategory == value.name){
                            value.children.push(v);
                        }
                    })
                });
                console.log(this.itemarr);
            },
        }
    }
</script>