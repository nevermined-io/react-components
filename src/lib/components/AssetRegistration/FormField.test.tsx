import React from "react";
import FormField from "./FormField";
import { render } from '@testing-library/react'
import MetaDataFormProvider from "lib/contexts/forms/MetaDataFormProvider";

describe("FormField", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <MetaDataFormProvider>
      <FormField
        label="Yo"
        type="textarea"
        className="textarea"
        id="test"
      />
      </MetaDataFormProvider>
    );

    expect(container.querySelector("textarea")).toBeDefined();
    expect(container.querySelector("label")).toHaveClass("textarea-label");

  })
});
