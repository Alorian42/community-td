import map from '@shared/assets/maps/map0.json';

export default class MapUtils {
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
}
