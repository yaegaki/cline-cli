import * as vscode from "vscode-interface"
import crypto from "crypto"
import { Controller } from "../index"
import { storeSecret } from "../../storage/state"

/**
 * Handles the user clicking the login link in the UI.
 * Generates a secure nonce for state validation, stores it in secrets,
 * and opens the authentication URL in the external browser.
 *
 * @param controller The controller instance.
 * @returns The login URL as a string.
 */
export async function accountLoginClicked(controller: Controller): Promise<String> {
	// Generate nonce for state validation
	const nonce = crypto.randomBytes(32).toString("hex")
	await storeSecret(controller.context, "authNonce", nonce)

	// Open browser for authentication with state param
	console.log("Login button clicked in account page")
	console.log("Opening auth page with state param")

	const uriScheme = vscode.env.uriScheme

	const authUrl = vscode.Uri.parse(
		`https://app.cline.bot/auth?state=${encodeURIComponent(nonce)}&callback_url=${encodeURIComponent(`${uriScheme || "vscode"}://saoudrizwan.claude-dev/auth`)}`,
	)
	vscode.env.openExternal(authUrl)
	return authUrl.toString()
}
