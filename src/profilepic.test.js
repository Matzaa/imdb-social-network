import React from "react";
import Profilepic from "./profilepic";
import { render } from "@testing-library/react";

test("renders img with src", () => {
    const { container } = render(<Profilepic imageUrl="/turnips.jpg" />);
    expect(container.querySelector("img").getAttribute("src")).toBe(
        "/turnips.jpg"
    );
});
