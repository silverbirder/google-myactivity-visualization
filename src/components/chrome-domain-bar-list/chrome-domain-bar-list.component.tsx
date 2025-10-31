import { Box } from "@chakra-ui/react";
import { BarList, useChart, type BarListData } from "@chakra-ui/charts";
import type { DomainCount } from "./chrome-domain-bar-list.hook";

export type ChromeDomainBarListProps = {
  domains: DomainCount[];
};

export const ChromeDomainBarList = ({ domains }: ChromeDomainBarListProps) => {
  const chart = useChart<BarListData>({
    sort: { by: "value", direction: "desc" },
    data: domains.map((d: DomainCount) => ({
      name: d.domain,
      value: d.count,
    })),
    series: [{ name: "name", color: "teal.subtle" }],
  });

  return (
    <Box maxHeight="300px" overflowY="auto">
      <BarList.Root chart={chart}>
        <BarList.Content>
          <BarList.Bar />
          <BarList.Value />
        </BarList.Content>
      </BarList.Root>
    </Box>
  );
};
