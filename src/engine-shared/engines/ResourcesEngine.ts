import Tower from '../tower/Tower';
import Unit from '../unit/Unit';
import Engine from './Engine';

export interface IResources {
	gold: number;
	wood: number;
	food: number;
	maxFood: number;
}

export default class ResourcesEngine extends Engine {
	protected gold: number = 100;
	protected wood: number = 100;
	protected food: number = 0;
	protected maxFood: number = 0;

	constructor() {
		super('ResourcesEngine');

		this.maxFood = 100;
	}

	public start(): void {
		// implementation for the 'start' method
	}

	public loop(): void {
		// implementation for the 'loop' method
	}

	public awardResources(unit?: Unit): void {
		if (unit instanceof Tower) {
			const food = unit.getFoodCost();
			const gold = unit.getGoldCost();
			const wood = unit.getWoodCost();

			this.food += food;
			this.gold -= gold;
			this.wood -= wood;

			this.publish('resourceAwarded', {
				delta: { gold: -gold, wood: -wood, food, maxFood: 0 },
				total: { gold: this.gold, wood: this.wood, food: this.food, maxFood: this.maxFood },
			});
		} else if (unit instanceof Unit) {
			const gold = Math.floor(Math.random() * 100);
			const wood = Math.floor(Math.random() * 100);
			const food = 0;
			const maxFood = 0;

			this.gold += gold;
			this.wood += wood;
			this.food += food;
			this.maxFood += maxFood;

			this.publish('resourceAwarded', {
				delta: { gold, wood, food, maxFood },
				total: { gold: this.gold, wood: this.wood, food: this.food, maxFood: this.maxFood },
			});
		} else {
			this.publish('resourceAwarded', {
				delta: { gold: 0, wood: 0, food: 0, maxFood: 0 },
				total: { gold: this.gold, wood: this.wood, food: this.food, maxFood: this.maxFood },
			});
		}
	}

	public getCurrentResources(): IResources {
		return {
			gold: this.gold,
			wood: this.wood,
			food: this.food,
			maxFood: this.maxFood,
		};
	}
}
