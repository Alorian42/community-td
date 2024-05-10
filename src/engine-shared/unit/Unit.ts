import EventSystem from '../utils/EventSystem';
import { type Vector2D } from '../utils/VectorUtils';

export const UnitEvents = {
	DEATH: 'DEATH',
	HEALTH_CHANGE: 'HEALTH_CHANGE',
} as const;
export type UnitEvent = (typeof UnitEvents)[keyof typeof UnitEvents];

export default class Unit extends EventSystem {
	public name: string;
	public currentHealth: number;
	public maxHealth: number;
	public pos: Vector2D;

	protected subscribers = new Map<UnitEvent, Array<() => void>>();

	constructor(name: string, health: number, pos: Vector2D) {
		super();

		this.name = name;
		this.currentHealth = health;
		this.maxHealth = health;
		this.pos = pos;
	}

	public takeDamage(damage: number): void {
		this.currentHealth = Math.max(0, this.currentHealth - damage);

		this.onTakeDamage();

		if (this.currentHealth === 0) {
			this.die();
		}
	}

	protected die(): void {
		this.publish(UnitEvents.DEATH);
		console.log(`${this.name} died`);
	}

	protected onTakeDamage(): void {
		this.publish(UnitEvents.HEALTH_CHANGE);
	}

	public on(event: UnitEvent, callback: () => void): void {
		super.on(event, callback);
	}

	public publish(event: UnitEvent): void {
		super.publish(event);
	}
}
