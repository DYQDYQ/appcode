<style type="text/css" scoped>
    .newimg{
        width: 100%;
        height: auto;
        border-bottom: 1px solid rgb(233, 234, 236);
        padding-bottom: 10px;
    }
    img{
        width: 100%;
    }
    .imglist{
        width: 100%;
        height: auto;
    }
    .miaoshucontent{
        margin-bottom: 15px;
        box-shadow: 0px 0px 5px #ddd;
        border-radius: 6px;
        border: 1px solid #dddd;
        overflow: hidden;
    }
    .miaoshu{
        width: 100%;
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center;
        padding: 4px 8px;
        margin-top: -5px;
        font-size: 14px;
    }
</style>
<template>
            <div ref="wrapper" class="wrapper" style="padding:10px 15px;">
            <ul>
                <li class="newimg" v-show="showadd">
                    <img id="wPaint-img">
                    <div>
                        <group>
                            <x-textarea v-model="describe" placeholder="请输入视点描述..." :show-counter="true" :max="100" :rows="2"></x-textarea>
                        </group>
                    </div>
                    <div>
                        <Button style='width: 49%' @click="cancel">取消</Button>
                        <Button style='width: 49%' type="error" @click="saveshidian">保存</Button>
                    </div>
                </li>
                <li v-for="(item,index) in imglist">
                    <swipeout>
                        <swipeout-item class="imglist">
                            <div slot="right-menu">
                              <swipeout-button @click.native="deleteimg(item.id,index)" background-color="#d44c4c">删除</swipeout-button>
                            </div>
                            <div slot="content" @click="restorestate(item.viewpoint)" class="miaoshucontent">
                                <img :src="serverIp+'/'+item.fileinfo.filepath+item.fileinfo.name">
                                <div class="miaoshu">{{item.name}}</div>
                            </div>
                            
                        </swipeout-item>
                    </swipeout>
                </li>
<!--                 <li>
                    <div slot="content" @click="restorestate(item.viewpoint)" class="miaoshucontent">
                        <img src="../../img/loginBackground.jpg">
                        <div class="miaoshu">还是撒讲哈就是橘阿还是假安徽省</div>
                    </div>
                </li>  -->          
            </ul>
            <div class="miaoshu" v-if="imglist.length == 0">暂时没有数据哟</div>
            <Spin fix v-if="loading"></Spin>
            </div>
</template>
<script>
    import { Group ,XTextarea,Swipeout, SwipeoutItem, SwipeoutButton} from 'vux';
    import BScroll from 'better-scroll';
    export default{
        components:{
            Group,
            XTextarea,
            Swipeout,
            SwipeoutItem,
            SwipeoutButton
        },
        data(){
            return{
                describe:'',
                imglist:[],
                showadd:false,
                serverIp:this.$store.state.serverIp,
                loading:true,
                scroll:null,
            }
        },
        mounted(){
            let vm = this;
            if(this.$store.state.shitu != ''){
                this.$nextTick(function(){
                    this.showadd = true;
                    let shitu = this.$store.state.shitu;
                    $('#wPaint-img').attr('src',this.$store.state.serverIp+shitu.url);
                })
              
            }
            mui.ajax({
                url:`${vm.$store.state.serverIp}/task/viewpoint/?belongmodel__relatedunitproject=${_curUnitId}&belongmodel__relatedmajor=${_curMajor}&token=${vm.$store.state.sessionid}`,
                type:'GET',
                success(res){
                    vm.imglist = res.results;
                    vm.loading = false;

                }

            });

            this.$nextTick(function(){
                let height = document.body.clientHeight - 98;
                $(".wrapper").css("height",height);
                this.scroll = new BScroll(this.$refs.wrapper,{});
            })
        },
        methods:{
            saveshidian(){
                let vm = this;
                if(vm.describe == ''){
                    vm.$Message.error("请输入描述");
                    return;
                };
                mui.ajax({
                    url:`${vm.$store.state.serverIp}/task/viewpoint/?token=${vm.$store.state.sessionid}`,
                    type:"POST",
                    data:{
                        "name":vm.describe,
                        "viewpoint":vm.$store.state.shitustate,
                        "belongmodel":_curMajor,
                        "file":vm.$store.state.shitu.docId
                    },
                    success(res){
                        vm.loadlist();

                    }
                })

            },
            restorestate(val){
                _viewer.restoreState(JSON.parse(val));
            },
            cancel(){
                this.showadd = false;
                this.$store.commit("setshitu",'');
            },
            loadlist(){
                let vm = this;
                mui.ajax({
                url:`${vm.$store.state.serverIp}/task/viewpoint/?belongmodel__relatedunitproject=${_curUnitId}&belongmodel__relatedmajor=${_curMajor}&token=${vm.$store.state.sessionid}`,
                type:'GET',
                success(res){
                    vm.showadd = false;
                    vm.$store.commit("setshitu",'');
                    vm.imglist = res.results;
                }

                });

            },
            deleteimg(id,index){
                let vm = this;
                mui.ajax({
                    url:`${vm.$store.state.serverIp}/task/viewpoint/${id}/?token=${vm.$store.state.sessionid}`,
                    type:'delete',
                    success(res){
                        vm.imglist.splice(index,1);
                        vm.$Message.success("删除成功");
                    }
                })
            }

        }
    }
</script>