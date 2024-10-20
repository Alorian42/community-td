import { Vector3 } from 'three';

export default class MathUtils {
	public static getDistance(x1: number, y1: number, x2: number, y2: number): number {
		const dx = x2 - x1;
		const dy = y2 - y1;
		return Math.sqrt(dx * dx + dy * dy);
	}

	public static findAngle(x: number, y: number, currentX: number, currentY: number): number {
		const direction = new Vector3();
		direction.subVectors(new Vector3(x, 0, y), new Vector3(currentX, 0, currentY));
		direction.normalize();

		return Math.atan2(direction.x, direction.z);
	}
}
