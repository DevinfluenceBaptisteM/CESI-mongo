<template>
  <div id="app">
    
    <Grid
      :name="'SQI-Dev'"
      :title="'SQI-DataGrid-Develop [0.1.0-Dev]'"
      :urlDataUser="''"
      :urlDataList="''"
      :dataUser="{}"
      :dataList="{}"
      :dataParams="{}"
      :primaryColor="'#bb0a1e'"
      :secondaryColor="'#8B0000'"
      :showFoot="true"
      :rowMultipleSelect="true"
      :numberRowsByPages="10"
      :searchable="true"
      :dblClickEditable="true"
      :mouseRowHover="'#F0F0F0'"
      :insertDirection="1"
    />
  </div>
</template>

<script>
import Grid from './components/grid.vue'

export default {
  name: 'App',
   data: function() {
    return {
      
    }
  },
  components: {
    Grid
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
