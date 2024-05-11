export interface Vector2D {
	x: number;
	y: number;
}

export default class VectorUtils {
	public static isInRange(baseVector: Vector2D, targetVector: Vector2D, range: number): boolean {
		const distance = VectorUtils.distance(baseVector, targetVector);

		return distance <= range;
	}

	public static distance(baseVector: Vector2D, targetVector: Vector2D): number {
		const x = targetVector.x - baseVector.x;
		const y = targetVector.y - baseVector.y;

		return Math.sqrt(x * x + y * y);
	}
}
