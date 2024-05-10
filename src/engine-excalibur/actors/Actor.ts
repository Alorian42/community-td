import { Color, Actor as ExActor, Font, Label, vec, Vector } from 'excalibur';
import type Game from '../Game';
import type Unit from '../../engine-shared/unit/Unit';
import { UnitEvents } from '../../engine-shared/unit/Unit';
// import { Resources } from './resources';

interface LabelsConfig {
	showName?: boolean;
	showHealth?: boolean;
}

export default class Actor extends ExActor {
	protected readonly spriteName: string;
	protected targetPos: Vector | null = null;
	protected speed = 0;
	protected unit!: Unit;
	protected nameLabel?: Label;
	protected healthLabel?: Label;
	protected labelsConfig: LabelsConfig = {};

	constructor(
		spriteName: string,
		posX: number,
		posY: number,
		width: number,
		height: number,
		labelsConfig: LabelsConfig = {}
	) {
		super({
			pos: vec(posX, posY),
			width,
			height,
		});

		this.spriteName = spriteName;
		this.labelsConfig = labelsConfig;
	}

	protected initLabels(): void {
		if (this.labelsConfig.showName) {
			this.nameLabel = new Label({
				text: this.getName(),
				pos: this.pos.add(new Vector(-25, -50)),
				color: Color.White,
				font: new Font({
					size: 14,
					family: 'Arial',
					bold: true,
				}),
			});
		}

		if (this.labelsConfig.showHealth) {
			this.healthLabel = new Label({
				text: `${this.getCurrentHealth()} / ${this.getMaxHealth()}`,
				pos: this.pos.add(new Vector(-25, 50)),
				color: Color.White,
				font: new Font({
					size: 12,
					family: 'Arial',
				}),
			});

			this.unit.on(UnitEvents.HEALTH_CHANGE, () => {
				if (this.healthLabel) {
					this.healthLabel.text = `${this.getCurrentHealth()} / ${this.getMaxHealth()}`;
				}
			});
		}
	}

	public onInitialize(engine: Game): void {
		this.graphics.add(engine.getSprite(this.spriteName));
	}

	public moveTo(x: number, y: number): void {
		this.targetPos = new Vector(x, y);
		this.vel = this.targetPos.sub(this.pos).normalize().scale(this.speed);
	}

	public update(engine: Game, delta: number): void {
		super.update(engine, delta);

		this.unit.pos = this.pos;

		if (this.targetPos !== null) {
			const distance = this.targetPos.distance(this.pos);
			if (distance < (this.speed * delta) / 1000) {
				this.pos = this.targetPos;
				this.vel.setTo(0, 0);
				this.targetPos = null;
			}

			if (this.nameLabel !== undefined) {
				this.nameLabel.pos = this.pos.add(new Vector(-25, -50));
			}

			if (this.healthLabel !== undefined) {
				this.healthLabel.pos = this.pos.add(new Vector(-25, 50));
			}
		}
	}

	public getName(): string {
		return this.unit.name;
	}

	public getCurrentHealth(): number {
		return this.unit.currentHealth;
	}

	public getMaxHealth(): number {
		return this.unit.maxHealth;
	}

	public getLabels(): Label[] {
		const labels: Label[] = [];

		if (this.nameLabel !== undefined) {
			labels.push(this.nameLabel);
		}

		if (this.healthLabel !== undefined) {
			labels.push(this.healthLabel);
		}

		return labels;
	}

	public getUnit(): Unit {
		return this.unit;
	}
}
