<style type="text/css">
      .label-wrapper {
        padding-bottom: 10px;
        margin-bottom: 10px;
        border-bottom: 1px solid #ccc;
      }
      .has-children {
          cursor: pointer;
        }
    .treename{
        display: inline-block;
        width: calc(100% - 80px);
    }
    .treenumber{
        float: right;
    }
    .treecount{
        display: inline-block; 
        width: 30px; 
        height: 14px; 
        border-radius: 12px; 
        line-height: 14px; 
        text-align: center; 
        background-color: rgb(221, 221, 221); 
        font-size: 14px;
    }
</style>
<template>
    <div class="maintree">
                <div class="label-wrapper">
                  <div :style="indent" :class="labelClasses">
                    <div class="treename" @click="toggleChildren">
                        {{ label }}
                    </div>
                    <div class="treenumber" @click="choseitem"><span class="treecount">{{count}}</span><span v-if="!single">
                        <Icon type="checkmark-round" v-if="data.check"></Icon>
                        <Icon type="minus-round" v-if="data.check == null"></Icon>
                        <Icon type="ios-circle-outline" v-if="data.check == false"></Icon>
                    </span></div>
                  </div>
                </div>

                 <treemenu 
                    
                   v-if="showChildren"

                   v-for="node in data.children" 

                   :label="node.label"

                   :depth="depth + 1"

                   :count="node.count"

                   :data ="node"

                   :single = "single"

                   @gettreeid = "gettreeid"

                   @childrencheck = "childrencheck"

                 >
                 </treemenu>
    </div>
</template>
<script>
    export default{
        name:'treemenu',
        props:['label', 'depth','count','data','single'],
        data(){
            return{
                showChildren: false,
                check:false,
                idarr:[],
            }
        },
        computed: {
           indent() {
             return { transform: `translate(${this.depth * 30}px)`,width: `calc(100% - ${this.depth * 30}px)`}
           },
           labelClasses() {
              return { 'has-children': this.data.children }
            },
        },
        methods:{
            toggleChildren() {
                this.showChildren = !this.showChildren;
            },
            choseall(data){
                let arr = [];
                if(!data.children){
                        return;
                };
                data.children.forEach(val=>{
                    val.check = data.check;
                    if(val.check){
                        arr.push(val.id);
                    }
                    if(!val.children){
                        return;
                    }else{
                        this.choseall(val);
                    }
                })
            },
            choseitem(){
                this.idarr = [];
                this.data.check = !this.data.check;
                this.choseall(this.data,this.data.id);
                // this.checkall(this.data,this.data.parentId);
                this.$emit('childrencheck',[this.data.check,this.data.id]);
                if(this.single){
                    if(!this.data.children){
                        this.$emit('gettreeid',this.data.id);
                    }
                    return; 

                   
                }
                this.getcheckid(this.data);
                this.$emit('gettreeid',this.idarr);
                
                
            },
            childrencheck(val){
                let arr = [];
                this.data.children.forEach(v=>{
                    if(v[1] == this.data.id){
                        v.check == v[0]
                    };
                    arr.push(v.check);
                    
                });
                if(arr.indexOf(false) == -1 && arr.indexOf(null) == -1){
                    this.data.check = true;
                    this.check = true;
                }else if(arr.indexOf(true) == -1 && arr.indexOf(null) == -1){
                    this.data.check = false;
                    this.check = false;
                }else{
                    this.data.check = null;
                    this.check = null;
                }
                this.$emit('childrencheck',[this.data.check,this.data.id])
            },
            getcheckid(data){
                if(!data.children){
                        return;
                };
                data.children.forEach(val=>{
                    if(val.check == true){
                        this.idarr.push(val.id);
                    }
                    if(!val.children){
                        return;
                    }else{
                        this.getcheckid(val);
                    }
                })
            },
            gettreeid(val){
                this.idarr = [];
                if(this.single){
                   this.$emit('gettreeid',val);
                   return; 
                }
                this.getcheckid(this.data);
                this.$emit('gettreeid',this.idarr);

            }
        }
    }
</script>