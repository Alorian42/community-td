import map from '@shared/assets/maps/map0.json';

export default class MapUtils {
	private static lastId = 0;

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

	public static fromMapToGrid(x: number, y: number): { x: number; y: number } {
		const tileSize = map.tileSize;
		const gridX = Math.floor((x + tileSize / 2) / tileSize);
		const gridY = Math.floor((y + tileSize / 2) / tileSize);

		return { x: gridX, y: gridY };
	}
	public static fromGridToMap(gridX: number, gridY: number): { x: number; y: number } {
		const tileSize = map.tileSize; // Ensure that 'map' is accessible in this scope
		const x = gridX * tileSize;
		const y = gridY * tileSize;

		return { x, y };
	}

	public static getNextId(): number {
		return ++this.lastId;
	}
}
