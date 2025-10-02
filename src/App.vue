<script lang="ts" setup>
import useApp from "./hooks/useApp.ts";
import Top from "./components/indexview/Top.vue";
import useCurrentPath from "./hooks/useCurrentPath.ts";

useApp();
const {currentView} = useCurrentPath();


</script>

<template>
  <Top/>
  <component :is="currentView"/>
</template>

<style scoped>
</style>
