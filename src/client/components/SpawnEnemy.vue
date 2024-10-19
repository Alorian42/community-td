<script setup lang="ts">
import Enemy from "@/client/class/entity/Enemy";
import { container } from "tsyringe";
import map from "@shared/assets/maps/map0.json";
import type UnitEngine from "../class/engine/UnitEngine";

const entityEngine = container.resolve("entityEngine") as UnitEngine;

const randomXY = (maxX: number, maxY: number) => {
  return {
    x: Math.floor(Math.random() * maxX) - 5,
    y: Math.floor(Math.random() * maxY) - 5,
  };
};

const spawn = () => {
  const enemy = Enemy.fromXY(map.spawnPoint.x, map.spawnPoint.y);
  entityEngine.spawnUnit(enemy);

  const { x: x2, y: y2 } = randomXY(100, 100);
  enemy.getEntity().startMove(x2, y2);

  enemy.getEntity().on(
    "stopMove",
    () => {
      entityEngine.removeUnit(enemy);
    },
    true
  );
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
