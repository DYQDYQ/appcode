<style scoped lang="less">
   @import "../../less/quality/chartview.less"; 
</style>
<template>
    <div class="chartmain" style="background: #E7E0DC">
        <Spin size="large" fix v-if="loading"></Spin>
        <Row class="chartbody">
            <Col span="12" class="chartbox">
                <div id="bynumber"></div>
            </Col>
            <Col span="12" class="chartbox">
                <div id="noclose"></div>
            </Col>
        </Row>
        <Row class="chartbody">
            <Col span="12" class="chartbox">
                <div id="bytime"></div>
            </Col>
            <Col span="12" class="chartbox">
                <div id="bylevel"></div>
            </Col>
        </Row>
    </div>
</template>
<script>
    import echarts from 'echarts';
    export default{
        data(){
            return{
                xdata:[],
                timelist:[],
                loading:true,
                numberdata:{
                   who:"bynumber",
                   url:"#",
                   title:"问题次数统计",
                   xtitle: '次数',
                   data:[],
                   legendData:[],
                   series:[
                       {
                            type: 'bar',
                            barWidth: '60%',
                            data:[]
                       } 
                   ]
                },
                noclosedata:{
                   title:"当前未关闭问题统计",
                   xtitle: '个数',
                   who:"noclose",
                   url:"#",
                   data:[],
                   legendData:[],
                   series:[
                       {
                            type: 'bar',
                            barWidth: '60%',
                            data:[]
                       } 
                   ]
                },
                timedata:{
                   title:"各专业按时整改率统计",
                   xtitle: '整改率',
                   who:"bytime",
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
                leveldata:{
                   title:"问题等级统计",
                   xtitle: '个数',
                   who:"bylevel",
                   url:"#",
                   data:[],
                   legendData:['轻微','一般','严重'],
                   series:[],
                   seriesdata:[],
                }
            } 
        },
        methods:{
            creatchart(chardata){
                let option = {
                    title: {
                        textStyle:{
                            fontWeight: 'lighter',
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
                        data: ['轻微','一般','严重'],
                    },
                    grid: {
                        left: '10px',
                        right: '10px',
                        bottom: '10px',
                        containLabel: true,
                    },
                    xAxis: {
                        type : 'category',
                        data: this.xdata,
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
                    series: [
                        {
                            type: 'bar',
                            barWidth: '40%',
                            data:chardata.data
                        } 
                    ]

                };
                if(chardata.title == '问题等级统计') {
                    let data = [],data1= [],data2= [],data3= [],data4 = [];
                    for( let i in chardata.seriesdata){
                        data1.push(chardata.seriesdata[i][0]);
                        data2.push(chardata.seriesdata[i][1]);
                        data3.push(chardata.seriesdata[i][2]);
                    };
                    data[0] = data1;
                    data[1] = data2;
                    data[2] = data3;

                    console.log(data);
                    for(let x = 0;x<data.length;x++) {
                        let obj = {
                            name:chardata.legendData[x],
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            textStyle:{

                            },
                            barWidth: '40%',
                            stack: '总量',
                            data:data[x],
                        }
                        chardata.series.push(obj);
                        
                    }
                    option.series = chardata.series;
                    console.log(option.series);
                };
                if(chardata.title == '各专业按时整改率统计') {
                  let obj = {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}%'
                    },
                    axisPointer: {
                        snap: true
                    },
                    max:100

                  };
                  option.yAxis = obj;
                };
                let newchart = echarts.init(document.getElementById(chardata.who));
                newchart.setOption(option, true);
            },
            creatOneChart(chardata){
              let vm = this;
                let option = {
                    title: {
                        textStyle:{
                            fontWeight: 'lighter',
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
                        data: this.xdata,
                    },
                    grid: {
                        left: '10px',
                        right: '10px',
                        bottom: '10px',
                        containLabel: true,
                    },
                    xAxis: {
                        type : 'category',
                        data: this.timelist,
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
                    name:vm.xdata[index],
                    type: 'line',
                    data: val
                  };
                  option.series.push(obj);
                });
                let newchart = echarts.init(document.getElementById(chardata.who));
                newchart.setOption(option, true);
            },
        },
        mounted(){
            let vm = this;
            $.ajax({
                url: `${vm.$store.state.serverIp}/task/issue/issuecount/?token=`+vm.$store.state.sessionid,
                type: "post",
                dataType: "json",
                data:{
                   issuetype:"zhiliang"
                },
                success:function(res){
                    console.log(res);
                    vm.xdata = res.majorlist;
                    vm.timelist = res.timelist;
                    vm.numberdata.data = res.issuelistCount;

                    vm.leveldata.seriesdata = res.issuelistPriority;

                    vm.timedata.data = res.issuelistDoneOnTime;
                    vm.noclosedata.data = res.issuelistUnDo;

                    vm.creatOneChart(vm.numberdata);
                    vm.creatchart(vm.noclosedata);
                    vm.creatchart(vm.timedata);
                    vm.creatchart(vm.leveldata);
                    vm.loading = false;
                    console.log(vm.xdata);
                    console.log(vm.timedata);


                }
            });
        }
    }
</script>