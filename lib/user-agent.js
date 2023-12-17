import useragent from "express-useragent";
import { headers } from "next/headers";

export function getUserAgentProps() {
  const userAgent = headers().get("user-agent");
  const userAgentInfo = useragent.parse(userAgent);

  let deviceType = "desktop";

  if (userAgentInfo.isMobile) {
    deviceType = "mobile";
  } else if (userAgentInfo.isTablet) {
    deviceType = "tablet";
  }

  return {
    deviceType,
  };
}
