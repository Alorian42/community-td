import Player from '@shared/class/entity/Player';
import EntityRenderer from './base/EntityRenderer';
import Unit from './base/Unit';

export default class PlayerRenderer extends EntityRenderer<Player> {
	protected modelName = 'player';
	protected scale = 5;
	protected showHpBar = false;

	protected override setupAnimations(): void {
		this.animations.set('move', 'Running_A');
		this.animations.set('idle', 'Idle');
	}

	public static fromXY(x: number, y: number): PlayerRenderer {
		const enemy = new Player(x, y);
		const unit = new Unit();

		return new PlayerRenderer(enemy, unit);
	}
}
