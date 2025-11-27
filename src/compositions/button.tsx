import React from "react";
import {
	Button as ChakraButton,
	type ButtonProps,
	type ConditionalValue,
} from "@chakra-ui/react";

interface CustomButtonProps extends ButtonProps {
	variant: ConditionalValue<
		"outline" | "solid" | "subtle" | "surface" | "ghost" | "plain" | undefined
	>;
}

const Button: React.FC<CustomButtonProps> = ({
	variant = "primary",
	children,
	...rest
}) => {
	let colorScheme: ButtonProps["colorScheme"];
	let chakraVariant: ButtonProps["variant"];

	switch (variant) {
		case "primary":
			colorScheme = "blue";
			chakraVariant = "solid";
			break;
		case "secondary":
			colorScheme = "gray";
			chakraVariant = "solid";
			break;
		case "danger":
			colorScheme = "red";
			chakraVariant = "solid";
			break;
		case "outline":
			colorScheme = "blue";
			chakraVariant = "outline";
			break;
		case "ghost":
			colorScheme = "blue";
			chakraVariant = "ghost";
			break;
		default:
			colorScheme = "blue";
			chakraVariant = "solid";
			break;
	}

	return (
		<ChakraButton colorScheme={colorScheme} variant={chakraVariant} {...rest}>
			{children}
		</ChakraButton>
	);
};

export default Button;
