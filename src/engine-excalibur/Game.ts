import { Engine, Color, PointerButton, type Sprite, Vector } from 'excalibur';
import Player from './actors/Player';
import Resources from './Resources';
import Enemy from './actors/Enemy';
import MainScene from './scenes/Main';
import SceneController from './controllers/SceneController';
import Tower from './actors/Tower';
import MainEngine from '../engine-shared/engines/MainEngine';

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

		this.mainEngine.start();
	}

	protected createEnemy(): Enemy {
		const enemy = new Enemy(300, 300);

		this.enemies.push(enemy);
		this.mainEngine.registerEnemy(enemy.getUnit());

		return enemy;
	}

	protected createTower(): Tower {
		const tower = new Tower(450, 300);

		this.mainEngine.registerTower(tower.getUnit());

		return tower;
	}

	public initialize(): void {
		const loader = this.resources.loadResources();
		const scene = new MainScene();
		const enemy = this.createEnemy();
		const tower = this.createTower();
		this.player = new Player(100, 100);

		this.add(scene.getName(), scene);
		SceneController.registerActor(scene, this.player);
		SceneController.registerActor(scene, enemy);
		SceneController.registerActor(scene, tower);

		loader.on('afterload', () => {
			this.input.pointers.clear();
			this.goToScene(scene.getName()).catch(error => {
				console.error('Error loading scene:', error);
			});
			this.initMovement();

			this.onPreUpdate = () => {
				this.graphicsContext.drawCircle(new Vector(450, 300), 200, Color.Transparent, Color.Red, 2);
			};
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
