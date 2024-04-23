import BaseConfig from './BaseConfig';
import Sword from '../images/sword.png';
import Enemy from '../images/enemy.png';

export default class ResourcesConfig extends BaseConfig {
	static config = {
		images: {
			Sword,
			Enemy,
		},
	} as const;
}
