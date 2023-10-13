"use client";

import { Box, Tab, Tabs } from "grommet";
import { usePathname, useRouter } from "next/navigation";

export default function CompletionsLayout(props) {
  const { children } = props;
  const pathname = usePathname();
  const { push } = useRouter();

  const indexes = {
    "/completions/pending": 0,
    "/completions/approved": 1,
    "/completions/rejected": 2,
  };

  const activeIndex = indexes[pathname];

  const onActive = (newIndex) => push(Object.keys(indexes)[newIndex]);

  return (
    <Box fill gap={"medium"} pad={"medium"}>
      <Tabs flex activeIndex={activeIndex} onActive={onActive}>
        <Tab title="Pending Reviews" />
        <Tab title="Approved" />
        <Tab title="Rejected" />
      </Tabs>
      {children}
    </Box>
  );
}
