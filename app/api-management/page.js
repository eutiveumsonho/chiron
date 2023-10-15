"use client";

import Empty from "@/components/empty";
import { FormPopUp } from "@/components/form";
import { PageLayout } from "@/components/page-layout";
import { Box, FormField, TextInput } from "grommet";
import { useState } from "react";
import { StatusGood } from "grommet-icons";

export default function ApiManagementPage() {
  const integrations = [];
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const onSubmit = async (event) => {
    setSubmitting(true);
    const {
      value: { name: vendorName, url: vendorUrl },
    } = event;

    const formattedUrl = new URL(vendorUrl);

    const data = {
      vendorName,
      vendorUrl: formattedUrl.origin,
    };

    const response = await fetch("/api/api-keys", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      onClose();

      const data = await response.json();

      prompt(
        `
      This is the only time you will see this API key,
      so make sure you copy it and store it somewhere safe.`,
        JSON.stringify(data),
      );
    }

    setSubmitting(false);
  };

  if (!integrations || integrations.length === 0) {
    return (
      <>
        <Empty
          empty={{
            description: "No integrations available to manage yet",
            label: "Create one 🆕",
            callback: onOpen,
          }}
        />
        <Form
          open={open}
          onClose={onClose}
          onSubmit={onSubmit}
          submitting={submitting}
        />
      </>
    );
  }

  return (
    <PageLayout>
      {integrations.map((integration) => integration._id)}
      <Form
        open={open}
        onClose={onClose}
        onSubmit={onSubmit}
        submitting={submitting}
      />
    </PageLayout>
  );
}

function Form(props) {
  const { onClose, open, onSubmit, submitting } = props;

  return (
    <FormPopUp
      open={open}
      onClose={onClose}
      heading={"Add"}
      onSubmit={onSubmit}
      submitting={submitting}
    >
      <FormField
        label="Vendor Name"
        aria-label="name"
        name="name"
        required
        validate={[
          { regexp: /^[a-z]/i },
          (name) => {
            if (name && name.length === 1) return "must be >1 character";
            return undefined;
          },
          () => {
            return {
              message: (
                <Box align="end">
                  <StatusGood />
                </Box>
              ),
              status: "info",
            };
          },
        ]}
      />
      <FormField
        label="Vendor URL"
        name="url"
        required
        validate={[
          (url) => {
            try {
              new URL(url);
            } catch (error) {
              console.error(error);
              return "must be a valid url";
            }
          },
          () => {
            return {
              message: (
                <Box align="end">
                  <StatusGood />
                </Box>
              ),
              status: "info",
            };
          },
        ]}
      >
        <TextInput name="url" aria-label="url" type="url" />
      </FormField>
    </FormPopUp>
  );
}
