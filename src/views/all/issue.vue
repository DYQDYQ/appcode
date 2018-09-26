<style lang="less" scoped>
    @import url('../../less/all/issue.less');
</style>
<style>
    .blue.one .ivu-slider-disabled .ivu-slider-bar{
        background: #5094D9;
    }
    .green.one .ivu-slider-disabled .ivu-slider-bar{
        background: #4ebe55;
    }
    .red.one .ivu-slider-disabled .ivu-slider-bar{
        background: #f05074;
    }
</style>
<template>
    <div class="main">
        <h2>&#160;</h2>
        <div class="box">
            <div class="mBox">
                <h3>安全问题</h3>
                <div class="bars">
                    <div v-for="item in safetyIssue" class="one" :class="['red','blue','green'][parseInt(Math.random()*3)]">
                        <span>{{item.name}}</span>
                        <Slider v-model="item.value" :disabled="true"></Slider>
                        <span>{{item.value}}%</span>
                    </div>
                </div>
            </div>
            <div class="mBox">
                <h3>质量问题</h3>
                <div class="bars">
                    <div v-for="item in qualityIssue" class="one" :class="['red','blue','green'][parseInt(Math.random()*3)]">
                        <span>{{item.name}}</span>
                        <Slider v-model="item.value" :disabled="true"></Slider>
                        <span>{{item.value}}%</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            safetyIssue:[
                {name:"混凝土结构",value:parseInt(Math.random()*100)},
                {name:"钢结构",value:parseInt(Math.random()*100)},
                {name:"二结构",value:parseInt(Math.random()*100)},
                {name:"机电结构",value:parseInt(Math.random()*100)},
                {name:"混凝土结构",value:parseInt(Math.random()*100)},
            ],
            qualityIssue:[
                {name:"混凝土结构",value:parseInt(Math.random()*100)},
                {name:"钢结构",value:parseInt(Math.random()*100)},
                {name:"二结构",value:parseInt(Math.random()*100)},
                {name:"机电结构",value:parseInt(Math.random()*100)},
                {name:"混凝土结构",value:parseInt(Math.random()*100)},
            ]
        }
    }
}
</script>