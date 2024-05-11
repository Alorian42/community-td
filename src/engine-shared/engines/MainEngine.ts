import type Tower from '../tower/Tower';
import type Unit from '../unit/Unit';
import CombatEngine from './CombatEngine';
import Engine from './Engine';
import ResourcesEngine, { type IResources } from './ResourcesEngine';

export default class MainEngine extends Engine {
	protected engines: Engine[] = [];
	protected mainInterval: number = 0;

	constructor() {
		super('MainEngine');

		this.engines.push(new CombatEngine());
		this.engines.push(new ResourcesEngine());
	}

	public start(): void {
		console.log('Main Engine started');

		this.engines.forEach(engine => {
			engine.start();
			console.log(`Engine ${engine.name} started`);
		});

		console.log('All engines started');

		this.mainInterval = window.setInterval(() => {
			this.loop();
		}, 1000 / 30);
	}

	public loop(): void {
		this.engines.forEach(engine => {
			engine.loop();
		});
	}

	public registerTower(tower: Tower): void {
		this.getCombatEngine().registerTower(tower);
		this.getResourcesEngine().awardResources(tower);
	}

	public registerEnemy(enemy: Unit): void {
		this.getCombatEngine().registerEnemy(enemy);
	}

	public awardResources(unit?: Unit): void {
		this.getResourcesEngine().awardResources(unit);
	}

	public subscribeToResourceAward(
		callback: ({ delta, total }: { delta: IResources; total: IResources }) => void
	): void {
		this.getResourcesEngine().on('resourceAwarded', callback);
	}

	public getCurrentResources(): IResources {
		return this.getResourcesEngine().getCurrentResources();
	}

	protected getCombatEngine(): CombatEngine {
		return this.engines.find(engine => engine.name === 'CombatEngine') as CombatEngine;
	}

	protected getResourcesEngine(): ResourcesEngine {
		return this.engines.find(engine => engine.name === 'ResourcesEngine') as ResourcesEngine;
	}
}
