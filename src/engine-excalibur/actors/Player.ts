import Hero from '../../engine-shared/unit/Unit';
import type Game from '../Game';
import Actor from './Actor';

export default class Player extends Actor {
	constructor() {
		super('Sword', 150, 150, 100, 100, 100);

		this.speed = 200;
		this.unit = new Hero('Sword', 100);

		this.initLabels();
	}

	public onInitialize(engine: Game): void {
		super.onInitialize(engine);
	}
}
