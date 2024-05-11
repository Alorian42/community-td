import EventSystem from '../utils/EventSystem';
import { type Vector2D } from '../utils/VectorUtils';

export const UnitEvents = {
	DEATH: 'DEATH',
	HEALTH_CHANGE: 'HEALTH_CHANGE',
	ATTACK: 'ATTACK',
	ATTACK_LANDED: 'ATTACK_LANDED',
	CLEAR_PARTICLES_TARGET: 'CLEAR_PARTICLES_TARGET',
} as const;
export type UnitEvent = (typeof UnitEvents)[keyof typeof UnitEvents];

export default class Unit extends EventSystem {
	public name: string;
	public currentHealth: number;
	public maxHealth: number;
	public pos: Vector2D;
	public id: string;

	protected subscribers = new Map<UnitEvent, Map<number, () => void>>();

	constructor(name: string, health: number, pos: Vector2D) {
		super();

		this.name = name;
		this.currentHealth = health;
		this.maxHealth = health;
		this.pos = pos;
		this.id = Math.random().toString(36).substr(2, 9);
	}

	public takeDamage(damage: number): boolean {
		if (this.currentHealth === 0) {
			return true;
		}

		this.currentHealth = Math.max(0, this.currentHealth - damage);

		this.onTakeDamage();

		if (this.currentHealth === 0) {
			this.die();

			return true;
		}

		return false;
	}

	protected die(): void {
		this.publish(UnitEvents.DEATH);
		console.log(`${this.name} died`);
	}

	protected onTakeDamage(): void {
		this.publish(UnitEvents.HEALTH_CHANGE);
	}

	public on(event: UnitEvent, callback: (...args: any) => void, oneTime?: boolean): number {
		return super.on(event, callback, oneTime);
	}

	public publish(event: UnitEvent, ...args: any): void {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		super.publish(event, ...args);
	}
}
