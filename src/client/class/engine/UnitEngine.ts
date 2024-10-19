import EntityEngine from '@shared/class/engine/EntityEngine';
import type RenderEngine from './RenderEngine';
import type EntityRenderer from '../entity/base/EntityRenderer';

export default class UnitEngine extends EntityEngine {
	private renderEngine!: RenderEngine;
	private units: EntityRenderer[] = [];

	constructor() {
		super();

		this.handleCreateOrDestroy = false;
	}

	public override start(): void {
		super.start();

		this.renderEngine = this.container.resolve('renderEngine');
		console.log('Unit Engine started');
	}

	public spawnUnit(entity: EntityRenderer): void {
		this.addUnit(entity);
		this.spawnEntity(entity.getEntity());

		this.renderEngine.renderEntity(entity);
	}

	public addUnit(entity: EntityRenderer): void {
		this.units.push(entity);

		entity.create();
	}

	public removeUnit(entity: EntityRenderer): void {
		const index = this.units.indexOf(entity);

		if (index > -1) {
			this.units.splice(index, 1);
		}

		entity.destroy();
	}

	public getUnits(): EntityRenderer[] {
		return this.units;
	}
}
