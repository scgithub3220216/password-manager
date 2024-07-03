<script setup lang="ts">
import useApp from "./hooks/useApp.ts";

const {currentView} = useApp();




</script>

<template>
  <component :is="currentView"/>
</template>

<style scoped>


</style>
