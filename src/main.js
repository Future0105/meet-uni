import { createSSRApp } from "vue";
import App from "./App.vue";
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export function createApp() {
	const app = createSSRApp(App);
	const pinia = createPinia()
	pinia.use(piniaPluginPersistedstate)
	// 使用 pinia
	app.use(pinia)

	return {
		app
	};
}
