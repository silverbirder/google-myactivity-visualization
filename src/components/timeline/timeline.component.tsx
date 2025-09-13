"use client";

import { type TimelineData } from "./timeline.hook";
import { Timeline, Icon, Span, Box, Card } from "@chakra-ui/react";
import { LuClock } from "react-icons/lu";

const hours = Array.from({ length: 24 }, (_, i) => i + 1);

type Props = {
  data: TimelineData;
};

export const TimelineComponent = ({ data }: Props) => {
  return (
    <Box h="50vh" w="100%" overflowX="auto" overflowY="auto" px={4} py={2}>
      <Timeline.Root size="lg" variant="subtle" minW="fit-content">
        {hours.map((hour) => {
          let colorPalette = "blue";
          let indicatorColor = "blue.solid";
          if (hour >= 7 && hour <= 12) {
            colorPalette = "teal";
            indicatorColor = "teal.solid";
          } else if (hour >= 13 && hour <= 18) {
            colorPalette = "orange";
            indicatorColor = "orange.solid";
          } else if (hour >= 19 && hour <= 24) {
            colorPalette = "pink";
            indicatorColor = "pink.solid";
          }

          const hasData = data[hour] && Object.keys(data[hour]).length > 0;

          return (
            <Timeline.Item key={hour} minH="80px">
              <Timeline.Connector>
                <Timeline.Separator />
                <Timeline.Indicator bg={indicatorColor}>
                  <Icon fontSize="xs">
                    <LuClock />
                  </Icon>
                </Timeline.Indicator>
              </Timeline.Connector>
              <Timeline.Content
                gap="2"
                minH="80px"
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
              >
                <Timeline.Title>
                  <Span fontWeight="medium" color="fg.emphasized">
                    {hour.toString().padStart(2, "0")}:00
                  </Span>
                  <Span color="fg.muted" ml={2}>
                    {hasData ? "活動あり" : "活動なし"}
                  </Span>
                </Timeline.Title>
                {hasData && data[hour] && (
                  <Card.Root
                    size="sm"
                    variant="subtle"
                    colorPalette={colorPalette}
                  >
                    <Card.Body py={2} px={3}>
                      {Object.entries(data[hour]).map(
                        ([product, count], index) => {
                          const entries = Object.entries(data[hour] ?? {});
                          return (
                            <Box
                              key={product}
                              mb={index === entries.length - 1 ? 0 : 1}
                            >
                              <Span fontWeight="medium" fontSize="sm">
                                {product}
                              </Span>
                              <Span color="fg.muted" fontSize="xs" ml={2}>
                                ({count}件)
                              </Span>
                            </Box>
                          );
                        },
                      )}
                    </Card.Body>
                  </Card.Root>
                )}
              </Timeline.Content>
            </Timeline.Item>
          );
        })}
      </Timeline.Root>
    </Box>
  );
};
