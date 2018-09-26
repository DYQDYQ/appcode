<style>
    .expand-row {
        height: 30px;
        line-height: 30px;
    }
    .expand-value1{
        overflow: hidden;
        max-width: 600px;
        text-overflow: ellipsis;
        display: inline-block;
        vertical-align: top;
        white-space: nowrap;
    }
</style>
<template>
    <div>
        <Row class="expand-row">
            <Col span="12">
                <span class="expand-key">发起时间: </span>
                <span class="expand-value">{{row.faqishijian}}</span>
            </Col>
            <Col span="12">
                <span class="expand-key">截止时间: </span>
                <span class="expand-value">{{row.deadline}}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="24">
                <span class="expand-key">当前负责人: </span>
                <span class="expand-value">{{row.dangqianfuzeren}}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="24">
                <span class="expand-key">备注: </span>
                <span class="expand-value1">{{row.describe}}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        props: ['row'],
        data(){
            return{
            }
        },
        computed: {
            lookrow: function(){
                console.log(this.row);
                return this.row;
            }
        }
    }
</script>