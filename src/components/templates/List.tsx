"use client";
import {
    Box,
    Card,
    Flex,
    Grid,
    GridItem,
    Image,
    SimpleGrid,
    Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";

const ListMovie = ({ ...props }) => {

    const [data, setData] = useState({
        Page: {
            media: []
        }
    })

    return (
        <Box p={12} {...props} position={"relative"} background={"black"}>
            <SimpleGrid
                columns={[2, 5]}
                justifyContent={"center"}
                pt={12}
                gapX={5}
                gapY={12}
            >
                {data.Page.media.map((item: any, index: number) => {
                    return (
                        <GridItem key={index}>
                            <motion.div
                                whileHover={{ scale: 1.2 }}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                }}
                            >
                                <Flex justify={"center"}>
                                    <Image
                                        src={item.coverImage.large}
                                        width={160}
                                        height={240}
                                        alt={""}
                                        borderRadius="md"
                                    />
                                </Flex>
                                <div className="tw:flex tw:justify-center tw:h-full">
                                    <p className="tw:text-[0.8rem] tw:text-white">{item.title.romaji}</p>
                                </div>
                            </motion.div>
                        </GridItem>
                    );
                })}
            </SimpleGrid>
        </Box>
    );
};

export default ListMovie;