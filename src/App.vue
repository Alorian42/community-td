<script setup lang="ts">
import SpawnEnemy from "./components/SpawnEnemy.vue";
import { onMounted, ref } from "vue";
import Game from "./class/engine/Game";
import RenderEngine from "./class/engine/RenderEngine";
import EntityEngine from "./class/engine/EntityEngine";
import SimulatorEngine from "./class/engine/SimulatorEngine";
import BackgroundEngine from "./class/engine/BackgroundEngine";

const uiInit = ref(false);
const game = new Game();

game.addEngine(new EntityEngine(), "entityEngine");
game.addEngine(new RenderEngine(), "renderEngine");
game.addEngine(new SimulatorEngine(), "simulatorEngine");
game.addEngine(new BackgroundEngine(), "backgroundEngine");

onMounted(() => {
  game.start();
  uiInit.value = true;
});
</script>

<template>
  <div class="ui">
    <template v-if="uiInit">
      <spawn-enemy />
    </template>
  </div>
  <div class="wrapper">
    <!-- THREE -->
  </div>
</template>

<style scoped></style>
