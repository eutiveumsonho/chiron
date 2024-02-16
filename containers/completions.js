/** @module containers/completions */
"use client";

import { Box, Button, Heading, Layer, List, Tag, Text } from "grommet";
import { useRef, useState } from "react";
import { Like, Dislike, Close } from "grommet-icons";
import ScriptEditor from "@/components/editor";
import {
  CHIRON_PREFIX,
  CHIRON_FOREIGN_KEY,
  CHIRON_VENDOR_ID,
} from "@/lib/config";
import { usePathname } from "next/navigation";
import { useRefreshData } from "@/lib/hooks";

const chironIdxKey = CHIRON_PREFIX + "idx";

/**
 * CompletionsContainer contains all logic for managing completions reviews
 *
 * @param {{ completions }} props
 */
export function CompletionsContainer(props) {
  const { completions } = props;
  const [selected, setSelected] = useState();
  const [reviewing, setReviewing] = useState(false);
  const monacoEditorRef = useRef(null);
  const editorRef = useRef(null);
  const pathname = usePathname();
  const { refresh } = useRefreshData();

  const readOnly = pathname !== "/completions/pending";

  const onInitializePane = (_, __, model) => {
    editorRef.current.focus();
    monacoEditorRef.current.setModelMarkers(model[0], "owner", null);
  };

  const getCompletionWithForeignKey = (completionId) => {
    return completions.find((completion) => {
      return completion[0]._id === completionId;
    })[1];
  };

  const onReview = async (direction) => {
    setReviewing(true);
    const data = editorRef.current.getModifiedEditor().getValue();

    const completionWithForeignKey = getCompletionWithForeignKey(
      JSON.parse(selected.item)._id,
    );

    const vendorId = completionWithForeignKey?.[CHIRON_VENDOR_ID];
    const foreignKey = completionWithForeignKey?.[CHIRON_FOREIGN_KEY];

    if (!vendorId || !foreignKey) {
      setReviewing(false);
      return alert("Missing data");
    }

    const res = await fetch("/api/data/completions/review", {
      method: "POST",
      body: JSON.stringify({
        direction,
        data: {
          ...JSON.parse(data),
          [CHIRON_VENDOR_ID]: vendorId,
          [CHIRON_FOREIGN_KEY]: foreignKey,
        },
      }),
    });

    if (res.status !== 200) {
      alert(res.statusText);
    } else {
      alert("Sucess");
      refresh();
    }

    setReviewing(false);
  };

  return (
    <Box gap="medium">
      <List
        primaryKey={(completion) => (
          <Text key={completion._id} size="medium" weight="bold">
            {completion._id}
          </Text>
        )}
        secondaryKey={(completion) => (
          <Box direction="row" gap="xsmall">
            {completions
              // TODO: abstract and generalize this is hack to identify duplicates
              .map((c) => c[0]?.dreamId === completion?.dreamId)
              ?.filter(Boolean)?.length > 1 ? (
              <Tag
                key={completion._id + "duplicate"}
                size="xsmall"
                value={"Duplicate"}
              />
            ) : null}
            <Tag
              key={completion._id + "vendorId"}
              size="xsmall"
              value={
                getCompletionWithForeignKey(completion._id)?.[CHIRON_VENDOR_ID]
              }
            />
          </Box>
        )}
        data={completions.map((completion) => completion[0])}
        itemProps={
          selected?.[chironIdxKey] >= 0
            ? { [selected?.[chironIdxKey]]: { background: "brand" } }
            : undefined
        }
        onClickItem={(event) => {
          const currentlySelected =
            selected?.[chironIdxKey] === event.index
              ? undefined
              : {
                  [chironIdxKey]: event.index,
                  item: JSON.stringify(event.item, null, 2),
                };
          setSelected(currentlySelected);
        }}
        pad={{ left: "small", right: "none", top: "small", bottom: "small" }}
      />
      {selected?.item ? (
        <Layer full animation="fadeIn">
          <Box justify="between" align="center" pad="small" direction="row">
            <Heading level={3} margin="none">
              Review {JSON.parse(selected.item)._id}
            </Heading>
            <Button
              icon={<Close />}
              hoverIndicator
              onClick={() => setSelected(undefined)}
            />
          </Box>
          <Box fill align="center" justify="center" pad="small">
            <ScriptEditor
              code={selected.item}
              originalCode={selected.item}
              onInitializePane={onInitializePane}
              editorRef={editorRef}
              monacoEditorRef={monacoEditorRef}
              readOnly={readOnly}
            />
            {readOnly ? null : (
              <Box
                align="center"
                justify="center"
                direction="row"
                pad="large"
                gap="medium"
              >
                <Button
                  label="Approve"
                  icon={<Like />}
                  disabled={reviewing}
                  primary
                  color="neutral-1"
                  onClick={() => onReview("pending2approve")}
                />
                <Button
                  label="Reject"
                  icon={<Dislike />}
                  disabled={reviewing}
                  primary
                  color="neutral-4"
                  onClick={() => onReview("pending2reject")}
                />
              </Box>
            )}
          </Box>
        </Layer>
      ) : null}
    </Box>
  );
}
