<script setup lang="ts">
import { onMounted } from 'vue';
import Game from './class/engine/Game';
import RenderEngine from './class/engine/RenderEngine';
import EntityEngine from './class/engine/EntityEngine';

const game = new Game();

game.addEngine(new EntityEngine(), 'entityEngine');
game.addEngine(new RenderEngine(), 'renderEngine');

onMounted(() => {
	game.start();
});
</script>

<template>
	<div class="wrapper">
		<!-- THREE -->
	</div>
</template>

<style scoped></style>
