<script setup lang="ts">
import type EntityEngine from "@/client/class/engine/EntityEngine";
import Enemy from "@/client/class/entity/Enemy";
import { container } from "tsyringe";

const entityEngine = container.resolve("entityEngine") as EntityEngine;

const randomXY = (maxX: number, maxY: number) => {
  return {
    x: Math.floor(Math.random() * maxX) - 5,
    y: Math.floor(Math.random() * maxY) - 5,
  };
};

const spawn = () => {
  const { x, y } = randomXY(15, 15);
  const enemy = new Enemy(x, y);
  entityEngine.spawnEntity(enemy);

  const { x: x2, y: y2 } = randomXY(100, 100);
  enemy.startMove(x2, y2);

  enemy.on(
    "stopMove",
    () => {
      entityEngine.removeEntity(enemy);
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
