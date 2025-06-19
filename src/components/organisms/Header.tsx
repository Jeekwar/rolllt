"use client";
import {
    Flex,
    Box,
} from "@chakra-ui/react";
import { Input, InputGroup } from "@chakra-ui/react"
import dynamic from "next/dynamic"
const BiSearch = dynamic(() => import("react-icons/bi").then(mod => mod.BiSearch), { ssr: false })

const Header = () => {
    const menu = [
        {
            label: "Home",
            href: "",
        },
        {
            label: "Category",
            href: "/category",
        },
        {
            label: "Collection",
            href: "/collection",
        },
    ];

    const token = process.env.NEXT_PUBLIC_API_TOKEN

    console.log({token});
    

    const color = "white";
    return (
        <Box position={"sticky"} top={0} zIndex={3}>
            <Flex
                justify={"space-between"}
                align={"center"}
                px={12}
                py={4}
                bg={" rgba(21,2,2,0, 0)"}
            >
                <div>
                    <h1 className="font-extrabold">Rolllt</h1>
                </div>
                <div>
                    <InputGroup startElement={<BiSearch fontSize={24} color="crimson" />}>
                        <Input type="tel" placeholder="search" paddingLeft={24} />
                    </InputGroup>
                </div>
            </Flex>
        </Box>
    );
};

export default Header;