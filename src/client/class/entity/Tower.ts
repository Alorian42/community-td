import { LoopOnce } from 'three';
import EntityRenderer from './base/EntityRenderer';
import Unit from './base/Unit';
import Tower from '@/shared/class/entity/Tower';

export default class TowerRenderer extends EntityRenderer<Tower> {
	protected modelName = 'tower';
	protected scale = 5;
	protected showHpBar = false;

	protected override setupAnimations(): void {
		this.addAnimation('idle', 'Idle_Combat');
		this.addAnimation('attack', '2H_Melee_Attack_Slice', LoopOnce);
	}

	public static fromXY(x: number, y: number): TowerRenderer {
		const tower = new Tower(x, y);
		const unit = new Unit();

		return new TowerRenderer(tower, unit);
	}
}
