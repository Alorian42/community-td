import { type Scene } from 'excalibur';
import type Actor from '../actors/Actor';

export default class SceneController {
	public static registerActor(scene: Scene, actor: Actor): void {
		scene.add(actor);
		actor.getLabels().forEach(label => {
			scene.add(label);
		});
	}

	public static unregisterActor(scene: Scene, actor: Actor): void {
		scene.remove(actor);
		actor.getLabels().forEach(label => {
			scene.remove(label);
		});
	}
}
