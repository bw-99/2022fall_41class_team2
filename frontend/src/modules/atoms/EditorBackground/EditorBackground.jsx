import styled from "styled-components";
import { ResultVis } from "../../atoms";
import React, { useEffect, useCallback, useState } from "react";
import { Text } from "../../atoms";
import { useSelector, useDispatch } from "react-redux";
import { COLOR_SET } from "./../../../service/GetColor";
import {
  setTestcaseError,
  setTestcaseOn,
} from "./../../../pages/EditorPage/EditorAction";
import { apiClient } from "./../../../api/axios";
import { stringify } from "querystring";

const READABILITY = 0;
const EFFICIENCY = 1;
const FUNCTIONALITY = 2;

const GRADING = 0;
const DESCRIPTION = 1;
const RECOMMENDATION = 2;

const WindowWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background: ${(props) => (props.darkMode ? "#1F1F32" : "#eaeaea")};

  padding: 18.55px 18.55px 18.55px 18.55px;

  font-family: "Gmarket Sans TTF";
  font-style: normal;
  font-weight: 500;
  font-size: 15.6237px;
  line-height: 18px;
  /* identical to box height */

  color: ${(props) => (props.darkMode ? "#D8D8D8" : "#1e1e1e")};

  overflow-x: hidden;
  overflow-y: auto;

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 9.76px;
    background-color: ${(props) => (props.darkMode ? "#131323" : "#ffffff")};
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 975.505px;

    /* box-shadow: 0 0 1px
      ${(props) => (props.darkMode ? "#d3d3da" : "rgba(0, 0, 0, 0.5)")}; */
  }
`;

const Bg = styled.div`
  width: 100%;
  height: 42vh;
  background: ${(props) => (props.darkMode ? "#1F1F32" : "#eaeaea")};

  padding: 18.55px 18.55px 18.55px 18.55px;

  font-family: "Gmarket Sans TTF";
  font-style: normal;
  font-weight: 500;
  font-size: 15.6237px;
  line-height: 18px;
  /* identical to box height */

  color: ${(props) => (props.darkMode ? "#D8D8D8" : "#1e1e1e")};

  overflow-x: hidden;
  overflow-y: auto;

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 9.76px;
    background-color: ${(props) => (props.darkMode ? "#131323" : "#ffffff")};
    border-radius: 975.505px 975.505px 0px 0px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 975.505px;
    background-color: #d3d3da;
    /* box-shadow: 0 0 1px
      ${(props) => (props.darkMode ? "#d3d3da" : "rgba(0, 0, 0, 0.5)")}; */
  }
`;

const BgTestCase = styled.div`
  width: 100%;
  /* height: 42vh; */
  background: ${(props) => (props.darkMode ? "#1F1F32" : "#eaeaea")};

  padding: 18.55px 18.55px 18.55px 18.55px;

  font-family: "Gmarket Sans TTF";
  font-style: normal;
  font-weight: 500;
  font-size: 15.6237px;
  line-height: 18px;
  /* identical to box height */

  color: ${(props) => (props.darkMode ? "#D8D8D8" : "#1e1e1e")};

  overflow-x: hidden;
  overflow-y: auto;

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 9.76px;
    background-color: ${(props) => (props.darkMode ? "#131323" : "#d3d3da")};
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 975.505px;
    background-color: #d3d3da;
    /* box-shadow: 0 0 1px
      ${(props) => (props.darkMode ? "#d3d3da" : "rgba(0, 0, 0, 0.5)")}; */
  }
`;

const SubmitResultBg = styled.div`
  width: 100%;
  height: 100vh;
  background: ${(props) => (props.darkMode ? "#1F1F32" : "#eaeaea")};

  padding: 6px 0px 20px 0px;

  font-family: "Gmarket Sans TTF";
  font-style: normal;
  font-weight: 500;
  font-size: 15.6237px;
  line-height: 18px;
  /* identical to box height */

  color: ${(props) => (props.darkMode ? "#D8D8D8" : "#1e1e1e")};

  overflow-x: hidden;
  overflow-y: auto;

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 9.76px;
    background-color: ${(props) => (props.darkMode ? "#131323" : "#d3d3da")};
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 975.505px;
    background-color: #d3d3da;
    /* box-shadow: 0 0 1px
      ${(props) => (props.darkMode ? "#d3d3da" : "rgba(0, 0, 0, 0.5)")}; */
  }
`;

const Aligner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ResultVisContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  flex-wrap: wrap;
  /* height: 100vh; */
  width: 100%;
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
  height: 100%;

  width: 95%;
`;

const Separator = styled.div`
  display: grid;
  grid-template-columns: [col] 1fr [col] 1fr [col] 1fr;
  grid-template-rows: [row] 1fr;

  box-sizing: border-box;
`;
const ScoreDescriptor = styled.div`
  box-sizing: border-box;

  width: 100%;
  
  /* height: 100%; */
  /* height: 100vh; */

  height: 350px;
  /* min-height: 412px; */
  background: ${(props) => (props.darkMode ? "#525263" : "#f6f6f6")};
  border: ${(props) =>
    props.darkMode ? "2px solid #52c0e7" : "2px solid #52c0e7"};
  border-radius: 11px;
  padding: 18.55px 18.55px 18.55px 18.55px;

  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  overflow-x: hidden;
  overflow-y: auto;
  overflow: auto;

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 9.76px;
    background-color: ${(props) => (props.darkMode ? "#131323" : "#d3d3da")};
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 975.505px;
    background-color: #d3d3da;
    /* box-shadow: 0 0 1px
      ${(props) => (props.darkMode ? "#d3d3da" : "rgba(0, 0, 0, 0.5)")}; */
  }
`;
const CodeDescriptor = styled.div`
  box-sizing: border-box;

  width: 100%;

  height: 82vh;
  min-height: 412px;
  background: ${(props) => (props.darkMode ? "#525263" : "#f6f6f6")};
  border: ${(props) =>
    props.darkMode ? "2px solid #52c0e7" : "2px solid #52c0e7"};
  border-radius: 11px;
  padding: 18.55px 18.55px 18.55px 18.55px;

  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  overflow-x: hidden;
  overflow-y: auto;

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 9.76px;
    background-color: ${(props) => (props.darkMode ? "#131323" : "#d3d3da")};
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 975.505px;
    background-color: #d3d3da;
    /* box-shadow: 0 0 1px
      ${(props) => (props.darkMode ? "#d3d3da" : "rgba(0, 0, 0, 0.5)")}; */
  }
`;

const Button = styled.div`
  width: 100%;

  display: block;
  font-family: "Gmarket Sans TTF";
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* line-height: 21px; */
  /* identical to box height */

  text-align: center;
`;

const TestCaseInput = styled.div`
  display: flex;
`;
const TestCaseOutput = styled.div`
  display: flex;
`;
const TestCaseResult = styled.div`
  display: flex;
  grid-column: col 4;
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
`;

const TestCaseSeparator = styled.div`
  box-sizing: border-box;

  position: absolute;
  width: 450px;
  height: 0px;

  border: 4px solid #bfbfbf;
  transform: rotate(180deg);
`;

const TestCaseMasterGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: [col] 1fr [col] 1fr [col] 1fr [col] 1fr;
  grid-template-rows: auto;
`;
const TestCaseIOContainer = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: center;

  min-height: 80px;
  padding-top: 11px;
  grid-column: col 1 / span 3;
  border-top: 4px solid #bfbfbf;
  border-bottom: 4px solid #bfbfbf;
`;
// const TestCaseResultContainer = styled.div`
//   display: flex;
// `;

const ReadabilityHighlighter = styled.div`
  grid-column: col 1;
  color: ${(props) => (props.active ? "#FF9A3C" : "#1f1f32")};
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-itmes: stretch;
  background: ${(props) => (props.darkMode ? "#666681" : "#d9d9d9")};
  box-sizing: border-box;
  border: ${(props) =>
    props.active
      ? props.darkMode
        ? "1px solid #ffffff"
        : " 1px solid#000000"
      : "0"};
`;
const EfficiencyHighlighter = styled.div`
  color: ${(props) => (props.active ? "#98D964" : "#1f1f32")};
  grid-column: col 2;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-itmes: stretch;
  background: ${(props) => (props.darkMode ? "#666681" : "#d9d9d9")};
  box-sizing: border-box;
  border: ${(props) =>
    props.active
      ? props.darkMode
        ? "1px solid #ffffff"
        : " 1px solid#000000"
      : "0"};
`;
const FunctionalityHighlighter = styled.div`
  color: ${(props) => (props.active ? "#52C0E7" : "#1f1f32")};
  grid-column: col 3;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-itmes: stretch;
  background: ${(props) => (props.darkMode ? "#666681" : "#d9d9d9")};
  box-sizing: border-box;
  border: ${(props) =>
    props.active
      ? props.darkMode
        ? "1px solid #ffffff"
        : " 1px solid#000000"
      : "0"};
`;
const GradingHighlighter = styled.div`
  grid-column: col 1;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: ${(props) => (props.darkMode ? "#666681" : "#d9d9d9")};
  color: ${(props) => (props.darkMode ? "#d8d8d8" : "#3c3c3c")};
  box-sizing: border-box;
  border: ${(props) =>
    props.active
      ? props.darkMode
        ? "1px solid #ffffff"
        : " 1px solid#000000"
      : "0"};
`;
const DescriptionHighlighter = styled.div`
  grid-column: col 2;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: ${(props) => (props.darkMode ? "#666681" : "#d9d9d9")};
  color: ${(props) => (props.darkMode ? "#d8d8d8" : "#3c3c3c")};
  box-sizing: border-box;
  border: ${(props) =>
    props.active
      ? props.darkMode
        ? "1px solid #ffffff"
        : " 1px solid#000000"
      : "0"};
`;
const RecommendationHighlighter = styled.div`
  grid-column: col 3;
height: 30px;
display:flex;
justify-content: center;
align-items:center;
  border-radius: 5px;
  display:flex
  flex-direction:column;
  align-items:stretch;
  background: ${(props) => (props.darkMode ? "#666681" : "#d9d9d9")};
  color: ${(props) => (props.darkMode ? "#d8d8d8" : "#3c3c3c")};
  box-sizing:border-box;
  border: ${(props) =>
    props.active
      ? props.darkMode
        ? "1px solid #ffffff"
        : " 1px solid#000000"
      : "0"};
`;

const DescriptionContainer = styled.div`
  width: 100%;
  /* height: 400px; */
  /* overflow: auto; */

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 9.76px;
    background-color: ${(props) => (props.darkMode ? "#131323" : "#f6f6f6")};
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 975.505px;
    background-color: #d3d3da;
    /* box-shadow: 0 0 1px
      ${(props) => (props.darkMode ? "#d3d3da" : "rgba(0, 0, 0, 0.5)")}; */
  }
`;

// const TextShadower = styled.div`
//   box-shadow: 0px 4px 4px 0px #00000040 inset;
// `;
export const EditorBackground = ({
  // Need refactoring

  mode,
  content,
  darkMode,
  assignmentId,
  id,
  pfList,
  testCaseValue,
  prob,
  restr,
  ...restProps
}) => {
  const dispatch = useDispatch();
  const settingSelector = useSelector((state) => state.SettingReducer);
  const testcaseSelector = useSelector((state) => state.testcaseReducer);
  // redability result
  let readabilityResult = [];
  const [pfListLocal, setPfListLocal] = useState(pfList);
  const [testCaseData, setTestCaseData] = useState(testCaseValue);

  useEffect(() => {
    console.log("!!!!");
    console.log(testCaseValue);
    setTestCaseData(testCaseValue);
    console.log(testCaseData);
  }, [testCaseValue]);

  const repoSelector = useSelector((state) => state.editorReducer);
  // visualizing functionality result

  const [functionalityResult, setFunctionalityResult] = useState({});
  const onFunctionalityResultClick = () => {
    let temp_obj = {};
    // for (const testcase in content.functionality_result.testcase_results) {

    //  }
    content.functionality_result.testcase_results.forEach((testcase, index) => {
      temp_obj[`${testcase}${index}`] = testcase.is_pass ? 1 : 0;
    });
    setFunctionalityResult(temp_obj);
  };
  useEffect(() => {}, [functionalityResult]);

  const [activeIndexChart, setActiveIndexChart] = useState(READABILITY);
  const onButtonClickChart = useCallback(
    (flag) => {
      setActiveIndexChart(flag);

      if (flag === FUNCTIONALITY) {
        // Special handling
        console.log(`functionality: ${JSON.stringify(flag)}`);
        onFunctionalityResultClick();
      }

      // redability result
      readabilityResult = [];
      for (const [key, value] of Object.entries(content.readability_result)) {
        // console.log(`iter : ${key} , ${value}`);
        if (
          key !== "id" &&
          key !== "assignment_id" &&
          key !== "created_at" &&
          key !== "updated_at"
        ) {
          readabilityResult.push({ key: value });
        }
      }

      // console.log(`onclick : ${JSON.stringify(readabilityResult)}`);
    },
    [setActiveIndexChart]
  );
  useEffect(() => {}, [activeIndexChart]);

  const [activeIndexDesc, setActiveIndexDesc] = useState(GRADING);
  const onButtonClickDesc = useCallback(
    (flag) => {
      setActiveIndexDesc(flag);
    },
    [setActiveIndexDesc]
  );
  useEffect(() => {}, [activeIndexDesc]);

  const executeTestCase = async (testcase_id) => {
    try {
      const result = await apiClient.post(
        `/api/outputs/testcases/${testcase_id}/`,
        {
          language: repoSelector.selectedModel.content.language.toLowerCase(),
          code: repoSelector.selectedModel.content.code,
        }
      );
      return result;
    } catch (error) {}
  };

  if (mode === "testcase") {
    // console.log(content.input);
    return (
      <BgTestCase
        style={{
          backgroundColor:
            COLOR_SET["EDITOR_EXPLAIN_CONTENT"][
              settingSelector.backgroundColor
            ],
          color:
            COLOR_SET["EDITOR_EXPLAIN_CONTENT_FONT"][
              settingSelector.backgroundColor
            ],
        }}
      >
        <TestCaseMasterGrid>
          <TestCaseIOContainer>
            <TestCaseInput style={{ marginBottom: "11px" }}>
              Input: {content.input}
            </TestCaseInput>
            <TestCaseOutput style={{ marginBottom: "11px" }}>
              Expected Output: {content.output}
            </TestCaseOutput>
            <TestCaseOutput style={{ marginBottom: "11px" }}>
              Actual Output:
              {testCaseData.actual_output}
            </TestCaseOutput>

            {/* <ul>Input: {testcase.input}</ul>
            <ul>Expected Output: {testcase.expected_output}</ul>
            <ul>Actual Output: {testcase.actual_output}</ul> */}
          </TestCaseIOContainer>

          <TestCaseResult
            onClick={async () => {
              console.log("??");
              console.log(id);
              console.log(pfListLocal);
              console.log(testCaseData);

              if (testCaseData.is_pass == null && testCaseData.id) {
                dispatch(setTestcaseOn());
                const result = await executeTestCase(testCaseData.id);
                if( result.data.data.is_error) {
                  dispatch(
                    setTestcaseError(
                      result.data.data.is_error,
                      result.data.data.actual_output
                    )
                  );
                }
                
                setTestCaseData({
                  ...result.data.data,
                  id: testCaseData.id,
                });
                console.log("!!!!asdf");
                console.log(result.data.data);
                // console.log(result);
                // let tempPfList = [...testCaseData];
                // for (const key in tempPfList) {
                //   if(tempPfList[key].id == content.id) {
                //     tempPfList[key] = {
                //       ...result.data.data,
                //       id: content.id
                //     }
                //   }
                // }
                // testCaseData(tempPfList);
              }
            }}
          >
            {testCaseData.is_pass != null
              ? testCaseData.is_pass
                ? "PASS"
                : "FAIL"
              : "RESULT HERE"}
          </TestCaseResult>
        </TestCaseMasterGrid>
      </BgTestCase>
    );
    // return <Bg darkMode={darkMode}>{content}</Bg>;
  } else if (mode === "gradingAndExecution") {
    // console.log(content.input);
    const score =
      (pfListLocal.filter((pf) => pf.is_pass).length / pfListLocal.length) *
      100;

    return (
      <SubmitResultBg
        style={{
          backgroundColor:
            COLOR_SET["EDITOR_EXPLAIN_CONTENT"][
              settingSelector.backgroundColor
            ],
          color:
            COLOR_SET["EDITOR_EXPLAIN_CONTENT_FONT"][
              settingSelector.backgroundColor
            ],
        }}
      >
        <WindowWrapper
          style={{
            backgroundColor:
              COLOR_SET["EDITOR_EXPLAIN_CONTENT"][
                settingSelector.backgroundColor
              ],
            color:
              COLOR_SET["EDITOR_EXPLAIN_CONTENT_FONT"][
                settingSelector.backgroundColor
              ],
          }}
        >
          <div>{`총점: ${score}점`}</div>
          {pfListLocal.map((pf, index) => {
            let content = "";
            if (pf.is_hidden) {
              content = `히든 테스트케이스${index + 1}: ${pf.is_pass}`;
            } else {
              content = `공개 테스트케이스${index + 1}: ${pf.is_pass}`;
            }
            return <div style={{ marginTop: "16px" }}>{content} </div>;
          })}
        </WindowWrapper>
      </SubmitResultBg>
    );
  } else if (mode === "submit") {
    // SPECIAL CASE: ASSIGNMENT SUBMITTED

    return (
      <SubmitResultBg
        style={{
          backgroundColor:
            COLOR_SET["EDITOR_EXPLAIN_CONTENT"][
              settingSelector.backgroundColor
            ],
          color:
            COLOR_SET["EDITOR_EXPLAIN_CONTENT_FONT"][
              settingSelector.backgroundColor
            ],
        }}
      >
        <Aligner>
          <ResultVisContainer>
            {/* Separator */}
            <Separator
              style={{
                backgroundColor:
                  COLOR_SET["EDITOR_EXPLAIN_CONTENT"][
                    settingSelector.backgroundColor
                  ],
                color:
                  COLOR_SET["EDITOR_EXPLAIN_CONTENT_FONT"][
                    settingSelector.backgroundColor
                  ],
              }}
            >
              {/* TODO */}
              <GradingHighlighter
                active={activeIndexDesc === GRADING}
                style={{
                  backgroundColor:
                    COLOR_SET["EDITOR_EXPLAIN"][
                      settingSelector.backgroundColor
                    ],
                  color:
                    COLOR_SET["EDITOR_EXPLAIN_FONT"][
                      settingSelector.backgroundColor
                    ],
                }}
              >
                <Button onClick={() => onButtonClickDesc(GRADING)}>
                  제출 성적
                </Button>
              </GradingHighlighter>
              <DescriptionHighlighter
                active={activeIndexDesc === DESCRIPTION}
                style={{
                  backgroundColor:
                    COLOR_SET["EDITOR_EXPLAIN"][
                      settingSelector.backgroundColor
                    ],
                  color:
                    COLOR_SET["EDITOR_EXPLAIN_FONT"][
                      settingSelector.backgroundColor
                    ],
                }}
              >
                <Button onClick={() => onButtonClickDesc(DESCRIPTION)}>
                  코드 설명
                </Button>
              </DescriptionHighlighter>
              <RecommendationHighlighter
                active={activeIndexDesc === RECOMMENDATION}
                style={{
                  backgroundColor:
                    COLOR_SET["EDITOR_EXPLAIN"][
                      settingSelector.backgroundColor
                    ],
                  color:
                    COLOR_SET["EDITOR_EXPLAIN_FONT"][
                      settingSelector.backgroundColor
                    ],
                }}
              >
                <Button onClick={() => onButtonClickDesc(RECOMMENDATION)}>
                  관련 자료
                </Button>
              </RecommendationHighlighter>
            </Separator>
            {/* 제출 결과 */}
            {/* pie chart visualzation */}
            {activeIndexDesc === GRADING && (
              <div style={{ marginTop: "20px" }}>
                <Aligner>
                  <ChartContainer>
                    <Aligner>
                      {content.readability_result
                        ? activeIndexChart === READABILITY && (
                            <ResultVis
                              data={content.readability_result}
                              chartColor="#FF9A3C"
                            />
                          )
                        : activeIndexChart === READABILITY && (
                            <div style={{ width: "600px", height: "300px", textAlign:"left" }}>
                              {
                                repoSelector.selectedModel.content.language == "python"?
                                "제출 코드에 오류가 발생했습니다.":
                                "현재 가독성 채점 기능은 python만 지원합니다."
                              }
                              
                            </div>
                          )}
                      {content.efficiency_result
                        ? activeIndexChart === EFFICIENCY && (
                            <ResultVis
                              data={content.efficiency_result}
                              chartColor="#98D964"
                            />
                          )
                        : activeIndexChart === EFFICIENCY && (
                            <div style={{ width: "600px", height: "300px" }}>
                              {
                                repoSelector.selectedModel.content.language == "python"?
                                "제출 코드에 오류가 발생했습니다.":
                                "현재 효율성 채점 기능은 python만 지원합니다."
                              }
                            </div>
                          )}

                      {content.functionality_result
                        ? activeIndexChart === FUNCTIONALITY &&(
                          <ResultVis
                            data={content.functionality_result.testcase_results}
                            chartColor="#52C0E7"
                            radial={true}
                          />
                        )
                        : activeIndexChart === FUNCTIONALITY && (
                            <div style={{ width: "600px", height: "300px" }}>
                              {
                                repoSelector.selectedModel.content.language == "python"?
                                "제출 코드에 오류가 발생했습니다.":
                                "현재 기능성 채점 기능은 python만 지원합니다."
                              }
                            </div>
                          )}
                    </Aligner>
                    {/* pie chart selector */}

                    {/* Three colors
        가독성 : #FF9A3C
        효율 : #98D964
        기능 : #52C0E7 */}

                    <Separator>
                      <ReadabilityHighlighter
                        active={activeIndexChart === READABILITY}
                        style={{
                          backgroundColor:
                            COLOR_SET["EDITOR_EXPLAIN"][
                              settingSelector.backgroundColor
                            ],
                        }}
                      >
                        <Button onClick={() => onButtonClickChart(READABILITY)}>
                          가독성
                        </Button>
                      </ReadabilityHighlighter>
                      <EfficiencyHighlighter
                        active={activeIndexChart === EFFICIENCY}
                        style={{
                          backgroundColor:
                            COLOR_SET["EDITOR_EXPLAIN"][
                              settingSelector.backgroundColor
                            ],
                        }}
                      >
                        <Button onClick={() => onButtonClickChart(EFFICIENCY)}>
                          효율
                        </Button>
                      </EfficiencyHighlighter>
                      <FunctionalityHighlighter
                        active={activeIndexChart === FUNCTIONALITY}
                        style={{
                          backgroundColor:
                            COLOR_SET["EDITOR_EXPLAIN"][
                              settingSelector.backgroundColor
                            ],
                        }}
                      >
                        <Button
                          onClick={() => onButtonClickChart(FUNCTIONALITY)}
                        >
                          기능
                        </Button>
                      </FunctionalityHighlighter>
                    </Separator>
                  </ChartContainer>
                </Aligner>
                {/* score description */}
                <div
                  style={{
                    marginTop: "9px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {/* TODO: activeIndexDesc state 받아서 표시  */}

                  <ChartContainer>
                    <ScoreDescriptor
                      style={{
                        backgroundColor:
                          COLOR_SET["EDITOR_RESULT"][
                            settingSelector.backgroundColor
                          ],
                        color:
                          COLOR_SET["EDITOR_EXPLAIN_FONT"][
                            settingSelector.backgroundColor
                          ],
                      }}
                    >
                      {activeIndexChart === READABILITY &&
                        content.readability_result && (
                          <DescriptionContainer>
                            {/* {JSON.stringify(content.readability_result, null, 2)} */}
                            {Object.keys(content.readability_result)
                              .filter((k) => k !== "id")
                              .map(function (key) {
                                return (
                                  <div style={{ marginBottom: "11px" }}>
                                    {key} : {content.readability_result[key]}
                                  </div>
                                );
                              })}
                          </DescriptionContainer>
                        )}
                      {activeIndexChart === EFFICIENCY &&
                        content.efficiency_result && (
                          <DescriptionContainer>
                            {Object.keys(content.efficiency_result)
                              .filter((k) => k !== "id")
                              .map(function (key) {
                                return (
                                  <div style={{ marginBottom: "11px" }}>
                                    {key} : {content.efficiency_result[key]}
                                  </div>
                                );
                              })}
                          </DescriptionContainer>
                        )}
                      {activeIndexChart === FUNCTIONALITY &&
                        content.functionality_result && (
                          <DescriptionContainer>
                            {/*여러 테스트케이스가 어레이 형태로 있음, 다른 형태로 처리 필요 */}
                            {console.log(
                              JSON.stringify(
                                content.functionality_result.testcase_results
                              )
                            )}
                            {content.functionality_result.testcase_results.map(
                              (testcase, index) => {
                                if (!testcase.input) {
                                  if (testcase.is_hidden) {
                                    return (
                                      <>
                                        <div style={{ marginBottm: "11px" }}>
                                          {testcase.is_hidden ? "히든" : "공개"}{" "}
                                          테스트케이스 {index + 1} :{" "}
                                          {testcase.is_pass ? "PASS" : "FAIL"}
                                        </div>
                                        <div style={{ marginBottm: "0px" }}>
                                          <ul>Input: {testcase.input}</ul>
                                          <ul>
                                            Expected Output:{" "}
                                            {testcase.expected_output}
                                          </ul>
                                          <ul>
                                            Actual Output:{" "}
                                            {testcase.actual_output}
                                          </ul>
                                        </div>
                                      </>
                                    );
                                  }

                                  return <></>;
                                }
                                return (
                                  <>
                                    <div style={{ marginBottm: "11px" }}>
                                      {testcase.is_hidden ? "히든" : "공개"}{" "}
                                      테스트케이스 {index + 1} :{" "}
                                      {testcase.is_pass ? "PASS" : "FAIL"}
                                    </div>
                                    <div style={{ marginBottm: "0px" }}>
                                      <ul>Input: {testcase.input}</ul>
                                      <ul>
                                        Expected Output:{" "}
                                        {testcase.expected_output}
                                      </ul>
                                      <ul>
                                        Actual Output: {testcase.actual_output}
                                      </ul>
                                    </div>
                                  </>
                                );
                              }
                            )}
                          </DescriptionContainer>
                        )}
                    </ScoreDescriptor>
                  </ChartContainer>
                </div>
              </div>
            )}

            {activeIndexDesc === DESCRIPTION && (
              <div
                style={{
                  marginTop: "9px",
                  marginLeft: "7.5px",
                  marginRight: "7.5px",
                }}
              >
                <CodeDescriptor
                  style={{
                    backgroundColor:
                      COLOR_SET["EDITOR_EXPLAIN_CONTENT"][
                        settingSelector.backgroundColor
                      ],
                    color:
                      COLOR_SET["EDITOR_EXPLAIN_CONTENT_FONT"][
                        settingSelector.backgroundColor
                      ],
                  }}
                >
                  {content.code_description
                    ? content.code_description
                        .split("\n")
                        .map((line) => (
                          <div style={{ marginBottom: "11px" }}>{line}</div>
                        ))
                    :
                      repoSelector.selectedModel.content.language == "python"?
                      "제출 코드에 오류가 발생했습니다.":
                      "현재 코드 설명 기능은 python만 지원합니다."
                    }
                </CodeDescriptor>
                ;
              </div>
            )}
            {activeIndexDesc === RECOMMENDATION && (
              <div
                style={{
                  marginTop: "9px",
                  marginLeft: "7.5px",
                  marginRight: "7.5px",
                }}
              >
                <CodeDescriptor
                  style={{
                    backgroundColor:
                      COLOR_SET["EDITOR_EXPLAIN_CONTENT"][
                        settingSelector.backgroundColor
                      ],
                    color:
                      COLOR_SET["EDITOR_EXPLAIN_CONTENT_FONT"][
                        settingSelector.backgroundColor
                      ],
                      // maxWidth:"300px"
                  }}
                >
                  {content.references.map((ref, index) => {
                    return (
                      <div style={{ marginBottom: "50px" }}>
                        <div style={{
                          maxWidth:"500px"
                        }}>
                          {index + 1}.
                          <a href={ref} target="_blank">
                            {" "}
                            {ref}{" "}
                          </a>
                        </div>
                        {!ref.includes("youtu.be") &&
                          !ref.includes("namu.wiki") && (
                            <iframe
                              width={"500px"}
                              scrolling="no"
                              height={"300px"}
                              src={ref}
                              seamless
                            ></iframe>
                          )}
                      </div>
                    );
                  })}
                  
                  {/* {Object.keys(content.references)
                  .filter((k) => k !== "id")
                  .map(function (key) {
                    return (
                      <>
                        <div style={{ marginBottom: "11px" }}>{key}</div>
                        <div style={{ marginBottom: "11px" }}>
                          {content.efficiency_result[key]}
                        </div>
                      </>
                    );
                  })} */}
                </CodeDescriptor>
                ;
              </div>
            )}
          </ResultVisContainer>
        </Aligner>
      </SubmitResultBg>
    );
  } else {
    // problem/restrictions display
    console.log(content);

    return (
      <Bg
        style={{
          backgroundColor:
            COLOR_SET["EDITOR_EXPLAIN_CONTENT"][
              settingSelector.backgroundColor
            ],
          color:
            COLOR_SET["EDITOR_EXPLAIN_CONTENT_FONT"][
              settingSelector.backgroundColor
            ],
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: "11px" }}>문제</div>
        {prob.split("\n").map((line) => (
          <div style={{ marginBottom: "11px", lineHeight: "22px" }}>{line}</div>
        ))}
        <div style={{ fontWeight: "bold", marginBottom: "11px" }}>
          제약 사항
        </div>
        {restr.split("\n").map((line) => (
          <div style={{ marginBottom: "11px", lineHeight: "22px" }}>{line}</div>
        ))}
      </Bg>
    );
  }
};
