import { Flex, Text, Link } from "@chakra-ui/react";

export const Footer = () => (
  <Flex as="footer" direction="column" gap="2" pt="8" align="center">
    <Text fontSize="sm">
      &copy; {new Date().getFullYear()} silverbirder. All rights reserved.
    </Text>
    <Flex gap="4">
      <Link
        href="https://sites.google.com/view/silverbirders-services"
        target="_blank"
        rel="noopener noreferrer"
        fontSize="sm"
        color="blue.600"
        textDecoration="underline"
        _hover={{ color: "blue.800" }}
      >
        My Other Services
      </Link>
      <Link
        href="https://fequest.vercel.app/6"
        target="_blank"
        rel="noopener noreferrer"
        fontSize="sm"
        color="blue.600"
        textDecoration="underline"
        _hover={{ color: "blue.800" }}
      >
        Feature Requests
      </Link>
    </Flex>
  </Flex>
);
