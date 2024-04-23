import type Game from '../Game';
import Actor from './Actor';

export default class Player extends Actor {
	constructor() {
		super('Sword', 150, 150, 100, 100);

		this.speed = 100;
	}

	public onInitialize(engine: Game): void {
		super.onInitialize(engine);

		this.on('pointerup', () => {
			console.log('yo');
		});
	}
}
