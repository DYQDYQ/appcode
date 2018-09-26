<style>

</style>

<template>
    <div class="main" id="calendar">
    </div>
</template>

<script>
    import $ from 'jquery';
    import fullCalendar from 'fullcalendar';
    import 'fullCalendar/dist/fullcalendar.css';
    import 'fullCalendar/dist/locale/zh-cn.js';
    export default {
        mounted(){
            this.$nextTick(()=>{
                calendar(this.$store.state.serverIp);
            })
        } 
    }
    function calendar(ip) {
        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'listMonth,month,agendaWeek,agendaDay'
            },
            defaultDate: getNowFormatDate(),
            defaultView: 'listMonth',
            locale: 'zh-cn',
            navLinks: true, // can click day/week names to navigate views
            businessHours: true, // display business hours
            editable: true,
            eventOrder: 'order',
            contentHeight:window.innerHeight - 100,
            events: function(start, end, timezone, callback) {
                mui.ajax({
                    url: ip+"/assist/todolist/?token="+_Wvue.$store.state.sessionid,
                    dataType: 'json',
                    data: {
                        start: start.unix(),
                        end: end.unix()
                    },
                    type: 'post',
                    success: function(data) {
                        console.log(data);
                        callback(data.todolist);

                        $('#calendar a').attr("target","_blank");
                        setTimeout(()=>{
                            $('#calendar a , .curDate').on('click',()=>{
                                return false
                            });
                            if($(".fc-list-heading[data-date='"+getNowFormatDate()+"']").length > 0) {
                                const offsettop = $(".fc-list-heading[data-date='"+getNowFormatDate()+"']").offset().top;
                                let b = $(".fc-scroller");
                                b.scrollTop(b.scrollTop() + offsettop -b.offset().top);
                            }else {
                                let b = $(".fc-scroller");
                                b.scrollTop(b.scrollTop() -b.offset().top);
                            }
                        },1000);


                    }
                });
            },
            eventMouseover: function(calEvent, jsEvent, view) {
                var fstart = $.fullCalendar.moment(calEvent).format('YYYY/MM/DD HH:mm');
                var fend = $.fullCalendar.moment(calEvent).format('YYYY/MM/DD HH:mm');
                $(this).attr('title', calEvent.contant);
            },

        });
    }
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if(month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if(strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }
</script>