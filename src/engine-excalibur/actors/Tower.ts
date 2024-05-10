import BasicTower from '../../engine-shared/tower/BasicTower';
import type TowerClass from '../../engine-shared/tower/Tower';
import type Game from '../Game';
import Actor from './Actor';

export default class Tower extends Actor {
	protected unit: TowerClass;

	constructor(x: number, y: number) {
		super('BasicTower', x, y, 100, 100, {
			showName: true,
			showHealth: false,
		});

		this.unit = new BasicTower(x, y);

		this.initLabels();
	}

	public onInitialize(engine: Game): void {
		super.onInitialize(engine);

		this.on('pointerup', () => {
			console.log('yo');
		});
	}

	public getUnit(): TowerClass {
		return this.unit;
	}
}
