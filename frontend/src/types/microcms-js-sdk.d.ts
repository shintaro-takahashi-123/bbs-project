declare module "microcms-js-sdk" {
  export type MicroCMSClientConfig = {
    serviceDomain: string;
    apiKey: string;
  };

  export type GetListRequest = {
    endpoint: string;
  };

  export type GetListResponse<T = unknown> = {
    contents: T[];
    totalCount: number;
    limit: number;
    offset: number;
  };

  export type CreateRequest<T = Record<string, unknown>> = {
    endpoint: string;
    content: T;
  };

  export type DeleteRequest = {
    endpoint: string;
    contentId: string;
  };

  export type MicroCMSClient = {
    getList<T = unknown>(request: GetListRequest): Promise<GetListResponse<T>>;
    create<T = Record<string, unknown>>(request: CreateRequest<T>): Promise<unknown>;
    delete(request: DeleteRequest): Promise<void>;
  };

  export function createClient(config: MicroCMSClientConfig): MicroCMSClient;
}
