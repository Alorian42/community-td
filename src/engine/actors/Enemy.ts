import type Game from '../Game';
import Actor from './Actor';

export default class Enemy extends Actor {
	constructor() {
		super('Enemy', 300, 300, 100, 100);
	}

	public onInitialize(engine: Game): void {
		super.onInitialize(engine);

		this.on('pointerup', () => {
			console.log('yo');
		});
	}
}
