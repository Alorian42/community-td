import EntityRenderer from './base/EntityRenderer';
import Enemy from '@/shared/class/entity/Enemy';
import Unit from './base/Unit';

export default class EnemyRenderer extends EntityRenderer<Enemy> {
	protected modelName = 'enemy';
	protected scale = 5;

	protected override setupAnimations(): void {
		this.addAnimation('move', 'Running_A');
		this.addAnimation('idle', 'Idle_Combat');
	}

	public static fromXY(x: number, y: number): EnemyRenderer {
		const enemy = new Enemy(x, y);
		const unit = new Unit();

		return new EnemyRenderer(enemy, unit);
	}
}
