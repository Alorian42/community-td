import { ParticleEvents } from '../../../engine-shared/particles/Particle';
import Particle from '../../../engine-shared/particles/TowerParticle';
import Unit from '../../../engine-shared/unit/Unit';
import type Game from '../../Game';
import Actor from '../Actor';

export default class TowerParticle extends Actor {
	protected particle: Particle;

	constructor(x: number, y: number, target: Unit) {
		super('Shot', x, y, 25, 25, {
			showName: false,
			showHealth: false,
		});

		this.unit = new Unit('Shot', 1, { x, y });
		this.particle = new Particle(target);
		this.speed = this.particle.getSpeed();
	}

	public getParticle(): Particle {
		return this.particle;
	}

	public getTarget(): Unit | null {
		return this.particle.getTarget();
	}

	public clearTarget(): void {
		this.particle.clearTarget();
	}

	public update(engine: Game, delta: number): void {
		super.update(engine, delta);

		if (!this.targetPos) {
			console.log(this.id, 'Particle finished INSIDE');
			this.particle.publish(ParticleEvents.FINISHED);
		}
	}
}
