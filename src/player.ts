import { Actor, vec } from 'excalibur';
import { Resources } from './resources';

export default class Player extends Actor {
	constructor() {
		super({
			pos: vec(150, 150),
			width: 100,
			height: 100,
		});
	}

	public onInitialize(): void {
		this.graphics.add(Resources.Sword.toSprite());
		this.on('pointerup', () => {
			console.log('yo');
		});
	}
}
