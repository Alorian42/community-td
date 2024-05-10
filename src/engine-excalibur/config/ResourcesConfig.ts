import BaseConfig from './BaseConfig';
import Sword from '../images/sword.png';
import Enemy from '../images/enemy.png';
import Logo from '../images/logo.png';

export default class ResourcesConfig extends BaseConfig {
	static config = {
		images: {
			Logo,
			Sword,
			Enemy,
		},
		colors: {
			defaultBackground: 'rgb(78, 131, 100)',
		},
	} as const;
}
