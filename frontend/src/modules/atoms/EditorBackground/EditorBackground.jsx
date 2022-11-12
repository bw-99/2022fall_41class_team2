import styled from "styled-components";

const Bg = styled.div`
  width: 100%;
  height: 100%;
  background: #eaeaea;

  padding: 18.55px 18.55px 18.55px 18.55px;

  font-family: "Gmarket Sans TTF";
  font-style: normal;
  font-weight: 500;
  font-size: 15.6237px;
  line-height: 18px;
  /* identical to box height */

  color: #1e1e1e;
`;

export const EditorBackground = ({ content, ...restProps }) => {
  return <Bg>{content}</Bg>;
};
