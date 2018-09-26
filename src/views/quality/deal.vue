<style scoped lang="less">
    @import url('../../less/quality/deal.less');
</style>

<template>
    <div class="main" style="padding: 16px 8px">
        <p style="background-color: rgb(222, 224, 237);font-size: 18px;color: black;padding: 2px 15px;">质量验收和数据录入</p>
        <div class="table">
            <p style="text-align: center;font-size: 22px;padding: 8px 0">
                <Icon type="bluetooth" class="blue" :class="{blueActive:blueActive}"></Icon>
                <span>{{blueActive?'已连接':'未连接'}}</span>
                <Icon type="clipboard" class="clipboard"></Icon>
                <span>正常验收</span>
            </p>
            <span style="margin-left: 2rem;">测量模式</span>
            <Select v-model="type" style="width:200px">
                <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <table>
                <tr>
                    <td colspan="2">轴线位置</td>
                </tr>
                <tr>
                    <td>剪力墙（5mm）</td>
                    <td width="80%">
                        <!--<label>{{shear?shear:'开始测量'}}</label>-->
                        <Input placeholder="请输入..." style="margin-bottom:-14px;"></Input>
                    </td>
                </tr>
                <tr>
                    <td>墙、柱、梁（8mm）</td>
                    <td>
                        <!--<label>{{others?others:'开始测量'}}</label>-->
                        <Input placeholder="请输入..." style="margin-bottom: -14px;"></Input>
                    </td>
                </tr>
                <tr>
                    <td>垂直度（10mm）</td>
                    <td><!--&gt;<label>{{verticality?verticality:'开始测量'}}</label>-->
                        <Input placeholder="请输入..." style="margin-bottom: -14px;"></Input>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">标高</td>
                </tr>
                <tr>
                    <td>层高（10mm）</td>
                    <td>
                        <!--<label>{{storey?storey:'开始测量'}}</label>-->
                        <Input placeholder="请输入..." style="margin-bottom: -14px;"></Input>
                    </td>
                </tr>
                <tr>
                    <td>全高（30mm）</td>
                    <td>
                        <!--<label>{{full?full:'开始测量'}}</label>-->
                        <Input placeholder="请输入..." style="margin-bottom: -14px;"></Input>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">预留埋量</td>
                </tr>
                <tr>
                    <td>预埋件</td>
                    <td>
                        <!--<label>{{embedded?embedded:'开始测量'}}</label>-->
                        <Input placeholder="请输入..." style="margin-bottom: -14px;"></Input>
                    </td>
                </tr>
                <tr>
                    <td>预埋管</td>
                    <td>
                        <!--<label>{{pipe?pipe:'开始测量'}}</label>-->
                        <Input placeholder="请输入..." style="margin-bottom: -14px;"></Input>
                    </td>
                </tr>
            </table>
            <div style="text-align: center;margin-top: 90px">
                <Button type="success" style="padding: 6px 30px;">保存</Button>
                <Button type="error" style="padding: 6px 30px;margin: 0 100px">清除</Button>
                <Button type="primary"style="padding: 6px 30px;">提交</Button>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                blueActive:true,
                type:0,
                typeList:[
                    { label:"距离",value:0 },
                    { label:"角度",value:1 },
                    { label:"面积",value:2 },
                    { label:"体积",value:3 },
                    { label:"勾股",value:4 },
                ],

                shear:null,
                others:null,
                verticality:null,
                storey:null,
                full:null,
                embedded:null,
                pipe:null
            }
        },
        mounted(){
            if(this.$store.state.environment==='dev'){
                setTimeout(()=>{
                    this.blueActive = true;
                },1000)
            }
        },
        computed:{
            id(){
                return this.$route.params.id
            }
        }
    }
</script>