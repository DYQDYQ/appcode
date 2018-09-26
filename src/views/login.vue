<style scoped lang="less">
    @import "../less/login.less";
</style>
<style type="text/css">
    .logininput input{
      margin-bottom:0px !important;
    }
</style>
<template>
    <div class="login">
        <Form :model="formItem" class="loin-info" ref="loginForm">
            <img src="../img/logo.png" height="100" width="100"/>
            <div class="infobac"></div>
            <div class="info">

                <FormItem prop="user" class="logininput">
                    <Input v-model="formItem.user" placeholder="用户名" name="username">
                    <span slot="prepend"><Icon type="person"></Icon></span>

                    </Input>
                </FormItem>
                <FormItem prop="password" class="logininput">
                    <Input v-model="formItem.password" placeholder="密码" type="password" name="password">
                     <span slot="prepend"><Icon type="locked"></Icon></span>
                    </Input>
                </FormItem>
                <FormItem prop="area">
                    <Select v-model="formItem.area">
                        <Option v-for="item in project" :value="item.projecturl" :key="item.name">{{ item.name }}</Option>
                    </Select>
                </FormItem>
<!--                 <Checkbox v-model="other" label="remember" style="height: 30px;line-height: 30px;float: left;">
                    <span>记住密码</span>
                </Checkbox> -->
                <FormItem>
                    <Button type="ghost" @click="handleSubmit" class="loginBtn">登录</Button>
                </FormItem>
            </div>
        </Form>
    </div>
</template>
<script>
import everment from './../config/env';
import { XInput ,Group} from 'vux'
export default {
    components:{
        XInput,
        Group
    },
    data(){
        return {
            formItem:{
                user:"",
                password:"",
                area:localStorage.server
            },
            project:[],
            other:true,
            
        }
    },
    methods:{
        handleSubmit() {
            let vm = this;
            if(vm.formItem.user.length == 0 || vm.formItem.password.length == 0){
                vm.$Message.error("账户名和密码不能为空");
                return;
            }
            if(this.other){
                let arr = [];
                var users = [];
                if(localStorage.users != undefined){
                     users = JSON.parse(localStorage.users);
                }
                let obj = {
                    id : this.formItem.area,
                    user:this.formItem.user,
                    password:this.formItem.password,
                }
                users.forEach(val=>{
                    if(val.id == this.formItem.area){
                        val.user = this.formItem.user;
                        val.password = this.formItem.password;
                    }
                    arr.push(val.id);
                })
                if(arr.indexOf(this.formItem.area) == -1){
                    users.push(obj);
                }
                localStorage.users = JSON.stringify(users);
            }
            mui.ajax({
                url:`${this.$store.state.serverIp}/wslogin/`,
                data: {
                    username:this.formItem.user,
                    password:this.formItem.password
                },
                dataType: 'json',
                type: 'post',
                timeout: 10000,
                crossDomain:true,
                success(data) {
                    if(data.res==='fail'){
                        vm.$Message.error(data.error);
                        localStorage.password = '';
                        vm.formItem.password = "";
                        localStorage.state = null;
                        return
                    }
                    vm.$store.dispatch('getUserInfo');
                    vm.$Message.success('登录成功!');
                    localStorage.colorstate = '/task/modelview/getpbstatuslist/';
                    changeIp(vm.$store.state.environment);
                    vm.project.forEach(val=>{
                        if(val.projecturl == vm.formItem.area){
                            vm.$store.commit('setprojectid',val.id);
                            localStorage.projectid = val.id;
                        }
                    })
                    vm.$router.push({path: "/main/all/modelView"});
                    vm.$store.commit('setsessionid',data.sessionid);
                    localStorage.sessionid = data.sessionid;
                    
                },
                error(data) {
                    if(vm.$store.state.environment==="dev"){
                        vm.$Message.success('开发环境登录成功!');
                        vm.$router.push("/select")
                    } else {
                        vm.$Message.error('登录失败!');
                    }
                }
            });
        },
    },
    computed:{
        users(){
            return localStorage.server;
        }
    },
    watch:{
        'formItem.area' (value){
            localStorage.server = value;
            if(localStorage.users != undefined){
                let arrs = [];
                let arr = JSON.parse(localStorage.users);

                if(arr.length > 0){
                   arr.forEach(val=>{
                        arrs.push(val.id)
                    }) 
                }
                if(arrs.indexOf(localStorage.server) > -1){
                    this.formItem.user = arr[arrs.indexOf(localStorage.server)].user;
                    this.formItem.password = arr[arrs.indexOf(localStorage.server)].password
                }else{
                    this.formItem.user = '';
                    this.formItem.password = '';
                }
                
            }

            if(everment !== "development"){
                this.$store.commit('saveIp',value);
            }
            
        },
        users(val){
        }
    },
    mounted(){
        let vm = this;
        if(localStorage.users != undefined){
            let arrs = [];
            let arr = JSON.parse(localStorage.users);

            if(arr.length > 0){
               arr.forEach(val=>{
                    arrs.push(val.id)
                }) 
            }
            if(arrs.indexOf(localStorage.server) > -1){
                this.formItem.user = arr[arrs.indexOf(localStorage.server)].user;
                this.formItem.password = arr[arrs.indexOf(localStorage.server)].password
            }
            
        }
        $.ajax({
            url:vm.$store.state.serverIp+"/user/project/?isAll=True",
            success(res){
                console.log("初始化project");
                console.log(res);
                vm.project = res.results;

            },
            error(error){
                console.log("初始化project错误");
                console.log(error);
            }
        });
    }
}
</script>