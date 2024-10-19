import * as THREE from 'three';
import map from '@shared/assets/maps/map0.json';
import Engine from '@shared/class/engine/Engine';
import type RenderEngine from './RenderEngine';
import MapUtils from '@/shared/class/utils/Map';

export default class BackgroundEngine extends Engine {
	private renderEngine!: RenderEngine;

	public start(): void {
		this.renderEngine = this.container.resolve('renderEngine');

		this.renderEngine.onReady(() => {
			this.initBackground();
		});

		console.log('Background engine started.');
	}

	public initBackground(): void {
		const tileSize = map.tileSize;
		const scale = (tileSize / 2) * 100;
		const { floorGrid, objects } = map;
		const instances = new Map<string, THREE.Vector3[]>();

		this.processEntries(floorGrid, instances, true);
		this.processEntries(objects, instances);

		for (const [modelName, positions] of instances) {
			const model = this.renderEngine.getModel(modelName).scene;

			// Extract geometry and material (assuming a single mesh)
			let geometry: THREE.BufferGeometry | null = null;
			let material: THREE.Material | THREE.Material[] | null = null;

			model.traverse((child: THREE.Mesh) => {
				if (child.isMesh) {
					geometry = child.geometry;
					material = child.material;
				}
			});

			if (!geometry || !material) {
				console.error(`No mesh found in model ${modelName}`);
				continue;
			}

			const instancedMesh = new THREE.InstancedMesh(geometry, material, positions.length);
			const dummy = new THREE.Object3D();

			positions.forEach((position: THREE.Vector3, index: number) => {
				dummy.position.set(position.x, position.z, position.y);
				dummy.scale.set(scale, scale, scale);
				dummy.updateMatrix();
				instancedMesh.setMatrixAt(index, dummy.matrix);
			});

			this.renderEngine.renderMesh(instancedMesh);
		}
	}

	private processEntries(
		entries: Record<string, string>,
		instances: Map<string, THREE.Vector3[]> = new Map(),
		grid: boolean = false
	): Map<string, THREE.Vector3[]> {
		Object.entries(entries).forEach(([key, value]) => {
			if (!instances.has(value)) {
				instances.set(value, []);
			}
			const [x, y, z] = key.split(',').map(Number);
			if (!grid) {
				instances.get(value)?.push(new THREE.Vector3(x, y, z));
			} else {
				const { x: newX, y: newY } = MapUtils.fromGridToMap(x, y);
				instances.get(value)?.push(new THREE.Vector3(newX, newY, z));
			}
		});

		return instances;
	}
}
