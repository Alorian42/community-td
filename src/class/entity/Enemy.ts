import { container } from "tsyringe";
import { LoopRepeat } from "three";
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import Unit from "./base/Unit";

export default class Enemy extends Unit {
	public override create(): void {
		const renderEngine = container.resolve('renderEngine') as any;
		const model = renderEngine.getModel('enemy');
		const mesh = clone(model.scene) as any;

		mesh.scale.set(5, 5, 5);
		mesh.position.set(this.x, 0, this.y);

		this.animation.move = model.animations.find((a: any) => a.name === 'Running_A');
		this.animation.move.loop = LoopRepeat;

		this.animation.idle = model.animations.find((a: any) => a.name === 'Idle_Combat');
		this.animation.idle.loop = LoopRepeat;

		this.mesh = mesh;
		this.speed = 1;
		this.created = true;

		super.create();
	}
}