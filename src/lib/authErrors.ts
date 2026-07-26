export function getAuthErrorMessage(code?: string): string {
	switch (code) {
		case "auth/email-already-in-use":
			return "An account with this email already exists.";
		case "auth/invalid-email":
			return "Please enter a valid email address.";
		case "auth/invalid-credential":
		case "auth/wrong-password":
		case "auth/user-not-found":
			return "Invalid email or password.";
		case "auth/weak-password":
			return "Password is too weak. Use at least 6 characters.";
		case "auth/too-many-requests":
			return "Too many attempts. Please try again later.";
		case "auth/network-request-failed":
			return "Network error. Check your connection and try again.";
		case "auth/user-disabled":
			return "This account has been disabled.";
		default:
			return "Something went wrong. Please try again.";
	}
}

export function getPasswordResetErrorMessage(code?: string): string {
	switch (code) {
		case "auth/invalid-email":
			return "Please enter a valid email address.";
		case "auth/user-not-found":
			return "No account found with this email.";
		case "auth/too-many-requests":
			return "Too many attempts. Please try again later.";
		case "auth/network-request-failed":
			return "Network error. Check your connection and try again.";
		default:
			return "Could not send reset email. Please try again.";
	}
}
