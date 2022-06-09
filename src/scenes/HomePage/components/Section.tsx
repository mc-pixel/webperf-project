import { ReactNode, useMemo } from "react";
import capitalize from "lodash/capitalize";
import { faker } from "@faker-js/faker";
import s from "./Section.module.css";

export const Section = () => {
  const info = useMemo(
    () => ({
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraphs().split("\n"),
    }),
    []
  );

  return (
    <section className={s.container}>
      <h2 className={s.title}>{capitalize(info.title)}</h2>
      {info.body.map((paragraph, index) => (
        <p className={s.paragraph} key={index}>
          {paragraph}
        </p>
      ))}
    </section>
  );
};

interface SectionListProps {
  children: ReactNode;
}

export const SectionList = ({ children }: SectionListProps) => (
  <div className={s.list}>{children}</div>
);
