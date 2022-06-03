import { Hero, Section, SectionList, Form, Container } from "./components";

const sections = Array(10)
  .fill(null)
  .map((_, i) => i);

export default () => {
  return (
    <>
      <Hero />
      <Container>
        <SectionList>
          {sections.map((section) => (
            <Section key={section}></Section>
          ))}
        </SectionList>
        <Form />
      </Container>
    </>
  );
};
