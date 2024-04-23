import { Actor as ExActor, vec, Vector } from 'excalibur';
import type Game from '../Game';
// import { Resources } from './resources';

export default class Actor extends ExActor {
	protected readonly spriteName: string;
	protected targetPos: Vector | null = null;
	protected speed = 0;

	constructor(spriteName: string, posX: number, posY: number, width: number, height: number) {
		super({
			pos: vec(posX, posY),
			width,
			height,
		});

		this.spriteName = spriteName;
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

		if (this.targetPos !== null) {
			const distance = this.targetPos.distance(this.pos);
			if (distance < (this.speed * delta) / 1000) {
				this.pos = this.targetPos;
				this.vel.setTo(0, 0);
				this.targetPos = null;
			}
		}
	}
}
