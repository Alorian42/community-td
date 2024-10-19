import Player from '@shared/class/entity/Player';
import EntityRenderer from './base/EntityRenderer';
import Unit from './base/Unit';

export default class PlayerRenderer extends EntityRenderer<Player> {
	public override create(): void {
		const animations = new Map<string, string>();

		animations.set('move', 'Running_A');
		animations.set('idle', 'Idle');

		this.init('player', 5, animations);

		super.create();
	}

	public override addLifeBar(): void {}

	public static fromXY(x: number, y: number): PlayerRenderer {
		const enemy = new Player(x, y);
		const unit = new Unit();

		return new PlayerRenderer(enemy, unit);
	}
}
