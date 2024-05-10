import BaseConfig from './BaseConfig';
import Sword from '../images/sword.png';
import Enemy from '../images/enemy.png';
import Logo from '../images/logo.png';
import BasicTower from '../images/Basic Tower.png';
import BuildButton from '../images/Build Button.png';

export default class ResourcesConfig extends BaseConfig {
	static config = {
		images: {
			Logo,
			Sword,
			Enemy,
			BasicTower,
			BuildButton,
		},
		colors: {
			defaultBackground: 'rgb(78, 131, 100)',
		},
	} as const;
}
