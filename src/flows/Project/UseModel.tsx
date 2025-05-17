
import DrawerCard from "@/components/ui/bud/card/DrawerCard";
import { BudWraperBox } from "@/components/ui/bud/card/wraperBox";

import { BudDrawerLayout } from "@/components/ui/bud/dataEntry/BudDrawerLayout";
import { BudForm } from "@/components/ui/bud/dataEntry/BudForm";
import { Text_12_400_757575, Text_12_400_EEEEEE, Text_12_600_EEEEEE, Text_20_400_FFFFFF } from "@/components/ui/text";
import { Image } from "antd";
import React, { useEffect, useState } from "react";
import Tags from "../components/DrawerTags";
import CustomDropDown from "../components/CustomDropDown";
import { errorToast, successToast } from "@/components/toast";
import { ChevronDown } from "lucide-react";
import { useEndPoints } from "src/hooks/useEndPoint";
import { copyCodeApiBaseUrl } from "@/components/environment";
import ToolTip from "@/components/ui/toolTip";
import CustomPopover from "../components/customPopover";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';


export default function UseModel() {
  const { clusterDetails } = useEndPoints();

  const tags = [
    {
      name: clusterDetails?.model?.name,
      color: '#D1B854'
    },
    {
      name: clusterDetails?.cluster?.name,
      color: '#D1B854'
    },
  ];

  const codeSnippets = {
    curl: `bash 
  curl --location '${copyCodeApiBaseUrl}' \\
    --header 'Authorization: Bearer {API_KEY_HERE}' \\
    --header 'Content-Type: application/json' \\
    --data '{ "model": "${clusterDetails?.name}",
            "max_tokens": "256",
            "messages": [{"role": "user", "content": "Summarize the given text"}]
            }'`,
    python: 
    `import requests
import json
url = "${copyCodeApiBaseUrl}"
payload = json.dumps({
 "model": "${clusterDetails?.name}",
 "max_tokens": "10",
 "messages": [
 {
   "role": "user",
    "content": "Summarize the given text"
   }
 ]
})
headers = {
 'Authorization': 'Bearer {API_KEY_HERE}',
 'Content-Type': 'application/json'
}
response = requests.request("POST", url, headers=headers, data=payload)
print(response.text)`,
    javascript: `\`\`\`javascript
  var data = JSON.stringify({
    "model": "${clusterDetails?.name}",
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
  xhr.open("POST", "${copyCodeApiBaseUrl}");
  xhr.setRequestHeader('Authorization: Bearer {API_KEY_HERE}');
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(data);\`\`\``,
  };


  const [selectedCode, setSelectedCode] = useState("curl");
  const [selectedText, setSelectedText] = useState(codeSnippets[selectedCode]);
  const [copyText, setCopiedText] = useState<string>('Copy');
  const selectType = async (type: string) => {
    const text = codeSnippets[type];
    setSelectedCode(type);
    setSelectedText(text);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // message.success('Text copied to clipboard!');
        setCopiedText("Copied..");
      })
      .catch(() => {
        // message.error('Failed to copy text.');
        setCopiedText("Failed to copy");
      });
  };

  useEffect(() => {
    setTimeout(() => {
      setCopiedText("Copy");
    }, 3000)
  }, [copyText]);

  return (
    <BudForm
      data={{}}
    >
      <BudWraperBox>
        <BudDrawerLayout>
          <DrawerCard>
            <div className="py-[.25rem]">
              <div className="flex justify-start items-center">
                <div className="text-[#EEEEEE] text-[1.125rem] leadign-[100%]">
                  {clusterDetails?.name}
                </div>
              </div>
              <div className="flex items-center justify-start gap-[.5rem] mt-[.3rem] flex-wrap	">
                {tags.map((item, index) => (
                  <Tags
                    key={index}
                    name={item.name}
                    color={item.color}
                  />
                ))}
              </div>
            </div>
          </DrawerCard>
        </BudDrawerLayout>
        <BudDrawerLayout>
          <DrawerCard>
            <div className="pt-[.9rem]">
              <Text_20_400_FFFFFF className="tracking-[.03rem]">Code Snippet</Text_20_400_FFFFFF>
              <Text_12_400_757575 className="tracking-[.004rem] mt-[1rem]">Copy the code below and use it for deployment</Text_12_400_757575>
            </div>
            <div className="pt-[1.4rem]">
              <CustomDropDown
                Placement="bottomLeft"
                buttonContent={
                  <div className="border border-[.5px] border-[#965CDE] rounded-[6px] bg-[#1E0C34] min-w-[4rem] min-h-[1.75rem] flex items-center justify-center px-[.6rem]">
                    <Text_12_600_EEEEEE className="flex items-center justify-center">
                      {selectedCode.charAt(0).toUpperCase() + selectedCode.slice(1)}
                    </Text_12_600_EEEEEE>
                    <ChevronDown className="w-[1rem] text-[#EEEEEE] text-[.75rem] ml-[.15rem]" />
                  </div>
                }
                items={[
                  {
                    key: "1",
                    label: <Text_12_400_EEEEEE>Curl</Text_12_400_EEEEEE>,
                    onClick: () => selectType("curl"),
                  },
                  {
                    key: "2",
                    label: <Text_12_400_EEEEEE>Python</Text_12_400_EEEEEE>,
                    onClick: () => selectType("python"),
                  },
                  {
                    key: "3",
                    label: <Text_12_400_EEEEEE>JavaScript</Text_12_400_EEEEEE>,
                    onClick: () => selectType("javascript"),
                  },
                ]}
              />

            </div>
            <div className="custom-code rounded-[8px] relative bg-[#FFFFFF08] mt-[1.5rem] w-full overflow-hidden">
              <CustomPopover title={copyText} contentClassNames="py-[.3rem]"
              Placement="topRight"
              >
                <div className="w-[1.25rem] h-[1.25rem] rounded-[4px] flex justify-center items-center absolute right-[0.35rem] top-[0.65rem] cursor-pointer hover:bg-[#1F1F1F]"
                  onClick={() => handleCopy(selectedText)}
                >

                  <Image
                    preview={false}
                    src="/images/drawer/Copy.png"
                    alt="info"
                    style={{ height: '.75rem' }}
                  />

                </div>
              </CustomPopover>
              {/* <MemoizedMarkdown content={selectedText} id={"code-block"} /> */}
              {/* <pre className="ibm text-[.75rem] text-[#EEEEEE] whitespace-pre-wrap">
                {selectedText}
              </pre> */}
              <div className="markdown-body"> {/* optional styling */}
                <SyntaxHighlighter
                  language="bash"
                  // dark, oneDark, dracula, atomDark, coldarkDark, materialDark, vs, vscDarkPlus
                  style={oneDark}
                  showLineNumbers
                >
                  {selectedText.replace(/^```[\w]*\n/, '').replace(/```$/, '')}
                </SyntaxHighlighter>

              </div>
            </div>
          </DrawerCard>
        </BudDrawerLayout>
      </BudWraperBox>
    </BudForm>
  );
}
