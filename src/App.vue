<script setup lang="ts">
import * as THREE from 'three';
import { onMounted } from 'vue';

const width = 800;
const height = 600;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
	renderer.render(scene, camera);

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
}
renderer.setAnimationLoop(animate);

onMounted(() => {
	document.querySelector('.wrapper')?.appendChild(renderer.domElement);
});
</script>

<template>
	<div class="wrapper">
		<!-- THREE -->
	</div>
</template>

<style scoped></style>
