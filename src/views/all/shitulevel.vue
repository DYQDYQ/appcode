<style scoped lang="less">
    @import url("../../less/all/locator.less");
</style>
<template>
    <div ref="wrapper">
                <div class="pupheader">
                    <div class="headerleft" @click="cancelfloor('cancel')">取消</div>
                    <div class="headertitle"></div>
                    <div class="headerright" @click="cancelfloor('sure')">完成</div>
                </div>
                <div v-for="(item,index) in addlevel" class="floor">
                    <div class="tonext">
                        <!-- <Icon type="chevron-right"></Icon> -->
                        <span>{{item.value}}</span>
                    </div>
                    <div class="checkstate" @click="choseit(item,index)">
                        <span class="yesicon" v-show="item.check"></span>
                    </div>
                </div>
                <div class="floor" style="justify-content: center;font-size:28px;" @click = "addfile = true">
                    <Icon type="plus-circled"></Icon>
                </div>
                <Modal v-model="addfile" title="新建文件夹" :closable="false">
                    <div tyle="text-align:center"> 
                         <Input v-model="filename" placeholder="新建文件夹名称" style="height:30px;"></Input>
                    </div>
                    <div slot="footer">
                        <Button  size="small" @click="addfile=false">取消</Button>
                        <Button type="error" size="small" @click="addpath">确定</Button>
                    </div>
                </Modal>
        </div>
</template>
<script>
    import BScroll from 'better-scroll';
    export default{
        data(){
            return{
                addlevel:[],
                level:1,
                addfile:false,
                filename:'',
                choseitem:[],

            }
        },
        methods:{
            choseit(v,i){
                this.addlevel.forEach((val,index)=>{
                    if(index != i){
                        val.check=false;
                    }
                })
                v.check = !v.check;
                this.choseitem[0] = v.value;
                this.choseitem[1] = v.id;
            },
            addpath(){
                let vm = this;
                mui.ajax({
                    url:`${vm.$store.state.serverIp}/task/viewpointcategory/?token=`+vm.$store.state.sessionid,
                    type:"POST",
                    data:{
                        name:vm.filename,
                        belongmodel:vm.$store.state.belongmodel,
                    },
                    success(res){
                        let obj = {
                            id:res.id,
                            value:res.name,
                            check:false,
                            belongmodel:res.belongmodel,
                            parent:res.parent
                        }
                        vm.addlevel.push(obj);
                        vm.addfile = false;
                    }
                })
            },
            cancelfloor(i){
                if(i == 'cancel'){
                    this.addlevel.forEach(val=>{
                        val.check = false;
                    })
                }else{

                    this.$emit("subcontent",this.choseitem);
                }
                this.$emit("closefloor",false);
            }
        },
        mounted(){
            let vm = this;
            vm.addlevel = [];
            mui.ajax({
                url:`${vm.$store.state.serverIp}/task/viewpointcategory/?belongmodel__relatedmajor=${_curMajor}&belongmodel__relatedunitproject=${_curUnitId}&parent=&parent__isnull=true&token=`+vm.$store.state.sessionid,
                type:'GET',
                success(res){
                    res.results.forEach(val=>{
                        let obj = {
                            id:val.id,
                            value:val.name,
                            check:false,
                            belongmodel:val.belongmodel,
                            parent:val.parent
                        }
                        vm.addlevel.push(obj);
                    })
                }

            });
            this.$nextTick(function(){
                this.scroll = new BScroll(this.$refs.wrapper,{});
            })
        }
    }
</script>