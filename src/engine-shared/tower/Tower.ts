import Unit, { UnitEvents } from '../unit/Unit';

interface TowerProperties {
	damage: {
		min: number;
		max: number;
	};
	range: number;
	attackSpeed: number;
}

export default abstract class Tower extends Unit {
	protected properties: TowerProperties;

	protected canAttack: boolean = true;

	protected target?: Unit;

	constructor(name: string, x: number, y: number, properties: TowerProperties) {
		super(name, 100, { x, y });
		this.properties = properties;
	}

	public getName(): string {
		return this.name;
	}

	public getProperty(property: keyof TowerProperties): TowerProperties[keyof TowerProperties] {
		return this.properties[property];
	}

	public getRange(): number {
		return this.getProperty('range') as number;
	}

	public rollDamage(): number {
		return (
			Math.floor(Math.random() * (this.properties.damage.max - this.properties.damage.min + 1)) +
			this.properties.damage.min
		);
	}

	public startAttack(target: Unit): void {
		this.target = target;
		this.publish(UnitEvents.ATTACK);
		this.afterAttack();
	}

	public canAttackNow(): boolean {
		return this.canAttack;
	}

	public afterAttack(): void {
		this.canAttack = false;
		setTimeout(() => {
			this.canAttack = true;
		}, 1000 / this.properties.attackSpeed);
	}

	public getTarget(): Unit | undefined {
		return this.target;
	}

	public clearTarget(): void {
		this.target = undefined;

		this.clearParticlesTarget();
	}

	public clearParticlesTarget(): void {
		this.publish(UnitEvents.CLEAR_PARTICLES_TARGET);
	}
}
