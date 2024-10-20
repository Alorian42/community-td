import type Entity from '../entity/base/Entity';
import type Tower from '../entity/Tower';
import MathUtils from '../utils/Math';
import Engine from './Engine';
import type EntityEngine from './EntityEngine';
import type TowerEngine from './TowerEngine';

export default class CombatEngine extends Engine {
	private towerEngine!: TowerEngine;
	private entityEngine!: EntityEngine;

	public start(): void {
		console.log('Combat Engine started');

		this.towerEngine = this.container.resolve('towerEngine');
		this.entityEngine = this.container.resolve('entityEngine');
	}

	private makeAttack(tower: Tower, target: Entity): void {
		const damage = tower.getBaseAttackDamage();
		const targetPos = target.getPosition();

		tower.markAsNotReadyToAttack(targetPos);
		target.damageReceived(damage);
	}

	public attackLoop(): void {
		const towers = this.towerEngine.getReadyTowers();

		for (const tower of towers) {
			const target = this.findTarget(tower);

			if (target) {
				this.makeAttack(tower, target);
			}
		}
	}

	public findTarget(tower: Tower): Entity | undefined {
		const enemies = this.entityEngine.getEnemies();
		const towerPos = tower.getPosition();
		const range = tower.getRange();
		let target: Entity | undefined;

		for (const enemy of enemies) {
			const enemyPos = enemy.getPosition();
			const distance = MathUtils.getDistance(towerPos.x, towerPos.y, enemyPos.x, enemyPos.y);

			if (distance <= range) {
				target = enemy;

				break;
			}
		}

		return target;
	}
}
