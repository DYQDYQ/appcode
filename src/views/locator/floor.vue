<style>
    .selector>i{
        width: 35px;
        height: 35px;
        font-size: 16px;
        line-height: 35px;
        transition: all 0.3s ease;
    }
    .rotate{
        transform: rotate(-90deg);
    }
    ul{
        list-style:none;
    }
</style>

<template>
    <li class="selector" style="height: auto">
        <Checkbox v-model="value" :indeterminate="indeterminate" style="padding-left: 12px">{{name}}</Checkbox>
        <Icon :type="type" style="float: right;text-align: center;" @click.native="getChildren"></Icon>
        <CheckboxGroup style="padding-left: 24px" v-model="zone">
            <ul v-if="state===1">
                <li v-for="i in children" :key="i.id">
                    <Checkbox :label="i.id">{{i.name}}</Checkbox>
                </li>
            </ul>
        </CheckboxGroup>
    </li>
</template>

<script>
    export default {
        props: {
            floor: {
                type:[Number,String],
                required:true
            },
            name:{
                type:String,
                required:true
            },
        },
        data(){
            return {
                children:[],
                indeterminate:false,
                state:-1,
                zone:[],
                value:true
            }
        },
        methods:{
            getChildren(){
                let vm = this;
                if(vm.children.length===0&&vm.state===-1){
                    vm.state++;
                    mui.ajax({
                        url:vm.$store.state.serverIp + '/task/zones/?token='+vm.$store.state.sessionid,
                        data:{
                            elevations:vm.floor
                        },
                        success(res){
                            let results = res.results;
                            vm.state++;
                            if(results){
                                vm.children = results;
                                vm.zone=[];
                                if(vm.value){
                                    results.forEach(t=>{
                                        vm.zone.push(t.id)
                                    })
                                }
                            } else {
                                vm.state++
                            }
                        },
                        error(){
                            vm.state--
                        }
                    })
                } else if(vm.children.length>0&&vm.state===-1){
                    vm.state+=2;
                } else if(vm.children.length>0&&vm.state===1){
                    vm.state-=2;
                }
            },
            setValue(bool){
                this.value = bool
            }
        },
        computed:{
            type(){
                let vm = this;
                switch (vm.state){
                    case -1:return 'chevron-left';break;
                    case 0:return 'ivu-load-loop ivu-icon ivu-icon-load-c';break;
                    case 1:return 'chevron-left rotate';break;
                    case 2:return '';break;
                }
            }
        },
        watch:{
            zone(){
                if(this.zone.length<this.children.length&&this.zone.length>0){
                    this.indeterminate = true;
                } else if(this.zone.length===this.children.length){
                    this.indeterminate = false;
                } else if(this.zone.length===0&&this.children.length>0){
                    this.indeterminate = false;this.value = false;
                }
                this.$emit('count');
            },
            value(value){
                this.$emit('count');
                if(!value){
                    this.zone=[];this.indeterminate = false;
                } else {
                    this.zone=[];
                    this.children.forEach(t=>{
                        this.zone.push(t.id)
                    })
                }
            }
        }
    }
</script>