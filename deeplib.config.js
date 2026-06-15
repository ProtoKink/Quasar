import { defineConfig } from 'bc-deeplib/build';

export default defineConfig({
	entry: 'index.ts',
	outfile: 'index.js',
	modInfo: {
		name: 'Quasar',
		fullName: 'Quasar',
		repository: 'https://github.com/ProtoKink/Quasar'
	},
	port: 8657,
	esbuildOptions: {
		globalName: 'Quasar',
		target: ['es2022']
	}
});
