"use client";

import { Box } from "grommet";

export function PageLayout(props) {
  const { children } = props;

  return (
    <Box align="center" justify="center" pad="large">
      <Box width="medium">{children}</Box>
    </Box>
  );
}
