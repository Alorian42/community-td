import { Engine, PointerButton, type Sprite } from 'excalibur';
import Player from './actors/Player';
import Resources from './Resources';
import Enemy from './actors/Enemy';
import MainScene from './scenes/Main';
import SceneController from './controllers/SceneController';

export default class Game extends Engine {
	/**
	 * Game resources
	 */
	private readonly resources: Resources;

	private player: Player | null = null;
	private enemies: Enemy[] = [];

	constructor() {
		super({ width: 800, height: 600 });

		this.resources = new Resources();
	}

	public initialize(): void {
		const loader = this.resources.loadResources();
		const scene = new MainScene();
		const enemy = new Enemy();
		this.player = new Player();
		this.enemies = [enemy];

		this.add(scene.getName(), scene);
		SceneController.registerActor(scene, this.player);
		SceneController.registerActor(scene, enemy);

		loader.on('afterload', () => {
			this.input.pointers.clear();
			this.goToScene(scene.getName()).catch(error => {
				console.error('Error loading scene:', error);
			});
			this.initMovement();
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
