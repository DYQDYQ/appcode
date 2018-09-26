<style lang="less" scoped>
@import "../../less/all/process.less";
</style>

<template>
        <div class="container">
            <div id="chart"></div>
            <div class="infoList">
                <h3 style="color: #5193df">目标总计需要完成的构建数量：{{ all===Infinity?0:all }}</h3>
                <ul class="colorful">
                    <li v-for="item in info">
                        <Icon type="record"></Icon>&nbsp;<span>{{ parseInt(item.value/all*100)+'%' }}</span>&nbsp;{{item.name}}
                    </li>
                </ul>
            </div>
            <!--<h3 style="margin-top: 100px">进度对比</h3>-->
            <!--<table>-->
                <!--<tr>-->
                    <!--<td>编号</td>-->
                    <!--<td>123456</td>-->
                <!--</tr>-->
                <!--<tr>-->
                    <!--<td>任务</td>-->
                    <!--<td>危大型</td>-->
                <!--</tr>-->
                <!--<tr>-->
                    <!--<td>状态</td>-->
                    <!--<td>未完成</td>-->
                <!--</tr>-->
                <!--<tr>-->
                    <!--<td>工作量</td>-->
                    <!--<td>50%</td>-->
                <!--</tr>-->
                <!--<tr>-->
                    <!--<td>计划完成时间</td>-->
                    <!--<td>2017.10.1</td>-->
                <!--</tr>-->
            <!--</table>-->
        </div>
</template>

<script>
    import echarts from 'echarts';
    export default {
        props:{
            project:Array
        },
        data(){
            return {
                info:[]
            }
        },
        mounted(){
            let vm = this;
            mui.ajax({
                url:vm.$store.state.serverIp + "task/projecttask/getstatus/?token="+vm.$store.state.sessionid,
                data:{
                    curUnitId:vm.project[1],
                    curMajor:vm.project[0]
                },
                success:(res)=>{
                    this.info = [
                        { value:res.wancheng.value,name:"已完成" },
                        { value:res.jinxingzhong.value,name:"进行中" },
                        { value:res.chaoshiweiwancheng.value,name:"超时未完成" },
                        { value:res.chaoshiweikaishi.value,name:"超时未开始" },
                        { value:res.weikaishi.value,name:"未开始" },
                    ];
                    creatPie(this.info);
                }
            })
        },
        computed:{
            all(){
                return (list=>{
                    let a = 0;
                    list.forEach(b=>{
                        a+=b.value;
                    });
                    if(a===0) a=Infinity;
                    return a;
                })(this.info)
            }
        }
    };
     let creatPie=(value)=>{
        const option = {
            color:['#5193df','#4ec04f','#f55176','#7e828e'],
            series: [
                {
                    name:'项目进展',
                    type:'pie',
                    radius: ['70%', '90%'],
                    avoidLabelOverlap: false,
                    disabled:true,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    silent:true,
                    data:(a=>{
                        let b = [];
                        a.forEach(t=>{
                            b.push({value:t.value})
                        });
                        return b
                    })(value)
                }
            ]
        };
        let myChart = echarts.init(document.getElementById("chart"));
        myChart.setOption(option, true);
    }
</script>