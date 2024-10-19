import type Entity from '@shared/class/entity/base/Entity';
import Engine from './Engine';
import Player from '@shared/class/entity/Player';

export default class EntityEngine extends Engine {
	private entities: Entity[] = [];
	protected handleCreateOrDestroy = true;

	public override start(): void {
		console.log('Entity Engine started');
	}

	public addEntity(entity: Entity): void {
		this.entities.push(entity);

		if (this.handleCreateOrDestroy) {
			entity.create();
		}
	}

	public removeEntity(entity: Entity): void {
		const index = this.entities.indexOf(entity);

		if (index > -1) {
			this.entities.splice(index, 1);
		}

		if (this.handleCreateOrDestroy) {
			entity.destroy();
		}
	}

	public getEntities(): Entity[] {
		return this.entities;
	}

	public spawnEntity(entity: Entity): void {
		this.addEntity(entity);
	}

	public getPlayer(): Player {
		return this.entities.find(entity => entity instanceof Player) as Player;
	}

	public movePlayer(x: number, y: number): void {
		console.log(`Moving player to ${x}, ${y}`);

		this.getPlayer().startMove(x, y);
	}
}
