<style scoped lang="less">
    @import "../../less/all/modelView.less";
</style>
<template>
    <div class="pieBlock">
        <Spin size="large" fix v-if="qloading || sloading"></Spin>
            <div class="pie" id="pie1"></div>
            <div class="pie" id="pie2"></div>
    </div>
</template>
<script>
    import $ from 'jquery';
    import echarts from 'echarts';
    export default {
        data(){
            return{
                qloading:true,
                sloading:true,
            }
        },
        components:{

        },
        mounted(){
            let vm = this;
            mui.ajax({
                url:`${this.$store.state.serverIp}/task/issue/issuecount/?token=`+vm.$store.state.sessionid,
                data:{issuetype:"zhiliang"},
                type:"post",
                success(res){
                    if(res.issuc){
                        let data = [];
                        res.majorlist.forEach((currentValue, index)=>{
                            data.push({name: currentValue,value:res.issuelistUnDo[index]});
                        });
                         creatCount(data,{id:2,name:"质量问题"});
                         vm.qloading = false;

                    }
                }
            });
            mui.ajax({
                url:`${vm.$store.state.serverIp}/task/issue/issuecount/?token=`+vm.$store.state.sessionid,
                data:{issuetype:"anquan"},
                type:"post",
                success(res){
                    if(res.issuc){
                        let data = [];
                        res.majorlist.forEach((currentValue, index)=>{
                            data.push({name: currentValue,value:res.issuelistUnDo[index]});
                        });
                        creatCount(data,{id:1,name:"安全问题"});
                        vm.sloading = false;
                    }
                },
                error(){
                }
            });
        }
    }

        /**
     *
     * @param {Object} data
     * @param {Object} id
     */
    function creatCount(data,id) {
        let legendData = [];
        data.forEach((val,index) => {
            legendData.push(val.name);
        });
        const option = {
            title:{
                text:id.name
            },
            legend: {
                bottom: 10,
                left: 'center',
                data:legendData
            },
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {c} ({d}%)"
            },
            series: [
                {
                    name:id.name,
                    type:'pie',
                    radius: ['48%', '65%'],
                    avoidLabelOverlap: false,
                    center: ['50%', '42%'],
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            formatter:'{b}:{c}',
                            textStyle: {
                                fontSize: '16',
                                fontWeight: 'normal'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    minAngle:2,
                    data
                }
            ]
        };
        let myChart2 = echarts.init(document.getElementById(`pie${id.id}`));
        myChart2.setOption(option, true);

    }
</script>