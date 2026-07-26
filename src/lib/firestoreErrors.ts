export function getFirestoreErrorMessage(code?: string): string {
	switch (code) {
		case "permission-denied":
			return "Permission denied. In Firebase Console, open Firestore → Rules, paste firestore.rules from this project, and publish.";
		case "unavailable":
			return "Firestore is unavailable. Check your connection and try again.";
		case "not-found":
			return "Firestore database not found. Create a Firestore database in Firebase Console.";
		case "unauthenticated":
			return "You are not signed in. Please sign in and try again.";
		default:
			return "Could not load submissions. Check your connection and try again.";
	}
}
