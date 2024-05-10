import { Engine, Color, PointerButton, type Sprite, Vector, type Scene } from 'excalibur';
import Player from './actors/Player';
import Resources from './Resources';
import Enemy from './actors/Enemy';
import MainScene from './scenes/Main';
import SceneController from './controllers/SceneController';
import Tower from './actors/Tower';
import MainEngine from '../engine-shared/engines/MainEngine';
import { UnitEvents } from '../engine-shared/unit/Unit';
import BuildButton from './ui/BuildButton';

export default class Game extends Engine {
	/**
	 * Game resources
	 */
	private readonly resources: Resources;

	private player: Player | null = null;
	private readonly enemies: Enemy[] = [];
	private readonly mainEngine: MainEngine;

	constructor() {
		super({ width: 800, height: 600 });

		this.resources = new Resources();
		this.mainEngine = new MainEngine();
	}

	protected createEnemy(scene: Scene): Enemy {
		const enemy = new Enemy(300, 300);

		enemy.getUnit().on(UnitEvents.DEATH, () => {
			this.enemies.splice(this.enemies.indexOf(enemy), 1);
			SceneController.unregisterActor(scene, enemy);

			window.setTimeout(() => {
				this.createEnemy(scene);
			}, 1000);
		});

		this.enemies.push(enemy);
		this.mainEngine.registerEnemy(enemy.getUnit());
		SceneController.registerActor(scene, enemy);

		enemy.moveTo(300, 425);

		return enemy;
	}

	protected createTower(scene: Scene): Tower {
		const tower = new Tower(450, 300);

		this.mainEngine.registerTower(tower.getUnit());
		SceneController.registerActor(scene, tower);

		return tower;
	}

	protected createBuildButton(scene: Scene): void {
		const button = new BuildButton();

		scene.add(button);
	}

	public initialize(): void {
		const loader = this.resources.loadResources();
		const scene = new MainScene();
		this.player = new Player(100, 100);
		this.createEnemy(scene);
		this.createTower(scene);

		this.add(scene.getName(), scene);
		SceneController.registerActor(scene, this.player);

		loader.on('afterload', () => {
			this.input.pointers.clear();
			this.goToScene(scene.getName()).catch(error => {
				console.error('Error loading scene:', error);
			});
			this.initMovement();

			this.onPreDraw = () => {
				this.graphicsContext.drawCircle(new Vector(450, 300), 200, Color.Transparent, Color.Red, 2);
			};

			this.createBuildButton(scene);

			this.mainEngine.start();
		});

		this.canvas.addEventListener('contextmenu', e => {
			e.preventDefault();
		});

		this.start(loader).catch(error => {
			console.error('Error loading game resources:', error);
		});
	}

	public initMovement(): void {
		this.input.pointers.primary.on('down', event => {
			if (event.button === PointerButton.Right) {
				if (this.player === null) {
					return;
				}

				const targetPos = this.screenToWorldCoordinates(event.screenPos);

				this.player.moveTo(targetPos.x, targetPos.y);

				event.nativeEvent.preventDefault();
			}
		});
	}

	public getSprite(name: string): Sprite {
		const resources = this.resources.getResources();

		if (resources[name] === undefined) {
			throw new Error(`Sprite ${name} not found`);
		}

		return resources[name].toSprite();
	}
}
