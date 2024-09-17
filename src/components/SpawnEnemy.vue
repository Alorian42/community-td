<script setup lang="ts">
import type EntityEngine from '@/class/engine/EntityEngine';
import Enemy from '@/class/entity/Enemy';
import { container } from 'tsyringe';

const entityEngine = container.resolve('entityEngine') as EntityEngine;

const randomXY = () => {
	return {
		x: Math.floor(Math.random() * 100) - 5,
		y: Math.floor(Math.random() * 100) - 5,
	};
};

const spawn = () => {
	const { x, y } = randomXY();
	entityEngine.spawnEntity(new Enemy(x, y));
};
</script>
<template>
	<button @click="spawn">Spawn Enemy</button>
</template>
<style scoped>
button {
	position: absolute;
	top: 10px;
	left: 10px;
	padding: 10px;
	z-index: 100;
}
</style>
