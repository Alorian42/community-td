import Entity from './base/Entity';

export default class Enemy extends Entity {
	public override create(): void {
		super.create();
		this.maxLife = 100;
		this.currentLife = this.maxLife;
		this.speed = 0.25;
	}
}
