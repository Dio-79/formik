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
	buttonDanger: {
		marginTop: 10,
		backgroundColor: "#d32f2f",
		borderRadius: 10,
		paddingVertical: 14,
		alignItems: "center"
	},
	link: { marginTop: 16, alignItems: "center" },
	linkText: { color: "#208AEF", fontSize: 14 },
	centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, gap: 12 },
	listContainer: { flex: 1, padding: 20 },
	listFlex: { flex: 1 },
	listContent: { paddingBottom: 24, gap: 12 },
	helperText: { fontSize: 14, color: "#666", textAlign: "center" },
	emptyTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
	errorBanner: { fontSize: 14, color: "#d32f2f", textAlign: "center", marginBottom: 8 },
	card: {
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 16,
		borderWidth: 1,
		borderColor: "#e0e0e0"
	},
	cardPressable: {
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 16,
		borderWidth: 1,
		borderColor: "#e0e0e0"
	},
	cardTitle: { fontSize: 16, fontWeight: "700", color: "#111", marginBottom: 4 },
	cardLine: { fontSize: 14, color: "#555", marginTop: 2 },
	cardHint: { fontSize: 12, color: "#208AEF", marginTop: 8, fontWeight: "600" },
	profileCard: {
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 16,
		borderWidth: 1,
		borderColor: "#e0e0e0",
		gap: 14,
		marginBottom: 8
	},
	profileRow: { gap: 4 },
	profileLabel: { fontSize: 12, fontWeight: "600", color: "#666", textTransform: "uppercase" },
	profileValue: { fontSize: 16, color: "#111" }
});
