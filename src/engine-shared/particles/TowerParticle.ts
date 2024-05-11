import type Unit from '../unit/Unit';
import Particle from './Particle';

export default class TowerParticle extends Particle {
	constructor(target: Unit) {
		super(100, target);
	}
}
