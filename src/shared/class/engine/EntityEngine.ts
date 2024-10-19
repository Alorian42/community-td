import type Entity from '@shared/class/entity/base/Entity';
import Engine from './Engine';
import Player from '@shared/class/entity/Player';
import type EnemyEngine from './EnemyEngine';
import Enemy from '../entity/Enemy';

export default class EntityEngine extends Engine {
	private enemyEngine!: EnemyEngine;
	private entities: Entity[] = [];
	protected handleCreate = true;

	public override start(): void {
		this.enemyEngine = this.container.resolve('enemyEngine');
		console.log('Entity Engine started');
	}

	public addEntity(entity: Entity): void {
		this.entities.push(entity);

		if (this.handleCreate) {
			entity.create();
		}
	}

	public removeEntity(entity: Entity): void {
		const index = this.entities.indexOf(entity);

		if (index > -1) {
			this.entities.splice(index, 1);
		}

		entity.destroy();
	}

	public getEntities(): Entity[] {
		return this.entities;
	}

	public spawnEntity(entity: Entity): void {
		this.addEntity(entity);

		if (entity instanceof Enemy) {
			this.enemyEngine.handleEnemySpawn(entity);
		}
	}

	public getPlayer(): Player {
		return this.entities.find(entity => entity instanceof Player) as Player;
	}

	public movePlayer(x: number, y: number): void {
		console.log(`Moving player to ${x}, ${y}`);

		this.getPlayer().startMove(x, y);
	}
}
