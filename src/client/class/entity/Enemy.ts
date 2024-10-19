import EntityRenderer from './base/EntityRenderer';
import Enemy from '@/shared/class/entity/Enemy';
import Unit from './base/Unit';

export default class EnemyRenderer extends EntityRenderer<Enemy> {
	public override create(): void {
		const animations = new Map<string, string>();

		animations.set('move', 'Running_A');
		animations.set('idle', 'Idle_Combat');

		this.init('enemy', 5, animations);

		super.create();
	}

	public static fromXY(x: number, y: number): EnemyRenderer {
		const enemy = new Enemy(x, y);
		const unit = new Unit();

		return new EnemyRenderer(enemy, unit);
	}
}
