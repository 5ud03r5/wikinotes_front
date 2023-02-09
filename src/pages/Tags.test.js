import { screen } from "@testing-library/react";
import Tags from "./Tags";
import { renderWithQueryClient } from "../test-utils/test-utils";
import { waitFor } from "@testing-library/react";
describe("Tags component", () => {
  test("Check get fetch from API", async () => {
    renderWithQueryClient(<Tags></Tags>);
    await waitFor(() => expect(screen.getAllByTestId("tag")).toHaveLength(3));
  });

  test("Check loading spinner", async () => {
    renderWithQueryClient(<Tags></Tags>);
    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });
});
