import map from '@shared/assets/maps/map0.json';

export default class MapUtils {
	private static lastId = 0;
	private static enemyRouteCache: Set<string> = new Set();

	public static sceneBorders: {
		minX: number;
		maxX: number;
		minY: number;
		maxY: number;
	} = {
		minX: map.boundingBox.min.x,
		maxX: map.boundingBox.max.x,
		minY: map.boundingBox.min.y,
		maxY: map.boundingBox.max.y,
	};

	public static isInSceneBorders(x: number, y: number): boolean {
		return (
			x > this.sceneBorders.minX &&
			x < this.sceneBorders.maxX &&
			y > this.sceneBorders.minY &&
			y < this.sceneBorders.maxY
		);
	}

	public static isInSceneBordersGrid(x: number, y: number): boolean {
		const { x: mapX, y: mapY } = this.fromGridToMap(x, y);
		return this.isInSceneBorders(mapX, mapY);
	}

	public static fromMapToGrid(x: number, y: number): { x: number; y: number } {
		const tileSize = map.tileSize;
		const gridX = Math.floor((x + tileSize / 2) / tileSize);
		const gridY = Math.floor((y + tileSize / 2) / tileSize);

		return { x: gridX, y: gridY };
	}
	public static fromGridToMap(gridX: number, gridY: number): { x: number; y: number } {
		const tileSize = map.tileSize;
		const x = gridX * tileSize;
		const y = gridY * tileSize;

		return { x, y };
	}

	public static getNextId(): number {
		return ++this.lastId;
	}

	public static isInEnemyRoute(x: number, y: number): boolean {
		if (this.enemyRouteCache.size === 0) {
			this.buildEnemyRouteCache();
		}

		return this.enemyRouteCache.has(`${x},${y}`);
	}

	private static buildEnemyRouteCache(): void {
		this.enemyRouteCache.clear();

		for (let i = 0; i < map.enemyRoute.length - 1; i++) {
			const current = map.enemyRoute[i];
			const next = map.enemyRoute[i + 1];

			const [currentX, currentY] = current.split(',').map(Number);
			const [nextX, nextY] = next.split(',').map(Number);

			if (currentX === nextX) {
				for (let y = Math.min(currentY, nextY); y <= Math.max(currentY, nextY); y++) {
					this.enemyRouteCache.add(`${currentX},${y}`);
				}
			} else {
				for (let x = Math.min(currentX, nextX); x <= Math.max(currentX, nextX); x++) {
					this.enemyRouteCache.add(`${x},${currentY}`);
				}
			}
		}
	}
}
