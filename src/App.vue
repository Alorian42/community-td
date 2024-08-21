<script setup lang="ts">
import * as THREE from 'three';
import { onMounted, reactive } from 'vue';

const width = window.innerWidth;
const height = window.innerHeight;
const aspect = width / height;
const frustumSize = 100;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
	(-frustumSize * aspect) / 2,
	(frustumSize * aspect) / 2,
	frustumSize / 2,
	-frustumSize / 2,
	0.1,
	1000
);

scene.background = new THREE.Color(0xaaaaaa);

camera.position.set(0, 25, 0); // Position above and to the side
camera.lookAt(new THREE.Vector3(0, 0, 0)); // Look at the scene's center
camera.zoom = 1; // Increase for closer view, decrease for a more zoomed-out view
camera.updateProjectionMatrix();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

// Cube
const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(20, 5, 0);
scene.add(cube);

// Sphere
const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-20, 5, 0);
scene.add(sphere);

// Cylinder
const cylinderGeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
const cylinderMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.position.set(0, 0, 0);
cylinder.rotation.x = Math.PI / 2;
scene.add(cylinder);

// Ambient Light
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(50, 100, 50);
directionalLight.castShadow = true;
scene.add(directionalLight);

const moveSpeed = 1;

let lastTime = 0;

function movePlayer() {
	if (keysPressed.w) {
		cylinder.translateY(-moveSpeed);
	}

	if (keysPressed.s) {
		cylinder.translateY(+moveSpeed);
	}

	if (keysPressed.a) {
		cylinder.translateX(-moveSpeed);
	}

	if (keysPressed.d) {
		cylinder.translateX(moveSpeed);
	}
}

function moveCamera() {
	const cameraMoveSpeed = moveSpeed / 2;

	if (keysPressed.w) {
		// Move forward in the camera's local y-axis direction
		camera.translateY(cameraMoveSpeed);
	}
	if (keysPressed.s) {
		// Move backward in the camera's local y-axis direction
		camera.translateY(-cameraMoveSpeed);
	}
	if (keysPressed.a) {
		// Strafe left in the camera's local x-axis direction
		camera.translateX(-cameraMoveSpeed);
	}
	if (keysPressed.d) {
		// Strafe right in the camera's local x-axis direction
		camera.translateX(cameraMoveSpeed);
	}

	camera.updateProjectionMatrix();
}

function animate(time: DOMHighResTimeStamp) {
	// Rotate objects for some basic animation
	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;

	if (time - lastTime > 1000) {
		sphere.material.color.setHex(Math.random() * 0xffffff);
		lastTime = time;
	}

	//cylinder.rotation.x += 0.01;
	//cylinder.rotation.y += 0.01;

	movePlayer();
	moveCamera();

	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
	const aspect = window.innerWidth / window.innerHeight;
	camera.left = (-frustumSize * aspect) / 2;
	camera.right = (frustumSize * aspect) / 2;
	camera.top = frustumSize / 2;
	camera.bottom = -frustumSize / 2;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
});

function onScrollZoom(event: WheelEvent) {
	const zoomSpeed = 0.01; // Adjust this value to control zoom speed

	// Adjust zoom based on scroll direction
	camera.zoom += event.deltaY * -zoomSpeed;

	// Clamp the zoom level to prevent zooming too far in or out
	camera.zoom = Math.max(0.3, Math.min(5, camera.zoom));

	// Update the camera's projection matrix after modifying the zoom
	camera.updateProjectionMatrix();
}

window.addEventListener('wheel', onScrollZoom);

const keysPressed = reactive({
	w: false,
	a: false,
	s: false,
	d: false,
});

function onKeyDown(event: KeyboardEvent) {
	switch (event.key) {
		case 'w':
			keysPressed.w = true;
			break;
		case 'a':
			keysPressed.a = true;
			break;
		case 's':
			keysPressed.s = true;
			break;
		case 'd':
			keysPressed.d = true;
			break;
	}
}

function onKeyUp(event: KeyboardEvent) {
	switch (event.key) {
		case 'w':
			keysPressed.w = false;
			break;
		case 'a':
			keysPressed.a = false;
			break;
		case 's':
			keysPressed.s = false;
			break;
		case 'd':
			keysPressed.d = false;
			break;
	}
}

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

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
