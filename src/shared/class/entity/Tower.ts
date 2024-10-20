import Entity from './base/Entity';

export default class Tower extends Entity {
	protected range = 25;
	protected attackSpeed = 0.5; // cooldown between attacks
	protected baseAttackDamage = 5;
	protected projectileSpeed = 25;

	public override create(): void {
		super.create();
		this.maxLife = 1;
		this.speed = 1;
	}
}
