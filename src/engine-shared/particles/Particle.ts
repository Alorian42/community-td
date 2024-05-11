import type Unit from '../unit/Unit';
import EventSystem from '../utils/EventSystem';

export const ParticleEvents = {
	FINISHED: 'FINISHED',
} as const;
export type ParticleEvent = (typeof ParticleEvents)[keyof typeof ParticleEvents];

export default abstract class Particle extends EventSystem {
	protected readonly speed: number;
	protected target: Unit | null = null;

	constructor(speed: number, target: Unit) {
		super();

		this.speed = speed;
		this.target = target;
	}

	public getSpeed(): number {
		return this.speed;
	}

	public on(event: ParticleEvent, callback: () => void, oneTime?: boolean): number {
		return super.on(event, callback, oneTime);
	}

	public publish(event: ParticleEvent): void {
		super.publish(event);
	}

	public getTarget(): Unit | null {
		return this.target;
	}

	public clearTarget(): void {
		this.target = null;
	}
}
