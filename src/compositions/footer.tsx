import React from "react";

const Footer: React.FC = () => {
	return (
		<footer className="bg-gray-100 text-gray-600 py-6 mt-12 border-t border-gray-200">
			<div className="container mx-auto text-center text-sm">
				<p>&copy; {new Date().getFullYear()} UniBlog. All rights reserved.</p>
				<p className="mt-1">Built with React Vite and ChakraUI</p>
			</div>
		</footer>
	);
};

export default Footer;
