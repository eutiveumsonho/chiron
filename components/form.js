"use client";

import { Box, Button, Form, Heading, Layer } from "grommet";

import { Close } from "grommet-icons";

export function FormPopUp(props) {
  const { onClose, open, heading, onSubmit, children, submitting } = props;

  return open ? (
    <Layer position="right" full="vertical" modal>
      <Box fill="vertical" overflow="auto" width="medium" pad="medium">
        <Form validate="blur" onSubmit={onSubmit}>
          <Box flex={false} direction="row" justify="between">
            <Heading level={2} margin="none">
              {heading}
            </Heading>
            <Button icon={<Close />} onClick={onClose} />
          </Box>
          {children}
          <Box flex={false} as="footer" align="start">
            <Button
              type="submit"
              label={submitting ? "Submitting" : "Submit"}
              primary
            />
          </Box>
        </Form>
      </Box>
    </Layer>
  ) : null;
}
