import { container } from "tsyringe";
import { LoopRepeat } from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import Player from "@shared/class/entity/Player";
import EntityRenderer from "./base/EntityRenderer";
import Unit from "./base/Unit";

export default class PlayerRenderer extends EntityRenderer<Player> {
	public override create(): void {
		const renderEngine = container.resolve('renderEngine') as any;
		const model = renderEngine.getModel('player');
		const mesh = clone(model.scene) as any;
		const position = this.entity.getPosition();

		mesh.scale.set(5, 5, 5);
		mesh.position.set(position.x, 0, position.y);

		this.unit.setAnimation('move', model.animations.find((a: any) => a.name === 'Running_A'), LoopRepeat);	
		this.unit.setAnimation('idle', model.animations.find((a: any) => a.name === 'Idle'), LoopRepeat);

		this.unit.setMesh(mesh);
	
		super.create();
	}

	public static fromXY(x: number, y: number): PlayerRenderer {
		const enemy = new Player(x, y);
		const unit = new Unit();

		return new PlayerRenderer(enemy, unit);
	}
}