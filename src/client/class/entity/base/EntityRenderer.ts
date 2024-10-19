import type Entity from '@/shared/class/entity/base/Entity';
import type Unit from './Unit';

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

		this.entity.on('move',() => {
			const { x, y } = this.entity.getPosition();

			this.unit.move(x, y, this.entity.closeToTarget());
		})
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
}
