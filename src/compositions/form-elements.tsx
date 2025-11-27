import {
	FormControl,
	FormErrorMessage,
	FormLabel,
} from "@chakra-ui/form-control";
import {
	Input as ChakraInput,
	Textarea as ChakraTextarea,
	type InputProps as ChakraInputProps,
	type TextareaProps as ChakraTextareaProps,
} from "@chakra-ui/react";
import React from "react";
import type { FieldError } from "react-hook-form";

interface InputFieldProps extends ChakraInputProps {
	label?: string;
	error?: FieldError;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
	({ label, error, ...rest }, ref) => {
		return (
			<FormControl isInvalid={!!error}>
				{label && <FormLabel>{label}</FormLabel>}
				<ChakraInput ref={ref} {...rest} />
				{error && <FormErrorMessage>{error.message}</FormErrorMessage>}
			</FormControl>
		);
	}
);

interface TextareaFieldProps extends ChakraTextareaProps {
	label?: string;
	error?: FieldError;
}

const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
	({ label, error, ...rest }, ref) => {
		return (
			<FormControl isInvalid={!!error}>
				{label && <FormLabel>{label}</FormLabel>}
				<ChakraTextarea ref={ref} {...rest} />
				{error && <FormErrorMessage>{error.message}</FormErrorMessage>}
			</FormControl>
		);
	}
);

export { InputField, TextareaField };
