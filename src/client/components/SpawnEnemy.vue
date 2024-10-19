<script setup lang="ts">
import Enemy from '@/client/class/entity/Enemy';
import { container } from 'tsyringe';
import map from '@shared/assets/maps/map0.json';
import type UnitEngine from '../class/engine/UnitEngine';
import { onMounted } from 'vue';
import MapUtils from '@/shared/class/utils/Map';

const entityEngine = container.resolve('entityEngine') as UnitEngine;

const randomXY = (maxX: number, maxY: number) => {
	return {
		x: Math.floor(Math.random() * maxX) - 5,
		y: Math.floor(Math.random() * maxY) - 5,
	};
};

const spawn = () => {
	const spawnPoint = map.enemySpawnPoint;
	const mapPoisition = MapUtils.fromGridToMap(spawnPoint.x, spawnPoint.y);
	const enemy = Enemy.fromXY(mapPoisition.x, mapPoisition.y);
	entityEngine.spawnUnit(enemy);
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
