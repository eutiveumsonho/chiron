"use client";

import { Box, Button, Text } from "grommet";

export default function Empty(props) {
  const { empty } = props;

  return (
    <Box gap="small" pad="xlarge" align="center">
      <Text
        style={{
          textAlign: "center",
        }}
      >
        {empty.description}
      </Text>
      {empty?.label && empty?.callback ? (
        <Box>
          <Button
            label={empty.label}
            primary
            onClick={() => empty.callback()}
          />
        </Box>
      ) : null}
    </Box>
  );
}
