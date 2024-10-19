import * as THREE from 'three';
import Engine from './Engine';
import type EntityEngine from './EntityEngine';
// @ts-ignore
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import type Unit from '../entity/base/Unit';

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
	private sceneBorders = {
		minX: -50,
		maxX: 50,
		minY: -50,
		maxY: 50
	};

	private cameraMove = {
		forward: false,
		backward: false,
		left: false,
		right: false
	};

	private isCameraMoveSuspended = false;

	private entityEngine!: EntityEngine;

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
		this.camera.lookAt(new THREE.Vector3(0,  0, 0)); // Look at the scene's center
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
		
		this.renderer.domElement.addEventListener('contextmenu', (event) => {
			event.preventDefault();
		
			// Get normalized device coordinates (NDC) from the mouse position
			const mouse = new THREE.Vector2(
				(event.clientX / window.innerWidth) * 2 - 1,  // X in NDC
				-(event.clientY / window.innerHeight) * 2 + 1 // Y in NDC
			);
		
			// Create a raycaster for projecting from camera to the scene
			this.raycaster.setFromCamera(mouse, this.camera);
		
			// Define a plane at y = 0 (XZ plane)
			const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // Up vector (0,1,0), at Y = 0
		
			// Get the intersection point of the ray and the plane
			const intersectionPoint = new THREE.Vector3();
			const intersects = this.raycaster.ray.intersectPlane(plane, intersectionPoint);
				
			// Check if the intersection is valid (not null and no NaN values)
			if (intersects && !isNaN(intersectionPoint.x) && !isNaN(intersectionPoint.z)) {
				console.log(intersectionPoint.x, intersectionPoint.z); // Log valid coordinates

				if (this.isInSceneBorders(intersectionPoint.x, intersectionPoint.z)) {
					// Move player to the calculated position
					this.entityEngine.movePlayer(intersectionPoint.x, intersectionPoint.z);
				}
			} else {
				// Handle the case where no valid intersection occurs (e.g., parallel ray)
				console.warn("No valid intersection or ray is parallel to the XZ plane.");
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

	public renderEntity(entity: Unit): void {
		this.renderMesh(entity.getMesh());
	}

	public renderMesh(mesh: THREE.Mesh): void {
		this.scene.add(mesh);
	}

	public onReady(callback: () => void): void {
		this.on('ready', callback);
	}

	private async loadModels(): Promise<void> {
		const loader = new GLTFLoader();
		const modelsToLoad = {
			player: 'src/assets/models/Skeleton Rogue.glb',
			enemy: 'src/assets/models/Skeleton Minion.glb',
			bft1: 'src/assets/models/Floor Dirt Small.glb',
			gravestone1: 'src/assets/models/Gravestone.glb',
			grave1: 'src/assets/models/Grave-1.glb',
			tree1: 'src/assets/models/Dead tree.glb',
		};

		// Load all models
		Promise.allSettled(Object.entries(modelsToLoad).map(async ([name, path]) => {
			this.models[name] = await loader.loadAsync(path);
		})).then(() => {
			this.emit('ready');
		});
	}

	private animate(time: DOMHighResTimeStamp): void {
		const delta = this.clock.getDelta();

		this.entityEngine.getEntities().forEach(entity => {
			(entity as Unit).updateAnimation(delta);
		});

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

	public getSceneBorders(): Record<string, number> {
		return this.sceneBorders;
	}

	public isInSceneBorders(x: number, y: number): boolean {
		return x >= this.sceneBorders.minX && x <= this.sceneBorders.maxX && y >= this.sceneBorders.minY && y <= this.sceneBorders.maxY;
	}
}