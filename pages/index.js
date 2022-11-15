import { useState } from "react";
import {
  Button,
  Container,
  Heading,
  Stack,
  Text,
  HStack,
  Image as ChakraImg,
  Box,
  Flex,
  useToast,
  Spinner,
  RadioGroup,
  Radio,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

export default function Home() {
  const [petID, setPetID] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState("phone");
  const [lastSize, setLastSize] = useState();
  const toast = useToast();

  const generate = async (e) => {
    e.preventDefault();
    setLoading(true);

    // @ts-ignore
    if (petID < 0 || petID > 20000) {
      setLoading(false);
      return toast({
        title: "ID must be between 0 and 20,000",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    if (petID) {
      const result = await fetch(`/api/petID?id=${petID}&size=${size}`);
      const { error, ...arrBuffer } = await result.json();

      if (error) {
        setLoading(false);
        return toast({
          title: error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }

      const imgLink = Buffer.from(arrBuffer).toString("base64");

      setImage("data:image/png;base64," + imgLink);
      // @ts-ignore
      setLastSize(size);
    }
    setLoading(false);
  };

  return (
    <Container my="5" maxW="container.sm">
      <Stack spacing={4}>
        <Heading size="lg">Cool Pets wallpaper creator</Heading>

        <Text>
          Create a phone or desktop wallpaper. Choose which you want, input your
          pet ID #, and click generate.
        </Text>

        <Stack spacing={4} as="form" onSubmit={generate}>
          <RadioGroup size="lg" onChange={(v) => setSize(v)} value={size}>
            <HStack>
              <Radio value="phone">Phone</Radio>
              <Radio value="desktop">Desktop</Radio>
            </HStack>
          </RadioGroup>

          <HStack w="full">
            <NumberInput
              min={0}
              max={20000}
              size="lg"
              value={petID}
              onChange={setPetID}
            >
              <NumberInputField placeholder="Pet ID (ex: 5634)" />
            </NumberInput>

            <Button isLoading={loading} size="lg" minW="60%" type="submit">
              Generate
            </Button>
          </HStack>
        </Stack>

        <Box hidden={!image}>
          <Text mb={2} color="gray">
            On mobile, long-press the image and save to photos. On desktop,
            right-click save ;)
          </Text>

          <Box
            hidden={loading}
            shadow="2xl"
            maxW={lastSize === "desktop" ? "100%" : "50%"}
            mx="auto"
          >
            <ChakraImg border="1px solid" src={image} borderColor="gray.400" />
          </Box>
        </Box>

        <Flex minH="400px" justify="center" hidden={!loading} align="center">
          <Spinner size="xl" />
        </Flex>

        <CreatedBy />
      </Stack>
    </Container>
  );
}

const CreatedBy = () => (
  <Flex bg="white" align="flex-end" pos="fixed" right={0} bottom={0} px={2}>
    <Text
      color="gray"
      fontWeight={500}
      fontSize="2xl"
      verticalAlign="center"
      mr="1"
    >
      created by ju
    </Text>
    <Box mb={-1.5}>
      <Image src="/no-bg-small-4888.png" width={40} height={40} />
    </Box>
  </Flex>
);
