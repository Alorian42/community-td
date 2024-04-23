import { Scene as ExScene } from 'excalibur';

export default abstract class Scene extends ExScene {
	constructor(private readonly name: string) {
		super();
	}

	public getName(): string {
		return this.name;
	}
}
