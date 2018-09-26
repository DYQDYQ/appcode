<style scoped lang="less">
    @import url('../../less/quality/check.less');
</style>

<template>
    <div class="sizer">
        <label>质量验收单</label>
        <ul class="info">
            <li v-for="item in checkData" class="clear-fix">
                <span @click="focus(item)">{{item.name}}</span>
                <Button type="error" size="small" @click="change(item.id)">处理</Button>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        components:{
        },
        data(){
            return {
                checkData:[],
                plus:false,
                temp:null
            }
        },
        methods:{
            change(id){
                this.$router.push(`/main/quality/check/${id}`);
            },
            focus(item){
                if(item.id===this.temp){
                    this.plus = false;
                    this.temp = null;
                } else {
                    this.plus = true;
                    this.temp = item.id;
                }
                _viewer.isolateById([23482,23424,23443]);
            },
            openQr(){
                if(this.$store.state.environment==='dev'){
                    this.$store.commit("addQR",{
                        value:"asdfasdfasdas"
                    })
                } else {
                    mui.openWindow({
                        url: './scanQR.html',
                        id: "abc",
                        styles: {},
                        extras: {}
                    });
                }
            }
        },
        mounted(){
//            if(this.$store.state.environment==='dev'){
            setTimeout(()=>{
                _curMajor = 1;
                _curUnitId = 10;
                getModelFile();
            },500);
                this.checkData =  [
                    {
                        name: '七框1区地下混凝土质量验收',
                        id:1
                    },
                    {
                        name: '八框1区地下混凝土质量验收',
                        id:2
                    },
                    {
                        name: '八框2区地下混凝土质量验收',
                        id:4
                    },
                    {
                        name: '九框4区地下混凝土质量验收',
                        id:3
                    },
                ]
//            }
        },
        computed:{
            qr(){
                return this.$store.state.QR;
            }
        },
        watch:{
            qr(){
                if(this.qr!==null){
                    this.$router.push(`/main/quality/check/${this.qr}`);
                }
            }
        }
    }
</script>