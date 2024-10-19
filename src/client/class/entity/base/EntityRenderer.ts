import type Entity from '@/shared/class/entity/base/Entity';
import type Unit from './Unit';
import { container } from 'tsyringe';
import { LoopRepeat } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

export default abstract class EntityRenderer<E extends Entity = Entity> {
	protected entity: E;
	protected unit: Unit;

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
		this.unit.create();
		this.entity.create();
	}

	public destroy(): void {
		this.unit.destroy();
		this.entity.destroy();
	}

	protected init(modelName: string, scale: number, animations: Map<string, string>): void {
		const renderEngine = container.resolve('renderEngine') as any;
		const model = renderEngine.getModel(modelName);
		const mesh = clone(model.scene) as any;
		const position = this.entity.getPosition();

		mesh.scale.set(scale, scale, scale);
		mesh.position.set(position.x, 0, position.y);

		animations.forEach((animation, name) => {
			this.unit.setAnimation(
				name,
				model.animations.find((a: any) => a.name === animation),
				LoopRepeat
			);
		});

		this.unit.setMesh(mesh);
	}
}
