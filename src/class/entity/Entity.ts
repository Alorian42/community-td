import type { Mesh } from 'three';

export default abstract class Entity {
	protected mesh!: Mesh;
	protected created: boolean = false;
	protected speed = 0;
	protected currentSpeed: {
		x: number;
		y: number;
	} = {
		x: 0,
		y: 0
	};
	protected currentPosition: {
		x: number;
		y: number;
	} = {
		x: 0,
		y: 0
	};
	protected targetPosition: {
		x: number;
		y: number;
	} = {
		x: 0,
		y: 0
	};

	constructor(protected x: number, protected y: number) {}

	public abstract create(): void;
	public getMesh(): Mesh {
		if (!this.created) {
			this.create();
		}

		return this.mesh;
	}

	public startMove(x: number, y: number): void {
		this.targetPosition.x = x;
		this.targetPosition.y = y;

		const distance = Math.sqrt((x - this.currentPosition.x) * (x - this.currentPosition.x) + (y - this.currentPosition.y) * (y - this.currentPosition.y));
		const time = distance / this.speed;
		const speedX = (x - this.currentPosition.x) / time;
		const speedY = (y - this.currentPosition.y) / time;
		
		this.currentSpeed.x = speedX;
		this.currentSpeed.y = speedY;
	}

	public move(factor: number): void {
		this.currentPosition.x += this.currentSpeed.x * factor;
		this.currentPosition.y += this.currentSpeed.y * factor;

		this.mesh.position.set(this.currentPosition.x, 0, this.currentPosition.y);

		console.log(`Moving to ${this.currentPosition.x} (${this.targetPosition.x}), ${this.currentPosition.y} (${this.targetPosition.y})`);

		if (Math.abs(this.currentPosition.x - this.targetPosition.x) < 1 && Math.abs(this.currentPosition.y - this.targetPosition.y) < 1) {
			this.currentSpeed.x = 0;
			this.currentSpeed.y = 0;
		}
	}
}