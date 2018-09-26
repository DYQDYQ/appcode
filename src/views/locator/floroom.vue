<style>
    
</style>
<template>
    <div>
        <room></room>
        <type></type>
    </div>
</template>
<script>
    import room from './building.vue';
    import type from './type.vue';
    export default {
        components:{
            room,
            type,
        },
        props:{

        }
        data(){
            return{

            }
        }
    }
</script>