import Engine from '@/shared/class/engine/Engine';
import type EntityEngine from '@/shared/class/engine/EntityEngine';
import Enemy from '../entity/Enemy';
import map from '@shared/assets/maps/map0.json';
import MapUtils from '../utils/Map';
export default class EnemyEngine extends Engine {
	private entityEngine!: EntityEngine;
	private steps: Map<number, number> = new Map<number, number>();

	public start(): void {
		this.entityEngine = this.container.resolve('entityEngine');

		console.log('Enemy engine started.');
	}

	public handleEnemySpawn(enemy: Enemy): void {
		enemy.on('stopMove', () => {
			const step = this.steps.get(enemy.getId()) ?? -1;
			const nextPosition = this.getNextPosition(step + 1);

			if (!nextPosition) {
				// @TODO HP minus
				this.entityEngine.removeEntity(enemy);
				this.steps.delete(enemy.getId());
				return;
			} else {
				enemy.startMove(nextPosition.x, nextPosition.y);
			}

			this.steps.set(enemy.getId(), step + 1);
		});

		this.steps.set(enemy.getId(), 0);

		const nextPosition = this.getNextPosition(0);
		if (!nextPosition) {
			return;
		}
		enemy.startMove(nextPosition.x, nextPosition.y);
	}

	private getNextPosition(index: number): { x: number; y: number } | null {
		if (!map.enemyRoute[index]) {
			return null;
		}

		const [gridX, gridY] = map.enemyRoute[index].split(',').map(Number);
		const { x, y } = MapUtils.fromGridToMap(gridX, gridY);

		return { x, y };
	}

	private getEnemies(): Enemy[] {
		return this.entityEngine.getEntities().filter(entity => entity instanceof Enemy) as Enemy[];
	}
}
