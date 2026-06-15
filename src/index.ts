import { initMod } from 'bc-deeplib/deeplib';
import { CommandsModule } from './modules/commands.js';

initMod({
	modules: {
		CommandsModule: new CommandsModule(),
	},
});
