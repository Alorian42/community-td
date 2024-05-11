import type Tower from '../tower/Tower';
import type Unit from '../unit/Unit';
import { UnitEvents } from '../unit/Unit';
import VectorUtils from '../utils/VectorUtils';
import Engine from './Engine';

export default class CombatEngine extends Engine {
	protected isEnabled: boolean = false;
	protected towers: Tower[] = [];
	protected enemies: Unit[] = [];

	constructor() {
		super('CombatEngine');
	}

	public start(): void {
		this.isEnabled = true;
	}

	public toggle(forceEnable: boolean = false): void {
		this.isEnabled = forceEnable ? true : !this.isEnabled;
		console.log(`Combat Engine is ${this.isEnabled ? 'enabled' : 'disabled'}`);
	}

	public loop(): void {
		if (!this.isEnabled) {
			return;
		}

		this.getActiveTowers().forEach(tower => {
			const enemiesInRange = this.getEnemiesInRange(tower);

			if (enemiesInRange.length > 0) {
				this.doAttack(tower, enemiesInRange[0]);
			}
		});
	}

	protected getActiveTowers(): Tower[] {
		return this.towers.filter(tower => tower.canAttackNow());
	}

	protected getAliveEnemies(): Unit[] {
		return this.enemies.filter(enemy => enemy.currentHealth > 0);
	}

	protected getEnemiesInRange(tower: Tower): Unit[] {
		return this.getAliveEnemies().filter(enemy =>
			VectorUtils.isInRange(tower.pos, enemy.pos, tower.getRange())
		);
	}

	public registerTower(tower: Tower): void {
		this.towers.push(tower);

		tower.on(UnitEvents.ATTACK_LANDED, (target: Unit) => {
			this.dealDamage(tower, target);
		});
	}

	public registerEnemy(enemy: Unit): void {
		this.enemies.push(enemy);
	}

	protected doAttack(tower: Tower, enemy: Unit): void {
		tower.startAttack(enemy);
	}

	protected dealDamage(tower: Tower, enemy: Unit): void {
		const damage = tower.rollDamage();

		const isDead = enemy.takeDamage(damage);

		if (isDead) {
			tower.clearTarget();
		}
	}
}
