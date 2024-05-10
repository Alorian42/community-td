import Hero from '../../engine-shared/unit/Hero';
import type Game from '../Game';
import Actor from './Actor';

export default class Player extends Actor {
	constructor(x: number, y: number) {
		super('Sword', x, y, 100, 100, {
			showName: true,
			showHealth: false,
		});

		this.speed = 200;
		this.unit = new Hero('Sword', x, y);

		this.initLabels();
	}

	public onInitialize(engine: Game): void {
		super.onInitialize(engine);
	}
}
