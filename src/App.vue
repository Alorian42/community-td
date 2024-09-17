<script setup lang="ts">
import { onMounted } from 'vue';
import Game from './engine/Game';
import RenderEngine from './engine/RenderEngine';

const game = new Game();

game.addEngine(new RenderEngine());

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
