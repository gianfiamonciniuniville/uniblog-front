import {
	Box,
	Container,
	HStack,
	IconButton,
	Link,
	Stack,
	Text,
} from "@chakra-ui/react";
import React from "react";
import { FaFacebook, FaInstagram, FaGithub } from "react-icons/fa";

const Footer: React.FC = () => {
	return (
		<Box
			bg="gray.900"
			color="gray.300"
			py={6}
			mt={20}
			as="footer"
			bottom={0}
			position={"absolute"}
			w={"100%"}>
			<Container maxW="6xl">
				<Stack
					direction={{ base: "column", md: "row" }}
					justify="space-between"
					align="center">
					<Text fontWeight="bold" color="white">
						UniBlog
					</Text>

					<HStack>
						<Link _hover={{ textDecoration: "underline", color: "white" }}>
							Sobre
						</Link>
						<Link _hover={{ textDecoration: "underline", color: "white" }}>
							Contato
						</Link>
						<Link _hover={{ textDecoration: "underline", color: "white" }}>
							Serviços
						</Link>
					</HStack>

					<HStack>
						<IconButton
							aria-label="Facebook"
							variant="ghost"
							_hover={{ color: "white" }}>
							<FaFacebook />
						</IconButton>
						<IconButton
							aria-label="Instagram"
							variant="ghost"
							_hover={{ color: "white" }}>
							<FaInstagram />
						</IconButton>
						<IconButton
							aria-label="Github"
							variant="ghost"
							_hover={{ color: "white" }}>
							<FaGithub />
						</IconButton>
					</HStack>
				</Stack>

				<Text textAlign="center" mt={4} fontSize="sm" color="gray.500">
					© {new Date().getFullYear()} UniBlog. All rights reserved.
				</Text>
				<Text textAlign="center" mt={4} fontSize="sm" color="gray.500">
					Built with React, Vite, and ChakraUI.
				</Text>
			</Container>
		</Box>
	);
};

export default Footer;
