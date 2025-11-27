// src/compositions/layout.tsx
import React from "react";
import Header from "./header";
import Footer from "./footer";
import { VStack } from "@chakra-ui/react";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<VStack minHeight="100vh">
			<Header />
			<main className="flex-grow container mx-auto p-4">{children}</main>
			<Footer />
		</VStack>
	);
};

export default Layout;
