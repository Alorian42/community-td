
import { container } from "tsyringe";
import type Entity from "../entity/Entity";
import Engine from "./Engine";
import type RenderEngine from "./RenderEngine";

export default class EntityEngine extends Engine {
	private entities: Entity[] = [];
	private renderEngine!: RenderEngine;
	
	public override start(): void {
		this.renderEngine = container.resolve('renderEngine');
		console.log('Entity Engine started');
	}

	public addEntity(entity: Entity): void {
		this.entities.push(entity);

		entity.create();
	}

	public getEntities(): Entity[] {
		return this.entities;
	}

	public spawnEntity(entity: Entity): void {
		this.addEntity(entity);
		this.renderEngine.renderEntity(entity);
	}
}