import Unit from '../../engine-shared/unit/Unit';
import type Game from '../Game';
import Actor from './Actor';

export default class Enemy extends Actor {
	constructor() {
		super('Enemy', 300, 300, 100, 100, 50);

		this.unit = new Unit('Enemy', 50);

		this.initLabels();
	}

	public onInitialize(engine: Game): void {
		super.onInitialize(engine);

		this.on('pointerup', () => {
			console.log('yo');
		});
	}
}
