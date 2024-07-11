<script lang="ts" setup>
import useApp from "./hooks/useApp.ts";
import Top from "./components/indexview/Top.vue";

const {currentView} = useApp();


</script>

<template>
  <Top/>
  <component :is="currentView"/>
</template>

<style scoped>
</style>
