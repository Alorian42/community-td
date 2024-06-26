import { ScreenElement } from 'excalibur';
import type Game from '../Game';

export default class BuildButton extends ScreenElement {
	public onBuildModeEnter: () => void = () => {};

	constructor() {
		super({
			x: 50,
			y: 50,
		});
	}

	onInitialize(engine: Game): void {
		this.graphics.add('idle', engine.getSprite('BuildButton'));
		this.graphics.add('hover', engine.getSprite('BuildButton'));
		this.graphics.show('idle');
		this.on('pointerup', () => {
			this.onBuildModeEnter();
		});
		this.on('pointerenter', () => {
			this.graphics.show('hover');
		});
		this.on('pointerleave', () => {
			this.graphics.show('idle');
		});
	}
}
