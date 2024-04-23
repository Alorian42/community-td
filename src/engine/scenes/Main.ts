import { Color } from 'excalibur';
import ResourcesConfig from '../config/ResourcesConfig';
import Scene from './Scene';

export default class MainScene extends Scene {
	constructor() {
		super('MainScene');

		this.backgroundColor = Color.fromRGBString(ResourcesConfig.config.colors.defaultBackground);
	}

	public onInitialize(): void {
		console.log('MainScene initialized');
	}
}
