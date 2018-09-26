<style scoped>
    .after{
        display: inline-block;
        width: 500px;
        float: right;
    }
    form{
        background: white;
        padding: 16px;
        height: 100%;
        overflow: auto;
    }
    form>div{
        border-bottom: 1px solid #DDDEE0;
    }
</style>

<template>
    <div class="main">
        <Form :label-width="100">
            <FormItem v-for="item in packages" class="clearfix">
                <label slot="label" style="font-size: 16px;">{{item.name}}</label>
                <Button type="info" v-if="item.process==0" class="after" style="width: unset">下载</Button>
                <Progress :percent="item.process" status="active" v-else-if="item.process>0&&item.process<100" class="after"></Progress>
                <Progress :percent="100" v-else-if="item.process==100" class="after"></Progress>
                <div class="after" v-else-if="item.process=='complete'" style="text-align: end">
                    <span>{{Math.random().toFixed(2)}}MB</span>
                    <Button type="warning">删除</Button>
                </div>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                packages:[
                    {name:'钢结构',process:0},
                    {name:"安全框架",process:61},
                    {name:"水泥外墙",process:100},
                    {name:"围栏",process:'complete'}
                ]
            }
        }
    }
</script>