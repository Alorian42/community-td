import Entity from './base/Entity';

export default class Enemy extends Entity {
	public override create(): void {
		this.maxLife = 100;
		this.speed = 1;
	}
}
