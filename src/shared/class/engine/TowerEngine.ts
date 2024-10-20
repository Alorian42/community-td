import Engine from '@shared/class/engine/Engine';
import Tower from '../entity/Tower';
import MapUtils from '../utils/Map';
export default class TowerEngine extends Engine {
	/**
	 * A map of all towers in the game.
	 * The key is coordinates on grid: x,y.
	 * Example: 'this.towers.set('0,0', tower);'
	 */
	protected towers: Map<string, Tower> = new Map();

	public start(): void {
		console.log('Tower engine started.');
	}

	public canBuild(x: number, y: number): boolean {
		return (
			!this.towers.has(`${x},${y}`) && !MapUtils.isInEnemyRoute(x, y) && MapUtils.isInSceneBordersGrid(x, y)
		);
	}

	public buildTower(x: number, y: number, tower: Tower): void {
		if (!this.canBuild(x, y)) {
			console.error('Cannot build tower here');
			return;
		}

		this.towers.set(`${x},${y}`, tower);
	}

	public getReadyTowers(): Tower[] {
		return Array.from(this.towers.values()).filter(tower => tower.canAttack());
	}
}
