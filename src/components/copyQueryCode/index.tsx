import React from "react";
import CustomDropdownMenu from "../ui/dropDown";
const selectItems = ["Copy for curl", "Copy for python", "Copy for javascript"];
import { errorToast, successToast } from "../toast";

const CopyQuery = ({ Data, RenderItem, triggerClassNames }) => {
  const handleSelect = async (value) => {
    // https://${Data.endpoint.model.uri}
    const curl = `curl --location '${process.env.NEXT_PUBLIC_BASE_URL}v1/chat/completions' \\
                  --header 'Authorization: Bearer {API_KEY_HERE}' \\
                  --header 'Content-Type: application/json' \\
                  --data '{
                    "model": "${Data.endpoint.model.name}",
                    "max_tokens": "256",
                    "messages": [{"role": "user", "content": "Summarize the given text"}]
                  }'`;
    const python = `import requests
                    import json

                    url = "${process.env.NEXT_PUBLIC_BASE_URL}v1/chat/completions"

                    payload = json.dumps({
                      "model": ${Data.endpoint.model.name},
                      "max_tokens": "10",
                      "messages": [
                        {
                          "role": "user",
                          "content": "Summarize the given text"
                        }
                      ]
                    })
                    headers = {
                      'Authorization: Bearer {API_KEY_HERE}',
                      'Content-Type': 'application/json'
                    }

                    response = requests.request("POST", url, headers=headers, data=payload)

                    print(response.text)`;
    const js = `// WARNING: For POST requests, body is set to null by browsers.
                var data = JSON.stringify({
                  "model": ${Data.endpoint.model.name},
                  "max_tokens": "10",
                  "messages": [
                    {
                      "role": "user",
                      "content": "Summarize the given text"
                    }
                  ]
                });

                var xhr = new XMLHttpRequest();
                xhr.withCredentials = true;

                xhr.addEventListener("readystatechange", function() {
                  if(this.readyState === 4) {
                    console.log(this.responseText);
                  }
                });

                xhr.open("POST", "${process.env.NEXT_PUBLIC_BASE_URL}v1/chat/completions");
                xhr.setRequestHeader('Authorization: Bearer {API_KEY_HERE}');
                xhr.setRequestHeader("Content-Type", "application/json");

                xhr.send(data);`;

    let text;
    if (value === "Copy for curl") {
      text = curl;
    } else if (value === "Copy for python") {
      text = python;
    } else if (value === "Copy for javascript") {
      text = js;
    }

    try {
      await navigator.clipboard.writeText(text);
      successToast("Copied..");
    } catch (err) {
      errorToast("Failed to copy");
    }
  };

  return (
    <>
      <CustomDropdownMenu
        // contentRenderItem={
        //   selectItems.map((item, index) => (
        //     <Text_12_400_FFFFFF key={index}>{item}</Text_12_400_FFFFFF>
        //   ))
        // }
        items={selectItems}
        onSelect={handleSelect}
        triggerClassNames={triggerClassNames}
        contentClassNames="text-nowrap"
        triggerRenderItem={RenderItem}
      />
    </>
  );
};

export default CopyQuery;
