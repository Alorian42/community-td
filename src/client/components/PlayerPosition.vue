<script setup lang="ts">
import { ref } from 'vue';
import type UnitEngine from '../class/engine/UnitEngine';
import { container } from 'tsyringe';
import type SimulatorEngine from '@/shared/class/engine/SimulatorEngine';
import MapUtils from '@/shared/class/utils/Map';
const x = ref('0');
const y = ref('0');
const gridX = ref('0');
const gridY = ref('0');
const centerX = ref('0');
const centerY = ref('0');

const entityEngine = container.resolve('entityEngine') as UnitEngine;
const simulatorEngine = container.resolve('simulatorEngine') as SimulatorEngine;

simulatorEngine.on('loop', () => {
	const player = entityEngine.getPlayer();

	if (player) {
		const position = entityEngine.getPlayer().getPosition();
		const gridPosition = MapUtils.fromMapToGrid(position.x, position.y);
		const cetnerPosition = MapUtils.fromGridToMap(gridPosition.x, gridPosition.y);
		x.value = position.x.toFixed(2);
		y.value = position.y.toFixed(2);
		gridX.value = gridPosition.x.toString();
		gridY.value = gridPosition.y.toString();
		centerX.value = cetnerPosition.x.toFixed(2);
		centerY.value = cetnerPosition.y.toFixed(2);
	}
});
</script>
<template>
	<div>
		<span>X: {{ x }} Y: {{ y }}</span>
		<span>Grid X: {{ gridX }} Grid Y: {{ gridY }}</span>
		<span>Center X: {{ centerX }} Center Y: {{ centerY }}</span>
	</div>
</template>
<style scoped>
div {
	position: absolute;
	top: 10px;
	left: 125px;
	padding: 10px;
	z-index: 100;
	color: black;
	background-color: white;

	user-select: none;

	span {
		display: block;
	}
}
</style>
