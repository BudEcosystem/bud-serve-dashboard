import { playGroundUrl, askBudModel, askBudUrl } from "@/components/environment";
import React, { useEffect, useRef, useState } from "react";

const EmbeddedIframe = ({singleChat = false}: {singleChat?: boolean}) => {
  const [_accessToken, _setAccessToken] = useState("");
  const [_refreshToken, _setRefreshToken] = useState("");

  const iframeRef = useRef(null);
  let iframeUrl = `${playGroundUrl}/chat?embedded=true&access_token=${_accessToken}&refresh_token=${_refreshToken}&is_single_chat=${singleChat}`
  if(singleChat){
    iframeUrl += `&model=${askBudModel}&base_url=${askBudUrl}`
  }
  useEffect(() => {
    if (typeof window !== "undefined") {
      _setAccessToken(localStorage.getItem("access_token"));
      _setRefreshToken(localStorage.getItem("refresh_token"));
      const iframe = iframeRef.current;
      if (iframe && iframe.contentDocument) {
        const style = iframe.contentDocument.createElement("style");
        style.textContent = `
        body {
          background-color: #f0f0f0 !important;
        }
        /* Other CSS rules you want to inject */
      `;
        iframe.contentDocument.head.appendChild(style);
      }
    }
  }, []);

  if (!_accessToken || !_refreshToken) {
    return (
      <div style={{ width: "100%", height: "100%", border: "none" }}>
        <h1 className="text-[#000000] text-2xl font-bold">
          Access Denied. Please login to access the playground.
        </h1>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", border: "none" }}>
      <iframe
        ref={iframeRef}
        src={iframeUrl}
        style={{ width: "100%", height: "100%", border: "none" }}
        title="Playground"
        allowFullScreen={false}
      />
    </div>
  );
};

export default EmbeddedIframe;
