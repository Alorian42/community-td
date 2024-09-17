import * as THREE from 'three';
import Engine from './Engine';
import type Entity from '../entity/Entity';

const width = window.innerWidth;
const height = window.innerHeight;
const aspect = width / height;
const frustumSize = 100;
const cameraMoveSpeed = 0.5;

export default class RenderEngine extends Engine {
	private scene!: THREE.Scene;
	private camera!: THREE.OrthographicCamera;
	private renderer!: THREE.WebGLRenderer;
	private ambientLight!: THREE.AmbientLight;
	private directionalLight!: THREE.DirectionalLight;

	private cameraMove = {
		forward: false,
		backward: false,
		left: false,
		right: false
	};

	public override start(): void {
		this.init();

		document.querySelector('.wrapper')?.appendChild(this.renderer.domElement);

		console.log('Render Engine started');
	}

	public init(): void {
		this.scene = new THREE.Scene();
		this.camera = new THREE.OrthographicCamera(
			(-frustumSize * aspect) / 2,
			(frustumSize * aspect) / 2,
			frustumSize / 2,
			-frustumSize / 2,
			0.1,
			1000
		);

		this.scene.background = new THREE.Color(0x666666);

		this.camera.position.set(0, 25, 0); // Position above and to the side
		this.camera.lookAt(new THREE.Vector3(0, 0, 0)); // Look at the scene's center
		this.camera.zoom = 1; // Increase for closer view, decrease for a more zoomed-out view
		this.camera.updateProjectionMatrix();

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(width, height);

		this.ambientLight = new THREE.AmbientLight(0x404040);
		this.scene.add(this.ambientLight);

		this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		this.directionalLight.position.set(50, 100, 50);
		this.directionalLight.castShadow = true;
		this.scene.add(this.directionalLight);

		this.renderer.setAnimationLoop((time: DOMHighResTimeStamp) => this.animate(time));
		window.addEventListener('resize', () => this.onResize());
		window.addEventListener('wheel', (event: WheelEvent) => this.onZoom(event));
		window.addEventListener('mousemove', (event: MouseEvent) => this.onMouseMove(event));
		this.renderer.domElement.addEventListener('mouseleave', () => {
			this.resetCameraMove();
		});
	}

	public renderEntity(entity: Entity): void {
		this.scene.add(entity.getMesh());
	}

	private animate(time: DOMHighResTimeStamp): void {
		this.updateCamera();
		this.renderer.render(this.scene, this.camera);
	}

	private onResize(): void {
		const aspect = window.innerWidth / window.innerHeight;
		this.camera.left = (-frustumSize * aspect) / 2;
		this.camera.right = (frustumSize * aspect) / 2;
		this.camera.top = frustumSize / 2;
		this.camera.bottom = -frustumSize / 2;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	private onZoom(event: WheelEvent): void {
		const zoomSpeed = 0.01;

		this.camera.zoom += event.deltaY * -zoomSpeed;
		this.camera.zoom = Math.max(0.3, Math.min(5, this.camera.zoom));
		this.camera.updateProjectionMatrix();
	}

	private onMouseMove(event: MouseEvent): void {
		if (event.clientX < 75) {
			this.cameraMove.left = true;
			this.cameraMove.right = false;
		} else if (event.clientX > window.innerWidth - 75) {
			this.cameraMove.right = true;
			this.cameraMove.left = false;
		} else {
			this.cameraMove.left = false;
			this.cameraMove.right = false;
		}

		if (event.clientY < 75) {
			this.cameraMove.forward = true;
			this.cameraMove.backward = false;
		} else if (event.clientY > window.innerHeight - 75) {
			this.cameraMove.backward = true;
			this.cameraMove.forward = false;
		} else {
			this.cameraMove.forward = false;
			this.cameraMove.backward = false;
		}
	}

	private updateCamera(): void {
		if (this.cameraMove.forward) {
			this.camera.translateY(cameraMoveSpeed);
		}

		if (this.cameraMove.backward) {
			this.camera.translateY(-cameraMoveSpeed);
		}

		if (this.cameraMove.left) {
			this.camera.translateX(-cameraMoveSpeed);
		}

		if (this.cameraMove.right) {
			this.camera.translateX(cameraMoveSpeed);
		}
	}

	private resetCameraMove(): void {
		this.cameraMove.forward = false;
		this.cameraMove.backward = false;
		this.cameraMove.left = false;
		this.cameraMove.right = false;
	}
}