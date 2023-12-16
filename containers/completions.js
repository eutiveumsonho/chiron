/** @module containers/completions */
"use client";

import { Box, Button, List } from "grommet";
import { useRef, useState } from "react";
import { Like, Dislike } from "grommet-icons";
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

  const onReview = async (direction) => {
    setReviewing(true);
    const data = editorRef.current.getModifiedEditor().getValue();

    const completionWithForeignKey = completions.find((completion) => {
      return completion[0]._id === JSON.parse(selected.item)._id;
    })[1];

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
        <Box
          height={{
            min: "42.9rem",
          }}
        >
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
      ) : null}
    </Box>
  );
}
