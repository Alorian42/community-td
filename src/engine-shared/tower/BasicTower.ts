import Tower from './Tower';

export default class BasicTower extends Tower {
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
