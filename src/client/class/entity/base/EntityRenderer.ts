import type Entity from '@/shared/class/entity/base/Entity';
import type Unit from './Unit';
import { container } from 'tsyringe';
import { LoopRepeat, Mesh, Object3D, PlaneGeometry, ShaderMaterial } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

export default abstract class EntityRenderer<E extends Entity = Entity> {
	protected entity: E;
	protected unit: Unit;
	protected hpBar: Mesh | null = null;
	protected showHpBar: boolean = true;
	protected animations = new Map<string, string>();
	protected modelName: string = '';
	protected scale: number = 1;

	constructor(entity: E, unit: Unit) {
		this.entity = entity;
		this.unit = unit;

		this.entity.on('startMove', (args: { x: number; y: number }) => {
			const { x: currentX, y: currentY } = this.entity.getPosition();

			this.unit.startMove(args.x, args.y, currentX, currentY);
		});

		this.entity.on('move', () => {
			const { x, y } = this.entity.getPosition();

			this.unit.move(x, y);
		});

		this.entity.on('stopMove', () => {
			this.unit.stopMove();
		});
	}

	protected abstract setupAnimations(): void;

	public getEntity(): E {
		return this.entity;
	}

	public getUnit(): Unit {
		return this.unit;
	}

	get created(): boolean {
		return this.unit.isCreated() && this.entity.isCreated();
	}

	public create(): void {
		this.setupAnimations();
		this.init();

		this.unit.create();
		this.entity.create();
	}

	public destroy(): void {
		this.unit.destroy();
		this.entity.destroy();
	}

	protected init(): void {
		const renderEngine = container.resolve('renderEngine') as any;
		const model = renderEngine.getModel(this.modelName);
		const mesh = clone(model.scene) as any;
		const position = this.entity.getPosition();

		mesh.scale.set(this.scale, this.scale, this.scale);
		mesh.position.set(position.x, 0, position.y);

		this.animations.forEach((animation, name) => {
			this.unit.setAnimation(
				name,
				model.animations.find((a: any) => a.name === animation),
				LoopRepeat
			);
		});

		this.addLifeBar(mesh);

		this.entity.on('damageReceived', (hpPercent: number) => {
			this.updateHPBar(hpPercent);

			console.log('Damage received', hpPercent);
		});

		this.unit.setMesh(mesh);
	}

	public updateHPBar(hpPercent: number): void {
		if (!this.hpBar) {
			return;
		}

		const material = this.hpBar.material as ShaderMaterial;
		material.uniforms.hpPercent.value = hpPercent / 100;
	}

	protected addLifeBar(mesh: Object3D): void {
		if (!this.showHpBar) {
			return;
		}

		const barWidth = 2;
		const barHeight = 0.2;

		const geometry = new PlaneGeometry(barWidth, barHeight);
		const material = this.createHPBarMaterial();

		const hpBar = new Mesh(geometry, material);
		hpBar.position.set(0, 3, 0);

		// Ensure the HP bar always faces the camera
		hpBar.userData.isHPBar = true;
		mesh.add(hpBar);

		this.hpBar = hpBar;
	}

	protected createHPBarMaterial(): ShaderMaterial {
		return new ShaderMaterial({
			uniforms: {
				hpPercent: { value: 1.0 },
			},
			vertexShader: `
				varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}`,
			fragmentShader: `
				uniform float hpPercent;
				varying vec2 vUv;
				void main() {
					vec4 grayColor = vec4(0.5, 0.5, 0.5, 1.0); // Gray color
					vec4 greenColor = vec4(0.0, 1.0, 0.0, 1.0);      // Green color
	
					// If the fragment's x coordinate is less than hpPercent, use green; else gray
					if (vUv.x <= hpPercent) {
						gl_FragColor = greenColor;
					} else {
						gl_FragColor = grayColor;
					}
				}`,
			transparent: true,
			depthTest: false,
		});
	}
}
