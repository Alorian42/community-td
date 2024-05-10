export interface Vector2D {
	x: number;
	y: number;
}

export default class VectorUtils {
	public static isInRange(baseVector: Vector2D, targetVector: Vector2D, range: number): boolean {
		const dx = baseVector.x - targetVector.x;
		const dy = baseVector.y - targetVector.y;

		return dx * dx + dy * dy <= range * range;
	}
}
