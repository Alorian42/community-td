import { ParticleEvents } from '../../engine-shared/particles/Particle';
import BasicTower from '../../engine-shared/tower/BasicTower';
import type TowerClass from '../../engine-shared/tower/Tower';
import { UnitEvents } from '../../engine-shared/unit/Unit';
import type Game from '../Game';
import Actor from './Actor';
import TowerParticle from './Particles/TowerParticle';

export default class Tower extends Actor {
	protected unit: TowerClass;
	protected particles: TowerParticle[] = [];

	constructor(x: number, y: number) {
		super('BasicTower', x, y, 100, 100, {
			showName: true,
			showHealth: false,
		});

		this.unit = new BasicTower(x, y);

		this.initLabels();
	}

	public onInitialize(engine: Game): void {
		super.onInitialize(engine);

		this.unit.on(UnitEvents.ATTACK, () => {
			const target = this.unit.getTarget();

			if (target) {
				const particle = new TowerParticle(this.pos.x, this.pos.y, target);
				particle.moveTo(target.pos.x, target.pos.y);

				engine.add(particle);
				this.particles.push(particle);

				particle.getParticle().on(
					ParticleEvents.FINISHED,
					() => {
						const possibleTarget = particle.getTarget();

						if (possibleTarget) {
							this.unit.publish(UnitEvents.ATTACK_LANDED, possibleTarget);
						}

						engine.remove(particle);
						this.particles = this.particles.filter(p => p !== particle);
					},
					true
				);
			}
		});

		this.unit.on(UnitEvents.CLEAR_PARTICLES_TARGET, () => {
			this.particles.forEach(particle => {
				particle.clearTarget();
			});
		});
	}

	public update(engine: Game, delta: number): void {
		super.update(engine, delta);

		this.particles.forEach(particle => {
			const target = particle.getTarget();

			if (target) {
				particle.moveTo(target.pos.x, target.pos.y);
			}
		});
	}

	public getUnit(): TowerClass {
		return this.unit;
	}

	public getFoodCost(): number {
		return this.unit.getFoodCost();
	}
}
