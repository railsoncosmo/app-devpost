import React from "react";
import { Container, Title } from "./styles";

function Header() {
  return (
    <Container>
      <Title>
        Dev
        <Title style={{ fontStyle: "italic", color: "#e52246" }}>Post</Title>
      </Title>
    </Container>
  );
}

export default Header;
