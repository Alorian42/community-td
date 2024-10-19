import { AnimationMixer, Vector3, type Mesh } from "three";
import Entity from "./Entity";

export default abstract class Unit extends Entity {
	protected mixer: AnimationMixer | null = null;
	protected animation: Record<string, any> = {};
	protected mesh!: Mesh;

	public override create(): void {
		this.mixer = new AnimationMixer(this.mesh);
		this.mixer.clipAction(this.animation.idle).play();

		super.create();
	}

	public override destroy(): void {
		this.mesh.geometry?.dispose();

		if (this.mesh.material) {
			if (Array.isArray(this.mesh.material)) {
				this.mesh.material.forEach(material => material.dispose());
			} else {
				this.mesh.material.dispose();
			}
		}

		this.mixer?.stopAllAction();
		this.mesh.removeFromParent();

		super.destroy();
	}
	
	public getMesh(): Mesh {
		if (!this.created) {
			this.create();
			
		}

		return this.mesh;
	}

	public override startMove(x: number, y: number): void {
		super.startMove(x, y);

		const direction = new Vector3();
		direction.subVectors(
			new Vector3(x, 0, y),
			new Vector3(this.x, 0, this.y)
		); // Vector from current to target
		direction.normalize(); // Normalize the vector to get just the direction\
		const angle = Math.atan2(direction.x, direction.z);

		this.mesh.rotation.y = angle;

		this.playMoveAnimation();
	}

	public override move(factor: number): void {
		super.move(factor);

		this.mesh.position.set(this.x, 0, this.y);

		if (this.closeToTarget()) {
			this.stopMoveAnimation();
		}
	}

	public updateAnimation(delta: number): void {
		if (this.mixer) {
			this.mixer.update(delta);
		}
	}

	private playMoveAnimation(): void {
		if (this.animation.move && this.mixer) {
			console.log('Playing move animation');
			this.mixer.clipAction(this.animation.idle).stop();
			this.mixer.clipAction(this.animation.move).play();
		}
	}

	private stopMoveAnimation(): void {
		if (this.animation.move && this.mixer && this.mixer.existingAction(this.animation.move)?.isRunning()) {
			console.log('Stopping move animation');
			this.mixer.clipAction(this.animation.move).stop();
			this.mixer.clipAction(this.animation.idle).play();
		}
	}
}