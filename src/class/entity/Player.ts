import Entity from "./Entity";
import { container } from "tsyringe";
import { LoopRepeat } from "three";

export default class Player extends Entity {
	public override create(): void {
		const renderEngine = container.resolve('renderEngine') as any;
		const model = renderEngine.getModel('player');
		const mesh = model.scene;

		mesh.scale.set(5, 5, 5);
		mesh.position.set(this.x, 1, this.y);

		this.animation.move = model.animations.find((a: any) => a.name === 'Running_A');
		this.animation.move.loop = LoopRepeat;

		this.mesh = mesh;
		this.speed = 1;
		this.created = true;

		super.create();
	}
}