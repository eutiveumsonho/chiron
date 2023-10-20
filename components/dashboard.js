"use client";

import React, { cloneElement, useContext } from "react";
import {
  Avatar,
  Button,
  Box,
  Nav,
  Text,
  Sidebar as SidebarBase,
  Header,
  Page,
  PageContent,
  ResponsiveContext,
  Grommet,
  grommet,
} from "grommet";
import { Logout, DocumentTest, Contract } from "grommet-icons";
import { BRAND_HEX } from "../lib/config";
import { Logo } from "./logo";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const MOBILE_SIDEBAR_WIDTH = "4.5rem";
const MOBILE_HEADER_HEIGHT = "3.95rem";
const DESKTOP_SIDEBAR_WIDTH = "15rem";
const DESKTOP_HEADER_HEIGHT = "4.688rem";

const SidebarHeader = (props) => {
  const { serverSession, size, deviceType } = props;

  const isSmall = deviceType === "mobile" || size === "small";

  return (
    <Box
      align="center"
      gap="small"
      direction="row"
      margin={{ bottom: "xxsmall" }}
      justify="center"
    >
      {serverSession?.user?.image ? (
        <Avatar src={serverSession.user.image} />
      ) : null}
      {isSmall ? null : <Text>{serverSession?.user?.name}</Text>}
    </Box>
  );
};

const SidebarButton = ({ icon, label, selected, ...rest }) => (
  <Button
    gap="medium"
    justify="start"
    fill
    icon={cloneElement(icon, {
      color: selected ? "white" : undefined,
    })}
    label={label}
    plain
    {...rest}
    style={{
      ...rest.style,
      whiteSpace: "nowrap",
      height: "3rem",
      paddingLeft: "2rem",
      flex: "unset",
      background: selected ? BRAND_HEX : "transparent",
      color: selected ? "white" : "unset",
    }}
  />
);

const SidebarFooter = (props) => {
  const { size, deviceType } = props;

  const { push } = useRouter();
  const pathname = usePathname();

  const apiManagement = "/api-management";

  if (deviceType === "mobile" || size === "small") {
    return (
      <Nav gap="small">
        <Button
          icon={<Contract />}
          hoverIndicator={pathname !== apiManagement}
          primary={pathname === apiManagement}
          onClick={() => push(apiManagement)}
        />
        <Button
          icon={<Logout />}
          hoverIndicator
          onClick={async () => {
            await signOut({
              redirect: true,
            });
          }}
        />
      </Nav>
    );
  }

  return (
    <Nav>
      <SidebarButton
        icon={<Contract />}
        label={"API Management"}
        selected={pathname === apiManagement}
        onClick={() => push(apiManagement)}
      />
      <SidebarButton
        icon={<Logout />}
        label={"Logout"}
        onClick={async () => {
          await signOut({
            redirect: true,
          });
        }}
      />
    </Nav>
  );
};

/**
 * Navigation items are organized by
 * usage order (data from G.A.)
 */
const MainNavigation = (props) => {
  const { size, deviceType } = props;
  const { push } = useRouter();
  const pathname = usePathname();

  const completions = "/completions/";

  const matchCompletions = pathname.includes(completions);

  if (deviceType === "mobile" || size === "small") {
    return (
      <Nav gap="small">
        <Button
          icon={<DocumentTest />}
          hoverIndicator={!matchCompletions}
          primary={matchCompletions}
          onClick={() => push(completions + "pending")}
        />
      </Nav>
    );
  }

  return (
    <Nav gap="medium" fill="vertical" responsive={false}>
      <SidebarButton
        icon={<DocumentTest />}
        label={"Completions"}
        selected={matchCompletions}
        onClick={() => push(completions + "pending")}
      />
    </Nav>
  );
};

function MobileSidebar(props) {
  const { serverSession, size } = props;

  return (
    <SidebarBase
      elevation="large"
      responsive={false}
      background="light-1"
      header={
        <SidebarHeader
          serverSession={serverSession}
          size={size}
          deviceType={"mobile"}
        />
      }
      footer={<SidebarFooter size={size} deviceType="mobile" />}
      style={{
        top: MOBILE_HEADER_HEIGHT,
        height: `calc(100vh - ${MOBILE_HEADER_HEIGHT})`,
        minHeight: `calc(100vh - ${MOBILE_HEADER_HEIGHT})`,
        position: "fixed",
        minWidth: MOBILE_SIDEBAR_WIDTH,
        maxWidth: MOBILE_SIDEBAR_WIDTH,
        borderRight: `1px solid ${BRAND_HEX}`,
        // Trick to make the box-shadow from the sidebar and header look good
        zIndex: "11",
      }}
    >
      <MainNavigation
        size={size}
        serverSession={serverSession}
        deviceType={"mobile"}
      />
    </SidebarBase>
  );
}

function DesktopSidebar(props) {
  const { serverSession, size } = props;

  return (
    <SidebarBase
      responsive={false}
      elevation="large"
      header={
        <SidebarHeader
          serverSession={serverSession}
          size={size}
          deviceType={"desktop"}
        />
      }
      footer={<SidebarFooter deviceType="desktop" />}
      pad={{ left: "unset", right: "unset", vertical: "large" }}
      background="light-1"
      style={{
        position: "fixed",
        top: DESKTOP_HEADER_HEIGHT,
        height: `calc(100vh - ${DESKTOP_HEADER_HEIGHT})`,
        minHeight: `calc(100vh - ${DESKTOP_HEADER_HEIGHT})`,
        minWidth: DESKTOP_SIDEBAR_WIDTH,
        maxWidth: DESKTOP_SIDEBAR_WIDTH,
        borderRight: `1px solid ${BRAND_HEX}`,
        // Trick to make the box-shadow from the sidebar and header look good
        zIndex: "11",
      }}
    >
      <MainNavigation size={size} serverSession={serverSession} />
    </SidebarBase>
  );
}

function Sidebar(props) {
  const { serverSession, size, deviceType } = props;

  if (deviceType === "mobile" || size === "small") {
    return (
      <MobileSidebar
        serverSession={serverSession}
        size={size}
        deviceType={deviceType}
      />
    );
  }

  return (
    <DesktopSidebar
      serverSession={serverSession}
      size={size}
      deviceType={deviceType}
    />
  );
}

export default function Dashboard(props) {
  const { serverSession, children, deviceType } = props;
  const size = useContext(ResponsiveContext);

  const isSmall = deviceType === "mobile" || size === "small";

  return (
    <>
      <Grommet
        full
        theme={grommet}
        style={{
          overflow: "hidden",
        }}
      >
        <Header
          pad="small"
          style={{
            position: "fixed",
            width: "100vw",
            borderBottom: `1px solid ${BRAND_HEX}`,
            zIndex: "10",
          }}
          background="light-1"
          elevation="large"
        >
          <Box
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              margin: "auto",
              maxWidth: "96rem",
              // Trick to make the box-shadow from the sidebar and header look good
              zIndex: "9",
            }}
          >
            <Logo noTitle />
          </Box>
        </Header>
        <Page background="background-front" kind="full">
          <Box direction="row" height={{ min: "100%" }}>
            <Sidebar
              serverSession={serverSession}
              size={size}
              deviceType={deviceType}
            />
            <PageContent
              pad="medium"
              style={{
                width: isSmall
                  ? `calc(100vw - ${MOBILE_SIDEBAR_WIDTH})`
                  : `calc(100vw - ${DESKTOP_SIDEBAR_WIDTH})`,
                minHeight: isSmall
                  ? `calc(100vh - ${MOBILE_HEADER_HEIGHT})`
                  : `calc(100vh - ${DESKTOP_HEADER_HEIGHT})`,
                maxHeight: isSmall
                  ? `calc(100vh - ${MOBILE_HEADER_HEIGHT})`
                  : `calc(100vh - ${DESKTOP_HEADER_HEIGHT})`,
                minWidth: "0px",
                marginTop: isSmall
                  ? MOBILE_HEADER_HEIGHT
                  : DESKTOP_HEADER_HEIGHT,
                marginLeft: isSmall
                  ? MOBILE_SIDEBAR_WIDTH
                  : DESKTOP_SIDEBAR_WIDTH,
                overflow: "auto",
              }}
            >
              {children}
            </PageContent>
          </Box>
        </Page>
      </Grommet>
    </>
  );
}
