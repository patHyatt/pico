import { Ai } from '@cloudflare/ai'

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	AI: Ai;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method !== 'POST') {
			return new Response('Method Not Allowed', { status: 405 })
		}

		const ai = new Ai(env.AI)

		const formData = await request.formData();
		const animal = formData.get('animal')
		const universe = formData.get('universe')

		const inputs = {
			prompt: `a ${animal} character in the ${universe} universe`,
		};

		const response = await ai.run(
			"@cf/bytedance/stable-diffusion-xl-lightning",
			inputs
		);

		return new Response(response, {
			headers: {
				"content-type": "image/png"
			}
		});
	},
};
