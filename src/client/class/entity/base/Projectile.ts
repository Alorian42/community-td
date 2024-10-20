import * as THREE from 'three';
import { container } from 'tsyringe';
import type RenderEngine from '../../engine/RenderEngine';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import MathUtils from '@/shared/class/utils/Math';
import type Entity from '@shared/class/entity/base/Entity';

export default class Projectile {
	public mesh: THREE.Mesh;
	private speed: number;
	private entity: Entity;
	private targetEntity: Entity;
	private onComplete: () => void;

	constructor(entity: Entity, targetEntity: Entity, speed: number, onComplete?: () => void) {
		const renderEngine = container.resolve('renderEngine') as RenderEngine;
		this.entity = entity;
		this.targetEntity = targetEntity;
		this.mesh = clone(renderEngine.getModel('towerProjectiles').scene) as any;
		const postion = entity.getPosition();
		this.mesh.position.copy(new THREE.Vector3(postion.x, 5, postion.y));
		this.mesh.scale.set(5, 5, 5);
		this.speed = speed;
		this.onComplete = onComplete || (() => {});

		this.faceTarget();
	}

	public update(deltaTime: number): boolean {
		const targetPos = this.targetEntity.getPosition();
		const targetPosition = new THREE.Vector3(targetPos.x, 5, targetPos.y);

		const direction = new THREE.Vector3().subVectors(targetPosition, this.mesh.position).normalize();
		const distanceToTarget = this.mesh.position.distanceTo(targetPosition);
		const distanceToMove = this.speed * deltaTime;

		if (distanceToMove >= distanceToTarget) {
			this.mesh.position.copy(targetPosition);
			this.onComplete();

			return true;
		} else {
			this.mesh.position.addScaledVector(direction, distanceToMove);
			this.faceTarget();

			return false;
		}
	}

	private faceTarget(): void {
		const targetPos = this.targetEntity.getPosition();
		const targetPosition = new THREE.Vector3(targetPos.x, 5, targetPos.y);
		this.mesh.lookAt(targetPosition);
	}
}
