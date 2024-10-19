import Entity from './base/Entity';

export default class Player extends Entity {
	public override create(): void {
		this.maxLife = 1;
		this.speed = 1;
	}
}
