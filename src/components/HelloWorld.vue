<script setup lang="ts">


defineProps<{ msg: string }>()

// const count = ref(0)

function sendMessageToMain() {
  setTimeout(() => {
    // window.ipcRenderer.send('channel-name', 'Hello from Renderer');
  }, 2000)
}

sendMessageToMain();


</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <!--    <button type="button" @click="count++">count is {{ count }}</button>-->
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
