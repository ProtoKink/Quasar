import type { CommandsModule } from './modules/commands.js';

declare module 'bc-deeplib/deeplib' {
	interface ModulesList {
		CommandsModule: CommandsModule;
	}
}
