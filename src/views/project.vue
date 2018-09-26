<style scoped lang="less">
    @import "../less/project.less";
</style>
<style>
    .ivu-poptip-rel{
        width: 100%;
        height: 100%;
    }
</style>
<template>
    <Row class="main">
        <Col class="toDo" :span="18">
            <!--<div class="head">-->
                <!--张三丰，上海轨道交通网络运营指挥调度大楼项目经理-->
                <!--<span style="float: right">{{movedTo}}</span>-->
            <!--</div>-->
            <div class="week">
                <div class="day">日</div>
                <div class="day">一</div>
                <div class="day">二</div>
                <div class="day">三</div>
                <div class="day">四</div>
                <div class="day">五</div>
                <div class="day">六</div>
            </div>
            <div class="calendar">
                <div class="calendar-table" :style="styleObject" @touchstart="record" @touchend="calculate" @touchmove="transcribe">
                    <div class="clear-fix" v-for="index in total" :key="index.toSrting()">
                        <Poptip class="day" :style="{'margin-left':first(index)}" placement="right-start" @on-popper-show="changeInfo(index)" trigger="click" :placement="setPlace(index,0)">
                            <p>{{setTime(index,0)}}</p>
                            12312312312312
                            <!--<ul class="detail">-->
                            <!--<li>{{Math.random()}}</li>-->
                            <!--</ul>-->
                            <div class="api" slot="content">{{currentInfo}}</div>
                        </Poptip>
                        <Poptip class="day" v-for="day in dayCount(index)" placement="right-start" @on-popper-show="changeInfo(index)" trigger="click" :placement="setPlace(index,day)">
                            <p>{{setTime(index,day)}}</p>
                            <!--<ul class="detail">-->
                                <!--<li>{{Math.random()}}</li>-->
                            <!--</ul>-->
                            <div class="api" slot="content">{{currentInfo}}</div>
                        </Poptip>
                    </div>
                </div>

            </div>
        </Col>
        <Col :span="6" class="right">
            <span>上海市，浦东新区</span>
            <div class="today">
                <img src="../img/weather/sunny.png" height="120" width="120"/>
                <p>18~22℃</p>
                <p>9月17日</p>
            </div>
            <div class="future">
                <img src="../img/weather/cloudy.png" height="80" width="80"/>
                <p>18~22℃</p>
                <p>9月18日</p>
            </div>
            <div class="future">
                <img src="../img/weather/rainy.png" height="80" width="80"/>
                <p>18~22℃</p>
                <p>9月19日</p>
            </div>
        </Col>
    </Row>
</template>
<script>
    /**
     *
     * @returns {string}
     * @constructor
     */
    Date.prototype.ToDate = function() {
        const date = this;
        if(date > new Date("2000/01/01")) {
            return (("0" + (date.getMonth() + 1)).slice(-2)) + "-" + (("0" + (date.getDate())).slice(-2));
        }
    };
    /**
     *
     * @returns {string}
     * @constructor
     */
    Date.prototype.GetTime = function () {
        const date = this;
        if(date > new Date("2000/01/01")) {
            return (("0" + (date.getHours())).slice(-2)) + ":" + (("0" + (date.getMinutes())).slice(-2));
        }
    };
export default {
    data(){
        return{
            today:new Date(),
            firstDay:new Date(new Date().setDate(1)),
            currentInfo:"",
            start:{x:0,y:0},
            processing:{x:0,y:0},
            moved:0,
            total:1
        }
    },
    created(){
    },
    methods:{
        setTime(index,day){
            let current = new Date();
            current.setMonth(current.getMonth() + index -1);
            current.setDate(day+1);
            return `${current.getMonth()+1}月${current.getDate()}日`;
        },
        changeInfo(index){
            this.currentInfo = index;
        },
        record(e){
            this.start.x = e.touches[0].clientX;
            this.start.y = e.touches[0].clientY;
            this.processing.x = 0;
            this.processing.y = 0;
        },
        transcribe(e){
            this.processing.x = e.touches[0].clientX;
            this.processing.y = e.touches[0].clientY;
        },
        calculate(e){
            if(this.processing.x === 0&&this.processing.y === 0){
                return;
            }
            const movedX = this.processing.x - this.start.x;
            const movedY = this.processing.y - this.start.y;
            if(Math.abs(movedY)<150){
                return
            }
            if(Math.abs(movedX/movedY)<1){
                if(movedY<0){
                    if(this.moved+1===this.total) this.total++;
                    this.moved++
                } else if(this.moved>0) {
                    this.moved--
                }
                setTimeout(()=>{
                    //this.moved = 1
                },500)
            }
        },
        first(index){
            let today = new Date();
            let mounth = today.getMonth();
            today.setMonth(mounth+index-1);
            today.setDate(1);
            const first = today.getDay();
            return `${first*100*(1/7)}%`
        },
        dayCount(index){
            let today = new Date();
            let mounth = today.getMonth();
            today.setMonth(mounth+index);
            today.setDate(0);
            return today.getDate()-1;
        },
        setPlace(index,day){
            let current = new Date();
            current.setMonth(current.getMonth() + index - 1);
            current.setDate(day+1);
            const _day = current.getDay();
            return  (_day===5||_day===6)?'left-start': "right-start";
        }
    },
    computed:{
//        first(){
//            return (this.firstDay.getDay()%7)*100*(1/7)+'%'
//        },
        styleObject(){
            return {
                "-webkit-transform": `translateY(-${768*this.moved}px)`,
                "-moz-transform": `translateY(-${768*this.moved}px)`,
                "-ms-transform": `translateY(-${768*this.moved}px)`,
                "-o-transform": `translateY(-${768*this.moved}px)`,
                "transform": `translateY(-${768*this.moved}px)`,
            }
        },
        movedTo(){
            let current = new Date();
            current.setMonth(current.getMonth() + this.moved);
            return `${current.getFullYear()}年${current.getMonth()+1}月`;
        }
    }
}
</script>