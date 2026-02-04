import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import type {
  FeaturebaseConfig,
  FeaturebaseClient as IFeaturebaseClient,
  ListPostsParams,
  CreatePostData,
  UpdatePostData,
  Post,
  PaginatedResponse,
  ListUpvotersParams,
  Upvoter,
  AddUpvoterData,
  ListCommentsParams,
  Comment,
  CreateCommentData,
  UpdateCommentData,
  ListChangelogsParams,
  Changelog,
  CreateChangelogData,
  UpdateChangelogData,
  PublishChangelogData,
  UnpublishChangelogData,
  PaginationParams,
  Subscriber,
  AddSubscriberData,
  GetUserParams,
  ListUsersParams,
  IdentifiedUser,
  UpsertUserData,
  CustomField,
  ListConversationsParams,
  CursorPaginatedResponse,
  Conversation,
  CreateConversationData,
  UpdateConversationData,
  ReplyToConversationData,
  ListHelpCentersParams,
  HelpCenter,
  ListCollectionsParams,
  Collection,
  CreateCollectionData,
  UpdateCollectionData,
  ListArticlesParams,
  Article,
  CreateArticleData,
  GetArticleParams,
  UpdateArticleData,
} from "./types.js";

interface RequestOptions {
  params?: Record<string, unknown>;
  body?: Record<string, unknown>;
  extraHeaders?: Record<string, string>;
}

export class FeaturebaseClient implements IFeaturebaseClient {
  private baseUrl: string;
  private apiKey: string;
  private orgUrl?: string;

  constructor(config: FeaturebaseConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.orgUrl = config.orgUrl;
  }

  private async request<T>(
    method: string,
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const { params, body, extraHeaders } = options;
    const url = new URL(`${this.baseUrl}${path}`);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null) continue;
        if (Array.isArray(value)) {
          for (const v of value) {
            url.searchParams.append(key, String(v));
          }
        } else {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const headers: Record<string, string> = {
      "X-API-Key": this.apiKey,
      "Content-Type": "application/json",
      ...extraHeaders,
    };

    const fetchOptions: RequestInit = { method, headers };
    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }

    let response: Response;
    try {
      response = await fetch(url.toString(), fetchOptions);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new McpError(ErrorCode.InternalError, `Network error: ${message}`);
    }

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorBody = await response.json();
        errorMessage =
          typeof errorBody === "object" && errorBody !== null
            ? JSON.stringify(errorBody)
            : String(errorBody);
      } catch {
        errorMessage = await response.text();
      }
      throw new McpError(
        ErrorCode.InternalError,
        `FeatureBase API error ${response.status}: ${errorMessage}`,
      );
    }

    return (await response.json()) as T;
  }

  private requireOrgUrl(): string {
    if (!this.orgUrl) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "orgUrl is required for this operation. Set FEATUREBASE_ORG_URL or pass --org-url.",
      );
    }
    return this.orgUrl;
  }

  // ── Posts ──────────────────────────────────────────────────────────────

  async listPosts(params?: ListPostsParams): Promise<PaginatedResponse<Post>> {
    return this.request("GET", "/posts", { params: params as Record<string, unknown> });
  }

  async createPost(data: CreatePostData): Promise<{ success: boolean; submission: { id: string } }> {
    return this.request("POST", "/posts", { body: data as unknown as Record<string, unknown> });
  }

  async updatePost(data: UpdatePostData): Promise<Post> {
    return this.request("PATCH", "/posts", { body: data as unknown as Record<string, unknown> });
  }

  async deletePost(id: string): Promise<{ success: boolean }> {
    return this.request("DELETE", "/posts", { body: { id } });
  }

  // ── Upvoters ───────────────────────────────────────────────────────────

  async listUpvoters(params: ListUpvotersParams): Promise<PaginatedResponse<Upvoter>> {
    return this.request("GET", "/posts/upvoters", { params: params as unknown as Record<string, unknown> });
  }

  async addUpvoter(data: AddUpvoterData): Promise<{ success: boolean }> {
    return this.request("POST", "/posts/upvoters", { body: data as unknown as Record<string, unknown> });
  }

  // ── Comments ───────────────────────────────────────────────────────────

  async listComments(params: ListCommentsParams): Promise<PaginatedResponse<Comment>> {
    return this.request("GET", "/comment", { params: params as Record<string, unknown> });
  }

  async createComment(data: CreateCommentData): Promise<{ success: boolean; comment: { id: string } }> {
    return this.request("POST", "/comment", { body: data as unknown as Record<string, unknown> });
  }

  async updateComment(data: UpdateCommentData): Promise<Comment> {
    return this.request("PATCH", "/comment", { body: data as unknown as Record<string, unknown> });
  }

  async deleteComment(id: string): Promise<{ success: boolean }> {
    return this.request("DELETE", "/comment", { body: { id } });
  }

  // ── Changelogs ─────────────────────────────────────────────────────────

  async listChangelogs(params?: ListChangelogsParams): Promise<PaginatedResponse<Changelog>> {
    return this.request("GET", "/changelog", { params: params as Record<string, unknown> });
  }

  async createChangelog(data: CreateChangelogData): Promise<Changelog> {
    return this.request("POST", "/changelog", { body: data as unknown as Record<string, unknown> });
  }

  async updateChangelog(data: UpdateChangelogData): Promise<Changelog> {
    return this.request("PATCH", "/changelog", { body: data as unknown as Record<string, unknown> });
  }

  async deleteChangelog(id: string): Promise<{ success: boolean }> {
    return this.request("DELETE", "/changelog", { body: { id } });
  }

  async publishChangelog(data: PublishChangelogData): Promise<{ success: boolean }> {
    return this.request("POST", "/changelog/publish", { body: data as unknown as Record<string, unknown> });
  }

  async unpublishChangelog(data: UnpublishChangelogData): Promise<{ success: boolean }> {
    return this.request("POST", "/changelog/unpublish", { body: data as unknown as Record<string, unknown> });
  }

  // ── Changelog Subscribers ──────────────────────────────────────────────

  async listSubscribers(params?: PaginationParams): Promise<PaginatedResponse<Subscriber>> {
    return this.request("GET", "/changelog/subscribers", { params: params as Record<string, unknown> });
  }

  async addSubscriber(data: AddSubscriberData): Promise<{ success: boolean }> {
    return this.request("POST", "/changelog/subscribers", { body: data as unknown as Record<string, unknown> });
  }

  async removeSubscriber(email: string): Promise<{ success: boolean }> {
    return this.request("DELETE", "/changelog/subscribers", { body: { email } });
  }

  // ── Users ──────────────────────────────────────────────────────────────

  async getUser(params: GetUserParams): Promise<IdentifiedUser> {
    return this.request("GET", "/organization/identifyUser", { params: params as Record<string, unknown> });
  }

  async listUsers(params?: ListUsersParams): Promise<PaginatedResponse<IdentifiedUser>> {
    return this.request("GET", "/organization/identifyUser/query", { params: params as Record<string, unknown> });
  }

  async upsertUser(data: UpsertUserData): Promise<IdentifiedUser> {
    return this.request("POST", "/organization/identifyUser", { body: data as unknown as Record<string, unknown> });
  }

  async deleteUser(params: GetUserParams): Promise<{ success: boolean }> {
    return this.request("DELETE", "/organization/identifyUser", { body: params as unknown as Record<string, unknown> });
  }

  // ── Conversations ────────────────────────────────────────────────────

  async listConversations(params?: ListConversationsParams): Promise<CursorPaginatedResponse<Conversation>> {
    return this.request("GET", "/conversations", { params: params as unknown as Record<string, unknown> });
  }

  async getConversation(id: string): Promise<Conversation> {
    return this.request("GET", `/conversations/${encodeURIComponent(id)}`);
  }

  async createConversation(data: CreateConversationData): Promise<Conversation> {
    return this.request("POST", "/conversations", { body: data as unknown as Record<string, unknown> });
  }

  async updateConversation(id: string, data: UpdateConversationData): Promise<Conversation> {
    return this.request("PATCH", `/conversations/${encodeURIComponent(id)}`, { body: data as unknown as Record<string, unknown> });
  }

  async deleteConversation(id: string): Promise<unknown> {
    return this.request("DELETE", `/conversations/${encodeURIComponent(id)}`);
  }

  async replyToConversation(id: string, data: ReplyToConversationData): Promise<Conversation> {
    return this.request("POST", `/conversations/${encodeURIComponent(id)}/reply`, { body: data as unknown as Record<string, unknown> });
  }

  // ── Custom Fields ──────────────────────────────────────────────────────

  async listCustomFields(): Promise<CustomField[]> {
    return this.request("GET", "/custom_fields");
  }

  async getCustomField(id: string): Promise<CustomField> {
    return this.request("GET", `/custom_fields/${encodeURIComponent(id)}`);
  }

  // ── Help Center (requires Nova API version header) ──────────────────────

  private static readonly NOVA_HEADERS = { "Featurebase-Version": "2026-01-01.nova" };

  async listHelpCenters(params?: ListHelpCentersParams): Promise<CursorPaginatedResponse<HelpCenter>> {
    return this.request("GET", "/help_center/help_centers", {
      params: params as unknown as Record<string, unknown>,
      extraHeaders: FeaturebaseClient.NOVA_HEADERS,
    });
  }

  async getHelpCenter(id: string): Promise<HelpCenter> {
    return this.request("GET", `/help_center/help_centers/${encodeURIComponent(id)}`, {
      extraHeaders: FeaturebaseClient.NOVA_HEADERS,
    });
  }

  async listCollections(params?: ListCollectionsParams): Promise<CursorPaginatedResponse<Collection>> {
    return this.request("GET", "/help_center/collections", {
      params: params as unknown as Record<string, unknown>,
      extraHeaders: FeaturebaseClient.NOVA_HEADERS,
    });
  }

  async createCollection(data: CreateCollectionData): Promise<Collection> {
    return this.request("POST", "/help_center/collections", {
      body: data as unknown as Record<string, unknown>,
      extraHeaders: FeaturebaseClient.NOVA_HEADERS,
    });
  }

  async getCollection(id: string): Promise<Collection> {
    return this.request("GET", `/help_center/collections/${encodeURIComponent(id)}`, {
      extraHeaders: FeaturebaseClient.NOVA_HEADERS,
    });
  }

  async updateCollection(id: string, data: UpdateCollectionData): Promise<Collection> {
    return this.request("PATCH", `/help_center/collections/${encodeURIComponent(id)}`, {
      body: data as unknown as Record<string, unknown>,
      extraHeaders: FeaturebaseClient.NOVA_HEADERS,
    });
  }

  async deleteCollection(id: string): Promise<unknown> {
    return this.request("DELETE", `/help_center/collections/${encodeURIComponent(id)}`, {
      extraHeaders: FeaturebaseClient.NOVA_HEADERS,
    });
  }

  async listArticles(params?: ListArticlesParams): Promise<CursorPaginatedResponse<Article>> {
    return this.request("GET", "/help_center/articles", {
      params: params as unknown as Record<string, unknown>,
      extraHeaders: FeaturebaseClient.NOVA_HEADERS,
    });
  }

  async createArticle(data: CreateArticleData): Promise<Article> {
    return this.request("POST", "/help_center/articles", {
      body: data as unknown as Record<string, unknown>,
      extraHeaders: FeaturebaseClient.NOVA_HEADERS,
    });
  }

  async getArticle(id: string, params?: GetArticleParams): Promise<Article> {
    return this.request("GET", `/help_center/articles/${encodeURIComponent(id)}`, {
      params: params as unknown as Record<string, unknown>,
      extraHeaders: FeaturebaseClient.NOVA_HEADERS,
    });
  }

  async updateArticle(id: string, data: UpdateArticleData): Promise<Article> {
    return this.request("PATCH", `/help_center/articles/${encodeURIComponent(id)}`, {
      body: data as unknown as Record<string, unknown>,
      extraHeaders: FeaturebaseClient.NOVA_HEADERS,
    });
  }

  async deleteArticle(id: string): Promise<unknown> {
    return this.request("DELETE", `/help_center/articles/${encodeURIComponent(id)}`, {
      extraHeaders: FeaturebaseClient.NOVA_HEADERS,
    });
  }

  // ── Utility (v1 API via org URL) ───────────────────────────────────────

  async resolvePostSlug(slug: string): Promise<Post> {
    const orgUrl = this.requireOrgUrl();
    const url = new URL("/api/v1/submission", orgUrl);
    url.searchParams.set("slug", slug);

    const headers: Record<string, string> = {
      "X-API-Key": this.apiKey,
      "Content-Type": "application/json",
    };

    let response: Response;
    try {
      response = await fetch(url.toString(), { headers });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new McpError(ErrorCode.InternalError, `Network error: ${message}`);
    }

    if (!response.ok) {
      throw new McpError(
        ErrorCode.InternalError,
        `FeatureBase API error ${response.status}: ${await response.text()}`,
      );
    }

    return (await response.json()) as Post;
  }

  async findSimilarPosts(query: string, locale?: string): Promise<Post[]> {
    const orgUrl = this.requireOrgUrl();
    const url = new URL("/api/v1/submission/getSimilarSubmissions", orgUrl);
    url.searchParams.set("query", query);
    if (locale) url.searchParams.set("locale", locale);

    const headers: Record<string, string> = {
      "X-API-Key": this.apiKey,
      "Content-Type": "application/json",
    };

    let response: Response;
    try {
      response = await fetch(url.toString(), { headers });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new McpError(ErrorCode.InternalError, `Network error: ${message}`);
    }

    if (!response.ok) {
      throw new McpError(
        ErrorCode.InternalError,
        `FeatureBase API error ${response.status}: ${await response.text()}`,
      );
    }

    return (await response.json()) as Post[];
  }
}
