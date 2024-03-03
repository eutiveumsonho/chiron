/** @module containers/api-management */
"use client";

import Empty from "@/components/empty";
import { FormPopUp } from "@/components/form";
import {
  Box,
  Button,
  FormField,
  Heading,
  List,
  Menu,
  Text,
  TextInput,
} from "grommet";
import { useEffect, useState } from "react";
import { StatusGood, More } from "grommet-icons";
import { useRefreshData } from "@/lib/hooks";

/**
 * The API Management container contains all logic for managing
 * API keys for Chiron from the front-end.
 *
 * @param {{ vendors }} props Props received from the server
 */
export default function ApiManagementContainer(props) {
  const { vendors } = props;
  const { refresh } = useRefreshData();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  useEffect(() => {
    if (editMode) {
      setOpen(true);
    }
  }, [editMode]);

  useEffect(() => {
    if (!open) {
      setEditMode(false);
    }
  }, [open]);

  const onSubmit = async (event) => {
    setSubmitting(true);
    const {
      value: { vendorName, vendorUrl, vendorCallbackUrl, reviewInstructions },
    } = event;

    const formattedUrl = new URL(vendorUrl);

    const data = {
      _id: editMode?._id,
      vendorName,
      vendorUrl: formattedUrl.origin,
      vendorCallbackUrl,
      reviewInstructions,
    };

    const response = await fetch("/api/vendors", {
      method: editMode ? "PATCH" : "POST",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      if (!editMode) {
        onClose();

        const data = await response.json();

        prompt(
          `
      This is the only time you will see this API key,
      so make sure you copy it and store it somewhere safe.`,
          JSON.stringify(data),
        );

        refresh();
      } else {
        onClose();
        alert("Updated successfully");
        refresh();
      }
    }

    setSubmitting(false);
  };

  if (!vendors || vendors.length === 0) {
    return (
      <>
        <Empty
          empty={{
            description: "No vendors available to manage yet",
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
    <>
      <Heading>API Management</Heading>
      <Button label="Add" onClick={onOpen} />
      <br />
      <List
        data={vendors}
        primaryKey={(item) => (
          <Text key={item.name} size="large" weight="bold">
            {item.name}
          </Text>
        )}
        secondaryKey={(item) => (
          <Text key={item.callbackUrl} size="small" color="dark-4">
            Callback URL: {item.callbackUrl}
          </Text>
        )}
        itemKey={(item) => item.name}
        pad={{ left: "small", right: "none" }}
        action={(item, index) => (
          <Menu
            key={index}
            icon={<More />}
            hoverIndicator
            items={[
              {
                label: "Delete",
                onClick: () => {
                  // @todo delete vendor
                },
              },
              {
                label: "Edit",
                onClick: () => {
                  setEditMode(item);
                },
              },
            ]}
          />
        )}
      />
      <Form
        open={open}
        onClose={onClose}
        onSubmit={onSubmit}
        submitting={submitting}
        editMode={editMode}
      />
    </>
  );
}

function Form(props) {
  const { onClose, open, onSubmit, submitting, editMode } = props;

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
        name="vendorName"
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
      >
        <TextInput name="vendorName" value={editMode?.name} />
      </FormField>
      <FormField
        label="Vendor URL"
        name="vendorUrl"
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
        <TextInput
          name="vendorUrl"
          aria-label="url"
          type="url"
          value={editMode?.url}
        />
      </FormField>
      <FormField
        label="Callback URL"
        name="vendorCallbackUrl"
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
        <TextInput
          name="vendorCallbackUrl"
          aria-label="url"
          type="url"
          value={editMode?.callbackUrl}
        />
      </FormField>
      <FormField
        label="Instructions for review"
        name="reviewInstructions"
        required
      >
        <TextInput
          name="reviewInstructions"
          value={editMode?.reviewInstructions}
        />
      </FormField>
    </FormPopUp>
  );
}
