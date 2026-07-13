import { Link } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { formStyles as styles } from "../styles/formStyles";

const schema = Yup.object().shape({
	firstName: Yup.string().min(2, "Too short").max(50, "Max length exceeded").required("First name is required"),
	email: Yup.string().email("Invalid email").required("Email is required"),
	phoneNumber: Yup.string()
		.matches(/^[0-9]{10,11}$/, "Phone number must be 10–11 digits")
		.required("Phone number is required"),
	position: Yup.string().min(2, "Too short").max(50, "Max length exceeded").required("Position is required"),
	address: Yup.string().min(2, "Too short").max(50, "Max length exceeded").required("Address is required")
});

const initial = { firstName: "", email: "", phoneNumber: "", position: "", address: "" };

const fields = [
	{ name: "firstName" as const, label: "First name", placeholder: "Jane", keyboardType: "default" as const, autoCapitalize: "words" as const },
	{ name: "email" as const, label: "Email", placeholder: "jane@email.com", keyboardType: "email-address" as const, autoCapitalize: "none" as const },
	{ name: "phoneNumber" as const, label: "Phone number", placeholder: "4035551234", keyboardType: "phone-pad" as const, autoCapitalize: "none" as const },
	{ name: "position" as const, label: "Position", placeholder: "Developer", keyboardType: "default" as const, autoCapitalize: "words" as const },
	{ name: "address" as const, label: "Address", placeholder: "123 Main St", keyboardType: "default" as const, autoCapitalize: "words" as const }
];

export default function EmployeeScreen() {
	const [focus, setFocus] = useState<string | null>(null);

	return (
		<SafeAreaView style={styles.safe} edges={["bottom"]}>
			<ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
				<Text style={styles.title}>Employee</Text>
				<Text style={styles.subtitle}>Fill in the details below</Text>

				<Formik
					initialValues={initial}
					validationSchema={schema}
					validateOnChange
					validateOnBlur
					validateOnMount
					onSubmit={(values, { setSubmitting, resetForm }) => {
						setTimeout(() => {
							setSubmitting(false);
							Alert.alert("Saved", JSON.stringify(values, null, 2));
							resetForm();
						}, 1000);
					}}>
					{({ values, errors, touched, dirty, isValid, isSubmitting, handleChange, handleBlur, handleSubmit, resetForm }) => {
						const show = (name: keyof typeof initial) => (touched[name] || values[name].length > 0) && errors[name];

						return (
							<View>
								{fields.map(({ name, label, placeholder, keyboardType, autoCapitalize }) => (
									<View style={styles.field} key={name}>
										<Text style={styles.label}>{label}</Text>
										<TextInput
											style={[styles.input, focus === name && styles.inputFocused, show(name) && styles.inputError]}
											placeholder={placeholder}
											placeholderTextColor="#999"
											value={values[name]}
											onChangeText={handleChange(name)}
											onFocus={() => setFocus(name)}
											onBlur={e => {
												setFocus(null);
												handleBlur(name)(e);
											}}
											keyboardType={keyboardType}
											autoCapitalize={autoCapitalize}
											autoCorrect={false}
										/>
										{show(name) ? <Text style={styles.errorText}>{errors[name]}</Text> : null}
									</View>
								))}

								<Pressable style={({ pressed }) => [styles.button, (!isValid || !dirty || isSubmitting) && styles.buttonDisabled, pressed && isValid && dirty && !isSubmitting && styles.buttonPressed]} disabled={!isValid || !dirty || isSubmitting} onPress={handleSubmit as () => void}>
									{isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit</Text>}
								</Pressable>

								<Pressable style={styles.buttonSecondary} onPress={() => resetForm()} disabled={isSubmitting}>
									<Text style={styles.buttonSecondaryText}>Reset</Text>
								</Pressable>

								<Link href="/sign-in" asChild>
									<Pressable style={styles.link}>
										<Text style={styles.linkText}>Go to Sign In</Text>
									</Pressable>
								</Link>
								<Link href="/sign-up" asChild>
									<Pressable style={styles.link}>
										<Text style={styles.linkText}>Go to Sign Up</Text>
									</Pressable>
								</Link>
							</View>
						);
					}}
				</Formik>
			</ScrollView>
		</SafeAreaView>
	);
}
