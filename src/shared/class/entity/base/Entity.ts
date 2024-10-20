import { EventSystem } from '@shared/class/utils/EventSystem';
import MapUtils from '../../utils/Map';
import MathUtils from '../../utils/Math';
import type { Vector2Like } from 'three';

export default abstract class Entity extends EventSystem {
	protected id: number = MapUtils.getNextId();
	protected created: boolean = false;

	// Movement
	protected currentSpeed: {
		x: number;
		y: number;
	} = {
		x: 0,
		y: 0,
	};
	protected speed = 0;
	protected targetPosition: {
		x: number;
		y: number;
	} = {
		x: 0,
		y: 0,
	};

	// Combat
	protected baseAttackDamage = 0;
	protected range = 0;
	protected projectileSpeed = 0;
	/**
	 * Cooldown between attacks
	 */
	protected attackSpeed = 0;
	protected readyToAttack = true;

	// Life
	protected maxLife: number = 1;
	protected currentLife: number = 1;

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
		if (!this.created) {
			return;
		}

		this.created = false;
		this.emit('destroy');
	}

	public startMove(x: number, y: number): void {
		this.targetPosition.x = x;
		this.targetPosition.y = y;

		const distance = MathUtils.getDistance(this.x, this.y, x, y);
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

	public isAlive(): boolean {
		return this.currentLife > 0;
	}

	public getRange(): number {
		return this.range;
	}

	public getAttackSpeed(): number {
		return this.attackSpeed;
	}

	public canAttack(): boolean {
		return this.readyToAttack;
	}

	public getBaseAttackDamage(): number {
		return this.baseAttackDamage;
	}

	public getProjectileSpeed(): number {
		return this.projectileSpeed;
	}

	public markAsNotReadyToAttack(target: Entity): void {
		this.readyToAttack = false;
		this.emit('startAttack', target);

		setTimeout(() => {
			this.readyToAttack = true;
			this.emit('stopAttack');
		}, this.attackSpeed * 1000);
	}

	public lifePercentage(): number {
		return Math.floor((this.currentLife / this.maxLife) * 100);
	}

	public damageReceived(damage: number): void {
		this.currentLife -= damage;

		if (this.currentLife <= 0) {
			this.currentLife = 0;
			this.destroy();
		}

		this.emit('damageReceived', this.lifePercentage());
	}
}
