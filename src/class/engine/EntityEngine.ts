import type Entity from "../entity/Entity";
import Engine from "./Engine";
import type RenderEngine from "./RenderEngine";
import Player from "../entity/Player";

export default class EntityEngine extends Engine {
	private entities: Entity[] = [];
	private renderEngine!: RenderEngine;
	
	public override start(): void {
		this.renderEngine = this.container.resolve('renderEngine');
		console.log('Entity Engine started');
	}

	public addEntity(entity: Entity): void {
		this.entities.push(entity);

		entity.create();
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
		this.renderEngine.renderEntity(entity);
	}

	public getPlayer(): Player {
		return this.entities.find(entity => entity instanceof Player) as Player;
	}

	public movePlayer(x: number, y: number): void {
		console.log(`Moving player to ${x}, ${y}`);

		this.getPlayer().startMove(x, y);
	}
}