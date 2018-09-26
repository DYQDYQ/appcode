<style scoped>

</style>
<template>
    <div>
        <Tabs type="card" value="name1">
            <TabPane label="构件属性" name="name1">
                <property></property>
            </TabPane>
            <TabPane label="关联文件" name="name2">
                <file></file>
            </TabPane>
            <TabPane label="构件列表" name="name3">
                <list></list>
            </TabPane>
        </Tabs>
        
<!--         <div class="infordrawerHead" style="display: flex;align-items:center;justify-content:center;background-color: rgb(213, 76, 76);">
            <Button style="color:#FFF;width: 20%" type="text" @click="showchange('pro')">构件属性</Button>
            <Button style="color:#FFF;width: 20%" type="text" @click="showchange('file')">关联文件</Button>
            <Button style="color:#FFF;width: 20%" type="text" @click="showchange('list')">构件列表</Button>
            <Button style="color:#FFF;width: 20%" type="text" @click="showchange('kk')"></Button>
        </div>
        <div style="width: 100%;height: calc(100% - 32px)">
           
           <file v-else-if="showname == 'file'"></file>
           <list v-else-if="showname == 'list'"></list>
        </div> -->
        
    </div>
</template>
<script type="text/javascript">
    import property from './component/property.vue';
    import file from './component/file.vue';
    import list from './component/list.vue';
    export default{
        components:{
            property,
            file,
            list,
        },
        data(){
            return{
            }
        },
        methods:{

        }

    }
</script>