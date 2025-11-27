import { useAuth } from "../store/auth";
import {
	Box,
	Flex,
	HStack,
	IconButton,
	Button,
	useDisclosure,
	Stack,
	Link,
	AvatarFallback,
	AvatarImage,
	Separator,
} from "@chakra-ui/react";
import { FaBars, FaMoon, FaSun, FaTimes } from "react-icons/fa";
import { Avatar } from "./avatar";
import { useColorMode, useColorModeValue } from "./color-mode";

const Header: React.FC = () => {
	const { isLoggedIn, logout, user } = useAuth();
	const { open, onToggle } = useDisclosure();
	const { toggleColorMode } = useColorMode();
	const SwitchIcon = useColorModeValue(FaMoon, FaSun);

	return (
		<Box
			boxShadow="sm"
			px={6}
			py={3}
			position="sticky"
			top={0}
			zIndex={100}
			w={"100%"}>
			<Flex align="center" justify="space-between" maxW="6xl" mx="auto">
				<Link
					href="/"
					fontSize="2xl"
					fontWeight="extrabold"
					color="blue.600"
					_hover={{ color: "blue.700" }}>
					UniBlog
				</Link>

				<HStack display={{ base: "none", md: "flex" }}>
					<Link
						href="/blogs"
						fontWeight="medium"
						_hover={{ color: "blue.600" }}>
						Blogs
					</Link>

					<Link
						href="/posts"
						fontWeight="medium"
						_hover={{ color: "blue.600" }}>
						Posts
					</Link>

					<Separator orientation="vertical" height="4" ml={4} />

					{isLoggedIn ? (
						<>
							<Link
								href={`/profile/${user?.id}`}
								fontWeight="medium"
								_hover={{ color: "blue.600" }}>
								<Avatar>
									<AvatarFallback name={user?.userName} />
									<AvatarImage src={user?.profileImageUrl || ""} />
								</Avatar>
							</Link>

							<Button
								colorScheme="red"
								size="sm"
								onClick={() => {
									logout();
								}}>
								Logout
							</Button>
						</>
					) : (
						<Link
							href="/login"
							fontWeight="medium"
							_hover={{ color: "blue.600" }}>
							Login
						</Link>
					)}
					<IconButton variant="ghost" onClick={toggleColorMode}>
						<SwitchIcon />
					</IconButton>
				</HStack>

				<IconButton
					display={{ base: "flex", md: "none" }}
					onClick={onToggle}
					aria-label="Toggle Menu"
					size="lg">
					{open ? <FaTimes /> : <FaBars />}
				</IconButton>
			</Flex>

			{open && (
				<Box mt={3} display={{ md: "none" }}>
					<Stack>
						<Link
							href="/blogs"
							onClick={onToggle}
							py={2}
							px={3}
							borderRadius="md">
							Blogs
						</Link>

						<Link
							href="/posts"
							onClick={onToggle}
							py={2}
							px={3}
							borderRadius="md">
							Posts
						</Link>

						{isLoggedIn ? (
							<>
								<Link
									href={`/profile/${user?.id}`}
									fontWeight="medium"
									_hover={{ color: "blue.600" }}>
									<Avatar>
										<AvatarFallback name={user?.userName} />
										<AvatarImage src={user?.profileImageUrl || ""} />
									</Avatar>
								</Link>

								<Button
									onClick={() => {
										logout();
										onToggle();
									}}
									variant="ghost"
									justifyContent="flex-start">
									Logout
								</Button>
							</>
						) : (
							<>
								<Link href="/login">
									<Button
										variant="outline"
										colorScheme="blue"
										onClick={onToggle}>
										Login
									</Button>
								</Link>

								<Link href="/register">
									<Button colorScheme="blue" onClick={onToggle}>
										Register
									</Button>
								</Link>
							</>
						)}
						<IconButton variant="ghost" onClick={toggleColorMode}>
							<SwitchIcon />
						</IconButton>
					</Stack>
				</Box>
			)}
		</Box>
	);
};

export default Header;
