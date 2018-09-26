<style scoped>
    @import "../../noNpmSupported/jsGant/jsgantt.css";
</style>
<style type="text/css">
    .showerror{
        position: absolute;
        top: 10px;
        left: 0px;
        bottom: 0px;
        text-align: center;
    }
</style>
<template>
    <div class="main">
        <Spin size="large" fix v-if="loading"></Spin>
        <div style="showerror" v-if="errorstate">{{dataerror}}</div>
        <div id="GanttChartDIV" style="position:relative;overflow:auto;padding: 20px 10px;width:1100px"></div>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                loading:true,
                dataerror:'',
                errorstate:false
            }
        },
        mounted(){
            window.g = new JSGantt.GanttChart(document.getElementById('GanttChartDIV'), 'month');
            let vm = this;
            if(g.getDivId() !== null) {
                initGantChart(g);
                // let a = plus.nativeUI.showWaiting("数据加载中......");
                $.ajax({
                    type: "get",
                    url: `${vm.$store.state.serverIp}/task/projecttask/getprojecttasklist/?token=`+vm.$store.state.sessionid,
                    cache: false,
                    // async: false,
                    dataType: "json",
                    success(data) {
                        if(data.issuc == "true") {
                            for(var each in data.projecttasklist) {
                                if(each == "remove")
                                    continue;
                                g.AddTaskItem(new JSGantt.TaskItem(data.projecttasklist[each].pID, data.projecttasklist[each].pName, data.projecttasklist[each].pStart, data.projecttasklist[each].pEnd, data.projecttasklist[each].pStyle, "", 0,
                                    "", data.projecttasklist[each].pComp, data.projecttasklist[each].pGroup, data.projecttasklist[each].pParent, data.projecttasklist[each].pOpen,
                                    "", "", "", "g"));
                            };
                            console.log((new Date())*1);
                            g.Draw();
                            vm.loading = false;
                            console.log((new Date())*1);
                        } else {
                            vm.errorstate = true;
                            vm.dataerror = data.error;
                        }
                    },
                    error(error){
                        console.log(error);
                        vm.errorstate
                    }
                });
            } else {
                alert("Error, unable to create Gantt Chart");
            }
        }
    }
    function initGantChart(g) {
        var vLangsCn = {
            'format': '显示样式',
            'hour': 'Hour',
            'day': '天',
            'week': '周',
            'month': '月',
            'quarter': '季度',
            'hours': 'Hours',
            'days': '天',
            'weeks': 'Weeks',
            'months': 'Months',
            'quarters': 'Quarters',
            'hr': 'Hr',
            'dy': '天',
            'wk': 'Wk',
            'mth': 'Mth',
            'qtr': 'Qtr',
            'hrs': 'Hrs',
            'dys': '天',
            'wks': '周',
            'mths': '月',
            'qtrs': 'Qtrs',
            'resource': 'Resource',
            'duration': '工期',
            'comp': '完成百分比',
            'completion': '完成百分比',
            'startdate': '开始时间',
            'enddate': '结束时间',
            'moreinfo': '更多信息',
            'notes': '描述',
            'january': 'January',
            'february': 'February',
            'march': 'March',
            'april': 'April',
            'maylong': 'May',
            'june': 'June',
            'july': 'July',
            'august': 'August',
            'september': 'September',
            'october': 'October',
            'november': 'November',
            'december': 'December',
            'jan': '1月',
            'feb': '2月',
            'mar': '3月',
            'apr': '4月',
            'may': '5月',
            'jun': '6月',
            'jul': '7月',
            'aug': '8月',
            'sep': '9月',
            'oct': '10月',
            'nov': '11月',
            'dec': '12月',
            'sunday': 'Sunday',
            'monday': 'Monday',
            'tuesday': 'Tuesday',
            'wednesday': 'Wednesday',
            'thursday': 'Thursday',
            'friday': 'Friday',
            'saturday': 'Saturday',
            'sun': '星期天',
            'mon': '星期一',
            'tue': '星期二',
            'wed': '星期三',
            'thu': '星期四',
            'fri': '星期五',
            'sat': '星期六'
        };

        g.addLang('zh_CN', vLangsCn);
        g.setLang('zh_CN');
        g.setCaptionType('Name'); // Set to Show Caption (None,Caption,Resource,Duration,Complete)
        g.setQuarterColWidth(36);
        //g.setDateTaskDisplayFormat('day dd month yyyy'); // Shown in tool tip box
        g.setDateTaskTableDisplayFormat("yyyy/mm/dd"); //Date format used for start and end dates in the main task list. Defaults to 'dd/mm/yyyy'.
        g.setDateTaskDisplayFormat('yyyy/mm/dd day'); // Shown in tool tip box
        g.setDayMajorDateDisplayFormat('yyyy mon');// Set format to display dates in the "Major" header of the "Day" view
        g.setWeekMinorDateDisplayFormat('mon dd 号');// Set format to display dates in the "Minor" header of the "Week" view
        g.setShowTaskInfoLink(0); //Show link in tool tip (0/1)
        g.setShowEndWeekDate(0); // Show/Hide the date for the last day of the week in header for daily view (1/0)
        g.setUseSingleCell(10000); // Set the threshold at which we will only use one cell per table row (0 disables).  Helps with rendering performance for large charts.
        g.setFormatArr('Day', 'Week', 'Month', 'Quarter'); // Even with setUseSingleCell using Hour format on such a large chart can cause issues in some browsers

        g.setShowTaskInfoRes(0);

        g.setShowRes(0);
        g.setWeekColWidth(60); //Width of Gantt Chart columns in pixels when drawn in "Week" format. Defaults to 36.
    }
</script>