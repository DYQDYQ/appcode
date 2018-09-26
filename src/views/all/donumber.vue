<style type="text/css">
    .numberbox{
        display: flex;
    }
    .buttonleft{
        border-radius: 2px 0 0 2px;
        float: left;
        height: 20px;
        font-size: 14px;
        line-height: 18px;
        color: #d44c4c;
        border: 1px solid #ececec;
        width: 20px;
        text-align: center;
        line-height: 20px;
        border-right: 0px solid #ececec;
    }
    .numbercontent{
        font-size: 14px;
        color: #666;
        -webkit-appearance: none;
        appearance: none;
        border: 1px solid #ececec;
        text-align: center;
        width: 40px;
        height: 20px;
        line-height: 20px;

    }
    .buttonright{
        border-left: none;
        margin-right: 5px;
        border-radius: 0 2px 2px 0;
        float: left;
        height: 20px;
        font-size: 14px;
        line-height: 20px;
        color: #d44c4c;
        border: 1px solid #ececec;
        width: 20px;
        border-left: 0px solid #ececec;
        text-align: center;
    }
    .fontcolor{
        color: #ccc;
    }
</style>
<template>
    <div class="numberbox">
        <div class="buttonleft" :class="{'fontcolor':newvalue == min}" @click="removeit">
            <Icon type="minus"></Icon>
        </div>
        <div class="numbercontent">{{newvalue}}</div>
        <div class="buttonright" :class="{'fontcolor':newvalue == max}" @click="addit">
            <Icon type="plus"></Icon>
        </div>
    </div>
</template>
<script>
    export default {
        props:['min','max','value','index'],
        data(){
            return{
                newvalue:this.value,
            }
        },
        methods:{
            removeit(){
                if(this.newvalue>this.min){
                    this.newvalue--;
                };
                this.$emit('numbervalue',this.newvalue,this.index);
            },
            addit(){
                if(this.newvalue < this.max){
                    this.newvalue++;
                };
                this.$emit('numbervalue',this.newvalue,this.index);
            }
        }
    }
</script>