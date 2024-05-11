import Tower from './Tower';

export default class BasicTower extends Tower {
	public static foodCost: number = 10;
	public static woodCost: number = 100;
	public static goldCost: number = 100;

	constructor(x: number, y: number) {
		super('Basic Tower', x, y, {
			damage: {
				min: 10,
				max: 20,
			},
			range: 200,
			attackSpeed: 1,
		});
	}
}
