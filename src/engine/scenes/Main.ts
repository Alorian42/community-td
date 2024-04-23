import Scene from './Scene';

export default class MainScene extends Scene {
	constructor() {
		super('MainScene');
	}

	public onInitialize(): void {
		console.log('MainScene initialized');
	}
}
