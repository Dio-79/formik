import { StyleSheet } from "react-native";

export const formStyles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: "#f5f6f8" },
	scroll: { padding: 20, paddingBottom: 40 },
	title: { fontSize: 24, fontWeight: "700", color: "#111", marginBottom: 4 },
	subtitle: { fontSize: 14, color: "#666", marginBottom: 20 },
	field: { marginBottom: 12 },
	label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 6 },
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 10,
		paddingHorizontal: 14,
		paddingVertical: 12,
		fontSize: 16,
		backgroundColor: "#fff"
	},
	inputFocused: { borderColor: "#208AEF" },
	inputError: { borderColor: "#d32f2f" },
	errorText: { color: "#d32f2f", fontSize: 12, marginTop: 4 },
	passwordRow: { flexDirection: "row", alignItems: "center" },
	passwordInput: { flex: 1, marginRight: 8 },
	toggle: { padding: 8 },
	toggleText: { color: "#208AEF", fontWeight: "600" },
	button: {
		marginTop: 8,
		backgroundColor: "#208AEF",
		borderRadius: 10,
		paddingVertical: 14,
		alignItems: "center"
	},
	buttonDisabled: { backgroundColor: "#a0c4e8" },
	buttonPressed: { opacity: 0.85 },
	buttonSecondary: {
		marginTop: 10,
		borderRadius: 10,
		paddingVertical: 14,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#208AEF"
	},
	buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
	buttonSecondaryText: { color: "#208AEF", fontSize: 16, fontWeight: "600" },
	link: { marginTop: 16, alignItems: "center" },
	linkText: { color: "#208AEF", fontSize: 14 }
});
