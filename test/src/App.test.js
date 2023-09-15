import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import App from "./App";
import AxiosMock from "axios";
import { mockresponse } from "./mockApiResponse";

afterEach(cleanup);

describe("test the APP component", () => {
  test("on page load fetch button should be rendered", () => {
    render(<App />);

    const fetchButton = screen.getByRole("button", { name: /fetch stories/i });
    expect(fetchButton).toBeVisible();
  });

  test("on click of fetch stories button, api should be triggered and response should be displayed as list", async () => {
    AxiosMock.get.mockResolvedValue(mockresponse);
    render(<App />);

    const fetchButton = screen.getByRole("button", { name: /fetch stories/i });
    expect(fetchButton).toBeVisible();

    await waitFor(() => {
      fireEvent.click(fetchButton);
      // checking if couple of elements from response are displayed or not after api call.
      expect(
        screen.getByText(/Relicensing React, Jest, Flow, and Immutable.js/i)
      ).toBeVisible();
      expect(screen.getByText(/Build Your Own React/i)).toBeVisible();
    });

    // checking whther length of list items rendered is equal to length of mock response received.
    const stories = screen.getByRole("list");
    const { getAllByRole } = within(stories);
    const storyitems = getAllByRole("listitem");
    expect(storyitems.length).toBe(mockresponse.data.hits.length);
    expect(screen.queryByText(/Something went wrong .../i)).toBeNull();
  });

  test("if api fails then error text should be displayed", async () => {
    AxiosMock.get.mockRejectedValue({ error: "error fetching data" });
    render(<App />);
    const fetchButton = screen.getByRole("button", { name: /fetch stories/i });
    expect(fetchButton).toBeVisible();
    await waitFor(() => {
      fireEvent.click(fetchButton);
      // checking whether error message is getting displayed in case of api failure
      expect(screen.getByText(/Something went wrong .../i)).toBeVisible();
    });
    // checking if the list rendered is empty or not.
    expect(screen.queryAllByRole("listitem").length).toBe(0);
  });

  test("to check the URL from which API is getting called", async () => {
    // just for this case i am assuming api is failing as I just want to validate the URL of API request
    AxiosMock.get.mockRejectedValue({ error: "error fetching data" });
    render(<App />);

    const fetchButton = screen.getByRole("button", { name: /fetch stories/i });
    expect(fetchButton).toBeVisible();
    await waitFor(() => {
      fireEvent.click(fetchButton);
      //  checking whether error message is getting displayed in case of api failure
      expect(screen.getByText(/Something went wrong .../i)).toBeVisible();
    });
    // checking whether API is getting called with requested URL
    expect(AxiosMock.get).toBeCalledWith(
      "http://hn.algolia.com/api/v1/search?query=React"
    );
  });
});
