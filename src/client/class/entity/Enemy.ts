import { container } from "tsyringe";
import { LoopRepeat } from "three";
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import EntityRenderer from "./base/EntityRenderer";
import Enemy from "@/shared/class/entity/Enemy";
import Unit from "./base/Unit";

export default class EnemyRenderer extends EntityRenderer<Enemy> {
	public override create(): void {
		const renderEngine = container.resolve('renderEngine') as any;
		const model = renderEngine.getModel('enemy');
		const mesh = clone(model.scene) as any;
		const position = this.entity.getPosition();

		mesh.scale.set(5, 5, 5);
		mesh.position.set(position.x, 0, position.y);

		this.unit.setAnimation('move', model.animations.find((a: any) => a.name === 'Running_A'), LoopRepeat);
		this.unit.setAnimation('idle', model.animations.find((a: any) => a.name === 'Idle_Combat'), LoopRepeat);

		this.unit.setMesh(mesh);
	
		super.create();
	}

	public static fromXY(x: number, y: number): EnemyRenderer {
		const enemy = new Enemy(x, y);
		const unit = new Unit();

		return new EnemyRenderer(enemy, unit);
	}
}