import * as THREE from 'three';
import Engine from '../../../shared/class/engine/Engine';
// @ts-ignore
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import type EntityRenderer from '../entity/base/EntityRenderer';
import type UnitEngine from './UnitEngine';
import MapUtils from '@/shared/class/utils/Map';

const width = window.innerWidth;
const height = window.innerHeight;
const aspect = width / height;
const frustumSize = 100;
const cameraMoveSpeed = 0.5;

export default class RenderEngine extends Engine {
	protected static readonly DEFAULT_POSITION = new THREE.Spherical(1000, Math.PI / 4, Math.PI / 3);
	private spherical = RenderEngine.DEFAULT_POSITION.clone();
	private scene!: THREE.Scene;
	private camera!: THREE.OrthographicCamera;
	private renderer!: THREE.WebGLRenderer;
	private ambientLight!: THREE.AmbientLight;
	private directionalLight!: THREE.DirectionalLight;

	private cameraMove = {
		forward: false,
		backward: false,
		left: false,
		right: false,
	};

	private isCameraMoveSuspended = false;

	private entityEngine!: UnitEngine;

	private models: Record<string, any> = {};

	private raycaster = new THREE.Raycaster();

	private clock = new THREE.Clock();

	public override start(): void {
		this.entityEngine = this.container.resolve('entityEngine');

		this.loadModels();
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
			0.01,
			2000
		);

		this.scene.background = new THREE.Color(0x666666);

		// Position above and to the side
		//this.camera.position.set(0, 5, 0);
		this.camera.position.setFromSpherical(this.spherical);
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

		// reset camera position on player on space
		window.addEventListener('keydown', (event: KeyboardEvent) => {
			if (event.code === 'Space') {
				const playerPosition = this.entityEngine.getPlayer().getPosition();
				this.camera.lookAt(new THREE.Vector3(playerPosition.x, 0, playerPosition.y));
				this.camera.updateProjectionMatrix();
			}
		});

		this.renderer.domElement.addEventListener('click', event => {
			event.preventDefault();

			const intersectionPoint = this.fromMouseToWorld(event);

			if (!intersectionPoint) {
				return;
			}

			const grid = MapUtils.fromMapToGrid(intersectionPoint.x, intersectionPoint.z);

			this.emit('spawnTower', grid.x, grid.y);
		});

		this.renderer.domElement.addEventListener('contextmenu', event => {
			event.preventDefault();

			const intersectionPoint = this.fromMouseToWorld(event);

			if (intersectionPoint) {
				// Move player to the calculated position
				this.entityEngine.movePlayer(intersectionPoint.x, intersectionPoint.z);
			}
		});

		this.renderer.domElement.addEventListener('mouseleave', () => {
			this.resetCameraMove();
		});
		document.querySelector('.ui')?.addEventListener('mouseenter', () => {
			this.suspendCameraMove();
		});
		document.querySelector('.ui')?.addEventListener('mouseleave', () => {
			this.resumeCameraMove();
		});
	}

	public fromMouseToWorld(event: MouseEvent): THREE.Vector3 | null {
		const mouse = new THREE.Vector2(
			(event.clientX / window.innerWidth) * 2 - 1, // X in NDC
			-(event.clientY / window.innerHeight) * 2 + 1 // Y in NDC
		);

		this.raycaster.setFromCamera(mouse, this.camera);

		const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
		const intersectionPoint = new THREE.Vector3();
		const intersects = this.raycaster.ray.intersectPlane(plane, intersectionPoint);

		if (intersects && !isNaN(intersectionPoint.x) && !isNaN(intersectionPoint.z)) {
			return intersectionPoint;
		}

		console.error('No valid intersection or ray is parallel to the XZ plane.');

		return null;
	}

	public renderEntity(entity: EntityRenderer): void {
		const unit = entity.getUnit().getMesh();

		this.renderMesh(unit);
	}

	public renderMesh(mesh: THREE.Object3D): void {
		this.scene.add(mesh);
	}

	public onReady(callback: () => void): void {
		this.on('ready', callback);
	}

	private async loadModels(): Promise<void> {
		const loader = new GLTFLoader();
		const modelsToLoad = {
			player: 'src/client/assets/models/Skeleton Rogue.glb',
			enemy: 'src/client/assets/models/Skeleton Minion.glb',
			tower: 'src/client/assets/models/Skeleton Warrior.glb',
			towerWeapon: 'src/client/assets/models/Axe.glb',
			bft1: 'src/client/assets/models/Floor Dirt Small.glb',
			gravestone1: 'src/client/assets/models/Gravestone.glb',
			grave1: 'src/client/assets/models/Grave-1.glb',
			tree1: 'src/client/assets/models/Dead tree.glb',
		};

		// Load all models
		Promise.allSettled(
			Object.entries(modelsToLoad).map(async ([name, path]) => {
				this.models[name] = await loader.loadAsync(path);
			})
		).then(() => {
			console.log(this.models);
			this.emit('ready');
		});
	}

	private animate(time: DOMHighResTimeStamp): void {
		const delta = this.clock.getDelta();

		this.entityEngine.getUnits().forEach(entityRenderer => {
			entityRenderer.getUnit().updateAnimation(delta);
		});

		this.updateCamera();

		this.scene.traverse((object: THREE.Object3D) => {
			if (object.userData.isHPBar) {
				object.quaternion.copy(this.camera.quaternion);
			}
		});

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
		if (this.isCameraMoveSuspended) {
			return;
		}

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

	private suspendCameraMove(): void {
		this.isCameraMoveSuspended = true;
	}

	private resumeCameraMove(): void {
		this.isCameraMoveSuspended = false;
		this.resetCameraMove();
	}

	public getModel(name: string): any {
		return this.models[name];
	}
}
