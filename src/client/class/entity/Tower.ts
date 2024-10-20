import { Bone, LoopOnce, Object3D, SkinnedMesh } from 'three';
import EntityRenderer from './base/EntityRenderer';
import Unit from './base/Unit';
import Tower from '@/shared/class/entity/Tower';
import { container } from 'tsyringe';
import type RenderEngine from '../engine/RenderEngine';

export default class TowerRenderer extends EntityRenderer<Tower> {
	protected modelName = 'tower';
	protected scale = 5;
	protected showHpBar = false;

	protected override setupAnimations(): void {
		this.addAnimation('idle', 'Idle_Combat');
		this.addAnimation('attack', '2H_Melee_Attack_Chop', LoopOnce);
	}

	protected override init(): void {
		super.init();

		const renderEngine = container.resolve('renderEngine') as RenderEngine;
		const mesh = this.unit.getMesh();
		const weaponModel = renderEngine.getModel('towerWeapon').scene.clone();

		// Function to find SkinnedMesh within an Object3D
		function findSkinnedMesh(object: Object3D): SkinnedMesh | null {
			if (object instanceof SkinnedMesh) {
				return object;
			}
			for (const child of object.children) {
				const skinnedMesh = findSkinnedMesh(child);
				if (skinnedMesh) {
					return skinnedMesh;
				}
			}
			return null;
		}

		// Find the SkinnedMesh in your character model
		const skinnedMesh = findSkinnedMesh(mesh);
		if (!skinnedMesh) {
			console.error('SkinnedMesh not found in the character model.');
			return;
		}

		// Find the hand bone in the character's skeleton
		const handBoneName = 'handslotl'; // Replace with the actual bone name from your model
		const handBone = skinnedMesh.skeleton.bones.find(bone => bone.name === handBoneName);

		if (handBone) {
			// Attach the weapon model to the hand bone
			handBone.add(weaponModel);

			// Adjust the weapon's position, rotation, and scale relative to the hand bone
			weaponModel.position.set(0, 0, 0); // Adjust these values as needed
			weaponModel.rotation.set(0, 0, 0);
			weaponModel.scale.set(0.01, 0.01, 0.01);
		} else {
			console.warn(`Hand bone '${handBoneName}' not found in the skeleton.`);
		}
	}

	public static fromXY(x: number, y: number): TowerRenderer {
		const tower = new Tower(x, y);
		const unit = new Unit();

		return new TowerRenderer(tower, unit);
	}
}
