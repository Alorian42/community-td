import { EventSystem } from '../../utils/EventSystem';

export default abstract class Entity extends EventSystem {
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

	constructor(protected x: number, protected y: number) {
		super();
	}

	public create(): void {
		this.emit('create');
	}
	public destroy(): void {
		this.emit('destroy');
	}

	public startMove(x: number, y: number): void {
		this.targetPosition.x = x;
		this.targetPosition.y = y;

		const distance = Math.sqrt((x - this.x) * (x - this.x) + (y - this.y) * (y - this.y));
		const time = distance / this.speed;
		const speedX = (x - this.x) / time;
		const speedY = (y - this.y) / time;
		
		this.currentSpeed.x = speedX;
		this.currentSpeed.y = speedY;
		
		this.emit('startMove');
	}

	public move(factor: number): void {
		if (this.currentSpeed.x === 0 && this.currentSpeed.y === 0) {
			return;
		}

		this.x += this.currentSpeed.x * factor;
		this.y += this.currentSpeed.y * factor;

		if (this.closeToTarget()) {
			this.currentSpeed.x = 0;
			this.currentSpeed.y = 0;

			this.emit('stopMove');
		}
	}

	protected closeToTarget(): boolean {
		return Math.abs(this.x - this.targetPosition.x) < 1 && Math.abs(this.y - this.targetPosition.y) < 1;
	}
}