import Unit from '../../engine-shared/unit/Unit';
import type Game from '../Game';
import Actor from './Actor';

export default class Enemy extends Actor {
	constructor(x: number, y: number) {
		super('Enemy', x, y, 100, 100, {
			showName: true,
			showHealth: true,
		});

		this.speed = 200;
		this.unit = new Unit('Enemy', 50, { x, y });

		this.initLabels();
	}

	public onInitialize(engine: Game): void {
		super.onInitialize(engine);

		this.on('pointerup', () => {
			console.log('yo');
		});
	}
}
