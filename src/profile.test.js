import React from "react";
import Profile from "./profile";
import { render } from "@testing-library/react";
import FindPeople from "./find-people";
import axios from "./axios";

// jest.mock("./axios");

test("when no bio is passed to it , add a bio is rendered", () => {
    const { container } = render(<Profile bio={null} />);
    expect(container.getElementsByClassName("bio-btn")[0].innerHTML).toBe(
        "Add a bio!"
    );
});
