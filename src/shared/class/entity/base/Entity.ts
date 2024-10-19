import { EventSystem } from '@shared/class/utils/EventSystem';
import MapUtils from '../../utils/Map';

export default abstract class Entity extends EventSystem {
	protected id: number = MapUtils.getNextId();
	protected created: boolean = false;
	protected speed = 0;
	protected currentSpeed: {
		x: number;
		y: number;
	} = {
		x: 0,
		y: 0,
	};
	protected targetPosition: {
		x: number;
		y: number;
	} = {
		x: 0,
		y: 0,
	};
	protected maxLife: number = 0;

	constructor(
		protected x: number,
		protected y: number
	) {
		super();
	}

	public create(): void {
		this.created = true;
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

		this.emit('startMove', { x, y });
	}

	public move(factor: number): void {
		if (this.currentSpeed.x === 0 && this.currentSpeed.y === 0) {
			return;
		}

		const nextX = this.x + this.currentSpeed.x * factor;
		const nextY = this.y + this.currentSpeed.y * factor;

		if (this.closeToTarget() || !MapUtils.isInSceneBorders(nextX, nextY)) {
			this.currentSpeed.x = 0;
			this.currentSpeed.y = 0;

			this.targetPosition.x = this.x;
			this.targetPosition.y = this.y;

			this.emit('stopMove');

			return;
		}

		this.x = nextX;
		this.y = nextY;
		this.emit('move');
	}

	public getPosition(): { x: number; y: number } {
		return {
			x: this.x,
			y: this.y,
		};
	}

	public isCreated(): boolean {
		return this.created;
	}

	public closeToTarget(): boolean {
		return Math.abs(this.x - this.targetPosition.x) < 1 && Math.abs(this.y - this.targetPosition.y) < 1;
	}

	public getId(): number {
		return this.id;
	}

	public spawned(): void {
		this.emit('spawn');
	}
}
