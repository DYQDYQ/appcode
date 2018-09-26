<style scoped lang="less">
    @import "../../less/all/modelView.less"; 
</style>
<template>
    <div class="chartmain" style="background: #E7E0DC">
        <Spin size="large" fix v-if="loading && loading1 && loading2 && loading3"></Spin>
        <Row class="chartbody">
            <Col span="24" class="chartbox">
                <div class="charthead">质量事宜</div>
                <div class="infor">
                    <div v-for="item in infordata" class="infordata">
                        <div style="color: #d44c4c;font-size: 26px">{{item.number}}</div>
                        <div style="color: #999;">{{item.dis}}</div>
                    </div>
                </div>
                <div class="chart" id="by1"></div>
            </Col>
        </Row>
        <Row class="chartbody">
            <Col span="24" class="chartbox">
                <div class="charthead">安全事宜</div>
                <div class="infor">
                    <div v-for="item in anquandata" class="infordata">
                        <div style="color: #d44c4c;font-size: 26px">{{item.number}}</div>
                        <div style="color: #999;">{{item.dis}}</div>
                    </div>
                </div>
                <div class="chart" id="by2"></div>
            </Col>
        </Row>
        <Row class="chartbody">
            <Col span="24" class="chartbox">
                <div class="charthead">协调事宜</div>
                <div class="infor">
                    <div v-for="item in xietiaodata" class="infordata">
                        <div style="color: #d44c4c;font-size: 26px">{{item.number}}</div>
                        <div style="color: #999;">{{item.dis}}</div>
                    </div>
                </div>
                <div class="chart" id="by3"></div>
            </Col>
        </Row>
        <Row class="chartbody">
            <Col span="24" class="chartbox">
                <div class="charthead">商务事宜</div>
                <div class="infor">
                    <div v-for="item in shangwudata" class="infordata">
                        <div style="color: #d44c4c;font-size: 26px">{{item.number}}</div>
                        <div style="color: #999;">{{item.dis}}</div>
                    </div>
                </div>
                <div class="chart" id="by4"></div>
            </Col>
        </Row>
    </div>
</template>
<script>
    import $ from 'jquery';
    import echarts from 'echarts';
    export default{
        data(){
            return{
                xdata:[],
                timelist:[],
                aqxdata:[],
                aqtimelist:[],
                xtxdata:[],
                xttimelist:[],
                swxdata:[],
                swtimelist:[],
                loading:true,
                loading1:true,
                loading2:true,
                loading3:true,
                by1:{
                   title:"事宜统计",
                   xtitle: '次数',
                   who:"by1",
                   url:"#",
                   data:[],
                   max:"100%",
                   legendData:[],
                   series:[
                       {
                            type: 'bar',
                            barWidth: '60%',
                            data:[]
                       } 
                   ]
                },
                by2:{
                   title:"事宜统计",
                   xtitle: '次数',
                   who:"by2",
                   url:"#",
                   data:[],
                   max:"100%",
                   legendData:[],
                   series:[
                       {
                            type: 'bar',
                            barWidth: '60%',
                            data:[]
                       } 
                   ]
                },
                by3:{
                   title:"事宜统计",
                   xtitle: '次数',
                   who:"by3",
                   url:"#",
                   data:[],
                   max:"100%",
                   legendData:[],
                   series:[
                       {
                            type: 'bar',
                            barWidth: '60%',
                            data:[]
                       } 
                   ]
                },
                by4:{
                   title:"事宜统计",
                   xtitle: '次数',
                   who:"by4",
                   url:"#",
                   data:[],
                   max:"100%",
                   legendData:[],
                   series:[
                       {
                            type: 'bar',
                            barWidth: '60%',
                            data:[]
                       } 
                   ]
                },
                infordata:[
                    {
                        number:0,
                        dis:'已发出',
                    },
                    {
                        number:0,
                        dis:'已关闭',
                    },
                    {
                        number:0,
                        dis:'未关闭',
                    },
                    {
                        number:0,
                        dis:'逾期',
                    }
                ],
                anquandata:[
                    {
                        number:0,
                        dis:'已发出',
                    },
                    {
                        number:0,
                        dis:'已关闭',
                    },
                    {
                        number:0,
                        dis:'未关闭',
                    },
                    {
                        number:0,
                        dis:'逾期',
                    }
                ],
                xietiaodata:[
                    {
                        number:0,
                        dis:'已发出',
                    },
                    {
                        number:0,
                        dis:'已关闭',
                    },
                    {
                        number:0,
                        dis:'未关闭',
                    },
                    {
                        number:0,
                        dis:'逾期',
                    }
                ],
                shangwudata:[
                    {
                        number:0,
                        dis:'已发出',
                    },
                    {
                        number:0,
                        dis:'已关闭',
                    },
                    {
                        number:0,
                        dis:'未关闭',
                    },
                    {
                        number:0,
                        dis:'逾期',
                    }
                ]
            }
        },
        methods:{
            creatOneChart(chardata,xdata,ydata){
              let vm = this;
                let option = {
                    title: {
                        textStyle:{
                            fontWeight: 'lighter',
                            fontSize:'16'
                        },
                        text: chardata.title,
                    },
                    tooltip:{
                      trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        } 
                    },
                    legend: {
                        show:true,
                        top: 20,
                        data: xdata,
                    },
                    grid: {
                        left: '10px',
                        right: '10px',
                        bottom: '10px',
                        containLabel: true,
                    },
                    xAxis: {
                        type : 'category',
                        data: ydata,
                        boundaryGap : false,
                        axisLine: {onZero: true},
                        axisTick: {
                            alignWithLabel: true
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: chardata.xtitle,
                        nameLocation: 'end',
                        nameTextStyle: {
                            align: 'left',
                        }


                    },
                    dataZoom:[
                       {
                          show: true,
                          realtime: true,
                          start: 0,
                          end: 40,
                      }, 
                    ],
                    series: []

                };
                chardata.data.forEach((val,index) => {
                  let obj = {
                    name:xdata[index],
                    type: 'line',
                    data: val
                  };
                  option.series.push(obj);
                });
                let newchart = echarts.init(document.getElementById(chardata.who));
                newchart.setOption(option, true);
            }
        },
        mounted(){
            let vm = this;
            $.ajax({
                url: `${vm.$store.state.serverIp}/task/issue/issuecountbytype/?type=质量&token=`+vm.$store.state.sessionid,
                type: "get",
                success:function(res){
                    vm.xdata = res.results.majorlist;
                    vm.timelist = res.results.timelist;
                    vm.by1.data = res.results.issuetimeCountlist;
                    vm.infordata[0].number = res.results.total || 0;
                    vm.infordata[1].number = res.results.closed || 0;
                    vm.infordata[2].number = res.results.unclosed || 0;
                    vm.infordata[3].number = res.results.outofdate || 0;
                    vm.creatOneChart(vm.by1,vm.xdata,vm.timelist);
                    vm.loading = false;



                }
            });
            $.ajax({
                url: `${vm.$store.state.serverIp}/task/issue/issuecountbytype/?type=安全&token=`+vm.$store.state.sessionid,
                type: "get",
                success:function(res){
                    console.log(res);
                    vm.aqxdata = res.results.majorlist;
                    vm.aqtimelist = res.results.timelist;
                    vm.by2.data = res.results.issuetimeCountlist;
                    vm.anquandata[0].number = res.results.total || 0;
                    vm.anquandata[1].number = res.results.closed || 0;
                    vm.anquandata[2].number = res.results.unclosed || 0;
                    vm.anquandata[3].number = res.results.outofdate || 0;
                    vm.creatOneChart(vm.by2,vm.aqxdata,vm.aqtimelist);
                    vm.loading1 = false;



                }
            });
            $.ajax({
                url: `${vm.$store.state.serverIp}/task/issue/issuecountbytype/?type=协调&token=`+vm.$store.state.sessionid,
                type: "get",
                success:function(res){
                    console.log(res);
                    vm.xtxdata = res.results.majorlist;
                    vm.xttimelist = res.results.timelist;
                    vm.by3.data = res.results.issuetimeCountlist;
                    vm.xietiaodata[0].number = res.results.total || 0;
                    vm.xietiaodata[1].number = res.results.closed || 0;
                    vm.xietiaodata[2].number = res.results.unclosed || 0;
                    vm.xietiaodata[3].number = res.results.outofdate || 0;
                    vm.creatOneChart(vm.by3,vm.xtxdata,vm.xttimelist);
                    vm.loading2 = false;



                }
            });
            $.ajax({
                url: `${vm.$store.state.serverIp}/task/issue/issuecountbytype/?type=商务&token=`+vm.$store.state.sessionid,
                type: "get",
                success:function(res){
                    console.log(res);
                    vm.swxdata = res.results.majorlist;
                    vm.swtimelist = res.results.timelist;
                    vm.by4.data = res.results.issuetimeCountlist;
                    vm.shangwudata[0].number = res.results.total || 0;
                    vm.shangwudata[1].number = res.results.closed || 0;
                    vm.shangwudata[2].number = res.results.unclosed || 0;
                    vm.shangwudata[3].number = res.results.outofdate || 0;
                    vm.creatOneChart(vm.by4,vm.swxdata,vm.swtimelist);
                    vm.loading3 = false;



                }
            });
        }

    }
</script>