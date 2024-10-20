<script setup lang="ts">
import SpawnEnemy from './components/SpawnEnemy.vue';
import { onMounted, ref } from 'vue';
import GameClient from '@client/class/engine/GameClient';
import RenderEngine from './class/engine/RenderEngine';
import SimulatorEngine from '../shared/class/engine/SimulatorEngine';
import BackgroundEngine from './class/engine/BackgroundEngine';
import UnitEngine from './class/engine/UnitEngine';
import PlayerPosition from './components/PlayerPosition.vue';
import EnemyEngine from '@/shared/class/engine/EnemyEngine';
import TowerEngine from '@/shared/class/engine/TowerEngine';
import CombatEngine from '@/shared/class/engine/CombatEngine';

const uiInit = ref(false);
const game = new GameClient();

game.addEngine(new UnitEngine(), 'entityEngine');
game.addEngine(new RenderEngine(), 'renderEngine');
game.addEngine(new SimulatorEngine(), 'simulatorEngine');
game.addEngine(new BackgroundEngine(), 'backgroundEngine');
game.addEngine(new EnemyEngine(), 'enemyEngine');
game.addEngine(new TowerEngine(), 'towerEngine');
game.addEngine(new CombatEngine(), 'combatEngine');

onMounted(() => {
	game.start();
	uiInit.value = true;
});
</script>

<template>
	<div class="ui">
		<template v-if="uiInit">
			<spawn-enemy />
			<player-position />
		</template>
	</div>
	<div class="wrapper">
		<!-- THREE -->
	</div>
</template>

<style scoped></style>
