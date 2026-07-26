import * as Yup from "yup";

export const employeeSchema = Yup.object().shape({
	firstName: Yup.string().min(2, "Too short").max(50, "Max length exceeded").required("First name is required"),
	email: Yup.string().email("Invalid email").required("Email is required"),
	phoneNumber: Yup.string()
		.matches(/^[0-9]{10,11}$/, "Phone number must be 10–11 digits")
		.required("Phone number is required"),
	position: Yup.string().min(2, "Too short").max(50, "Max length exceeded").required("Position is required"),
	address: Yup.string().min(2, "Too short").max(50, "Max length exceeded").required("Address is required")
});

export const employeeInitial = {
	firstName: "",
	email: "",
	phoneNumber: "",
	position: "",
	address: ""
};

export type EmployeeFormValues = typeof employeeInitial;

export const employeeFields = [
	{ name: "firstName" as const, label: "First name", placeholder: "Jane", keyboardType: "default" as const, autoCapitalize: "words" as const },
	{ name: "email" as const, label: "Email", placeholder: "jane@email.com", keyboardType: "email-address" as const, autoCapitalize: "none" as const },
	{ name: "phoneNumber" as const, label: "Phone number", placeholder: "4035551234", keyboardType: "phone-pad" as const, autoCapitalize: "none" as const },
	{ name: "position" as const, label: "Position", placeholder: "Developer", keyboardType: "default" as const, autoCapitalize: "words" as const },
	{ name: "address" as const, label: "Address", placeholder: "123 Main St", keyboardType: "default" as const, autoCapitalize: "words" as const }
];
