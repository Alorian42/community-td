import AbstractItem from 'Items/Abstract';
import Tower from '../Towers/Abstract';
import BasicTower from '../Towers/Basic';
import AdvancedTower from 'Towers/Advanced';
import AddColdDamageGem from 'Items/AddColdDamage';
import MultipleProjectilesGem from 'Items/MultipleProjectiles';
import { getRandomElement } from 'Utils/Array';

export default class RewardEngine {
	static TowerPool: Array<typeof Tower> = [BasicTower, AdvancedTower];
	static GemPool: Array<typeof AbstractItem> = [
		AddColdDamageGem,
		MultipleProjectilesGem,
	];

	static generateTowerReward(wave: number): Array<Tower> {
		const count = this.considerWave(wave);

		const rewards = [];

		for (let i = 0; i < count; i++) {
			const tower = getRandomElement(this.TowerPool) as any;
			rewards.push(new tower());
		}

		return rewards;
	}

	static generateGemReward(wave: number): Array<typeof AbstractItem> {
		const count = this.considerWave(wave);

		const rewards = [];

		for (let i = 0; i < count; i++) {
			rewards.push(getRandomElement(this.GemPool));
		}

		return rewards;
	}

	/**
	 * There always will be at least 1 reward. Depending on the wave, there might be more.
	 */
	static considerWave(wave: number): number {
		const baseReward = 2;
		const additionalRewardChance = wave / 10 + Math.random();

		return Math.floor(baseReward + additionalRewardChance);
	}
}
