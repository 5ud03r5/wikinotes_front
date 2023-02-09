import { render, RenderResult } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactElement } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
const mockStore = configureStore();
const initialState = {
  auth: { authToken: { access_token: "your_token" } },
};
let store;
beforeEach(() => {
  store = mockStore(initialState);
});
const generateQueryClient = () => {
  return new QueryClient();
};

export function renderWithQueryClient(
  ui: ReactElement,
  client?: QueryClient
): RenderResult {
  const queryClient = generateQueryClient();

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
      </MemoryRouter>
    </Provider>
  );
}
