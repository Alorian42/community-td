import Entity from './base/Entity';

export default class Enemy extends Entity {
	public override create(): void {
		this.maxLife = 100;
		this.currentLife = this.maxLife;
		this.speed = 1;

		window.setTimeout(() => {
			this.damageReceived(50);
		}, 2000);
	}
}
