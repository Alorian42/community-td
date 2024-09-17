import { type Mesh, AnimationMixer, Vector3 } from 'three';

export default abstract class Entity {
	protected mixer: AnimationMixer | null = null;
	protected animation: Record<string, any> = {};
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
	protected targetPosition: {
		x: number;
		y: number;
	} = {
		x: 0,
		y: 0
	};

	constructor(protected x: number, protected y: number) {}

	public create(): void {
		this.mixer = new AnimationMixer(this.mesh);
	}
	public getMesh(): Mesh {
		if (!this.created) {
			this.create();
			
		}

		return this.mesh;
	}

	public startMove(x: number, y: number): void {
		this.targetPosition.x = x;
		this.targetPosition.y = y;

		const distance = Math.sqrt((x - this.x) * (x - this.x) + (y - this.y) * (y - this.y));
		const time = distance / this.speed;
		const speedX = (x - this.x) / time;
		const speedY = (y - this.y) / time;

		const direction = new Vector3();
		direction.subVectors(
			new Vector3(x, 0, y),
			new Vector3(this.x, 0, this.y)
		); // Vector from current to target
		direction.normalize(); // Normalize the vector to get just the direction\
		const angle = Math.atan2(direction.x, direction.z);

		this.mesh.rotation.y = angle;
		
		this.currentSpeed.x = speedX;
		this.currentSpeed.y = speedY;

		this.playMoveAnimation();
	}

	public move(factor: number): void {
		if (this.currentSpeed.x === 0 && this.currentSpeed.y === 0) {
			return;
		}

		this.x += this.currentSpeed.x * factor;
		this.y += this.currentSpeed.y * factor;

		this.mesh.position.set(this.x, 0, this.y);

		if (Math.abs(this.x - this.targetPosition.x) < 1 && Math.abs(this.y - this.targetPosition.y) < 1) {
			this.currentSpeed.x = 0;
			this.currentSpeed.y = 0;

			this.stopMoveAnimation();
		}
	}

	public updateAnimation(delta: number): void {
		if (this.mixer) {
			this.mixer.update(delta);
		}
	}

	private playMoveAnimation(): void {
		if (this.animation.move && this.mixer) {
			console.log('Playing move animation');
			this.mixer.clipAction(this.animation.move).play();
		}
	}

	private stopMoveAnimation(): void {
		if (this.animation.move && this.mixer) {
			console.log('Stopping move animation');
			this.mixer.clipAction(this.animation.move).stop();
		}
	}
}