import { Tool } from "@modelcontextprotocol/sdk/types.js";

// ── Configuration ──────────────────────────────────────────────────────────

export interface FeaturebaseConfig {
  apiKey: string;
  baseUrl: string;
  orgUrl?: string;
}

// ── Tool module shape ──────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ToolHandler = (
  args: any,
) => Promise<{ content: Array<{ type: "text"; text: string }> }>;

export interface ToolModule {
  tools: Tool[];
  createHandlers: (client: FeaturebaseClient) => Record<string, ToolHandler>;
}

// ── API Client interface (avoids circular imports) ─────────────────────────

export interface FeaturebaseClient {
  // Posts
  listPosts(params?: ListPostsParams): Promise<PaginatedResponse<Post>>;
  createPost(data: CreatePostData): Promise<{ success: boolean; submission: { id: string } }>;
  updatePost(data: UpdatePostData): Promise<Post>;
  deletePost(id: string): Promise<{ success: boolean }>;

  // Upvoters
  listUpvoters(params: ListUpvotersParams): Promise<PaginatedResponse<Upvoter>>;
  addUpvoter(data: AddUpvoterData): Promise<{ success: boolean }>;

  // Comments
  listComments(params: ListCommentsParams): Promise<PaginatedResponse<Comment>>;
  createComment(data: CreateCommentData): Promise<{ success: boolean; comment: { id: string } }>;
  updateComment(data: UpdateCommentData): Promise<Comment>;
  deleteComment(id: string): Promise<{ success: boolean }>;

  // Changelogs
  listChangelogs(params?: ListChangelogsParams): Promise<PaginatedResponse<Changelog>>;
  createChangelog(data: CreateChangelogData): Promise<Changelog>;
  updateChangelog(data: UpdateChangelogData): Promise<Changelog>;
  deleteChangelog(id: string): Promise<{ success: boolean }>;
  publishChangelog(data: PublishChangelogData): Promise<{ success: boolean }>;
  unpublishChangelog(data: UnpublishChangelogData): Promise<{ success: boolean }>;

  // Changelog Subscribers
  listSubscribers(params?: PaginationParams): Promise<PaginatedResponse<Subscriber>>;
  addSubscriber(data: AddSubscriberData): Promise<{ success: boolean }>;
  removeSubscriber(email: string): Promise<{ success: boolean }>;

  // Users
  getUser(params: GetUserParams): Promise<IdentifiedUser>;
  listUsers(params?: ListUsersParams): Promise<PaginatedResponse<IdentifiedUser>>;
  upsertUser(data: UpsertUserData): Promise<IdentifiedUser>;
  deleteUser(params: GetUserParams): Promise<{ success: boolean }>;

  // Custom Fields
  listCustomFields(): Promise<CustomField[]>;
  getCustomField(id: string): Promise<CustomField>;

  // Conversations
  listConversations(params?: ListConversationsParams): Promise<CursorPaginatedResponse<Conversation>>;
  getConversation(id: string): Promise<Conversation>;
  createConversation(data: CreateConversationData): Promise<Conversation>;
  updateConversation(id: string, data: UpdateConversationData): Promise<Conversation>;
  deleteConversation(id: string): Promise<unknown>;
  replyToConversation(id: string, data: ReplyToConversationData): Promise<Conversation>;

  // Help Center
  listHelpCenters(params?: ListHelpCentersParams): Promise<CursorPaginatedResponse<HelpCenter>>;
  getHelpCenter(id: string): Promise<HelpCenter>;
  listCollections(params?: ListCollectionsParams): Promise<CursorPaginatedResponse<Collection>>;
  createCollection(data: CreateCollectionData): Promise<Collection>;
  getCollection(id: string): Promise<Collection>;
  updateCollection(id: string, data: UpdateCollectionData): Promise<Collection>;
  deleteCollection(id: string): Promise<unknown>;
  listArticles(params?: ListArticlesParams): Promise<CursorPaginatedResponse<Article>>;
  createArticle(data: CreateArticleData): Promise<Article>;
  getArticle(id: string, params?: GetArticleParams): Promise<Article>;
  updateArticle(id: string, data: UpdateArticleData): Promise<Article>;
  deleteArticle(id: string): Promise<unknown>;

  // Utility (v1 API via org URL)
  resolvePostSlug(slug: string): Promise<Post>;
  findSimilarPosts(query: string, locale?: string): Promise<Post[]>;
}

// ── Pagination ─────────────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

// ── Posts ───────────────────────────────────────────────────────────────────

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  authorPicture: string;
  commentsAllowed: boolean;
  organization: string;
  upvotes: number;
  upvoted: boolean;
  postCategory: PostCategory;
  postTags: PostTag[];
  postStatus: PostStatus;
  date: string;
  lastModified: string;
  comments: number;
  isSubscribed: boolean;
  inReview: boolean;
  customInputValues?: Record<string, unknown>;
}

export interface PostCategory {
  category: string;
  private: boolean;
  prefill: boolean;
  roles: string[];
  hiddenFromRoles: string[];
  id: string;
}

export interface PostTag {
  name: string;
  color: string;
  private: boolean;
  id: string;
}

export interface PostStatus {
  name: string;
  color: string;
  type: string;
  isDefault: boolean;
  id: string;
}

export interface ListPostsParams extends PaginationParams {
  id?: string;
  q?: string;
  category?: string[];
  status?: string[];
  sortBy?: string;
  startDate?: string;
  endDate?: string;
  select?: string;
}

export interface CreatePostData {
  title: string;
  category: string;
  content?: string;
  email?: string;
  authorName?: string;
  tags?: string[];
  commentsAllowed?: boolean;
  status?: string;
  date?: string;
  customInputValues?: Record<string, unknown>;
}

export interface UpdatePostData {
  id: string;
  title?: string;
  content?: string;
  status?: string;
  commentsAllowed?: boolean;
  category?: string;
  sendStatusUpdateEmail?: boolean;
  tags?: string[];
  inReview?: boolean;
  date?: string;
  customInputValues?: Record<string, unknown>;
}

// ── Upvoters ───────────────────────────────────────────────────────────────

export interface Upvoter {
  name: string;
  email: string;
  id: string;
}

export interface ListUpvotersParams extends PaginationParams {
  submissionId: string;
}

export interface AddUpvoterData {
  id: string;
  email: string;
  name: string;
}

// ── Comments ───────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  content: string;
  author: string;
  authorId: string;
  authorPicture: string;
  isPrivate: boolean;
  isDeleted: boolean;
  pinned: boolean;
  inReview: boolean;
  upvotes: number;
  downvotes: number;
  score: number;
  parentComment: string | null;
  path: string;
  createdAt: string;
  updatedAt: string;
  replies: Comment[];
  submission: string;
  organization: string;
}

export interface ListCommentsParams extends PaginationParams {
  submissionId?: string;
  changelogId?: string;
  privacy?: "public" | "private" | "all";
  inReview?: boolean;
  commentThreadId?: string;
  sortBy?: "best" | "top" | "new" | "old";
  select?: string;
}

export interface CreateCommentData {
  content: string;
  submissionId?: string;
  changelogId?: string;
  parentCommentId?: string;
  isPrivate?: boolean;
  sendNotification?: boolean;
  createdAt?: string;
  author?: {
    name: string;
    email: string;
    profilePicture?: string;
  };
}

export interface UpdateCommentData {
  id: string;
  content?: string;
  isPrivate?: boolean;
  pinned?: boolean;
  inReview?: boolean;
  createdAt?: string;
}

// ── Changelogs ─────────────────────────────────────────────────────────────

export interface Changelog {
  id: string;
  title: string;
  htmlContent?: string;
  markdownContent?: string;
  changelogCategories: string[];
  state: "draft" | "live";
  date: string;
}

export interface ListChangelogsParams extends PaginationParams {
  id?: string;
  q?: string;
  categories?: string[];
  state?: "draft" | "live";
  select?: string;
}

export interface CreateChangelogData {
  title: string;
  htmlContent?: string;
  markdownContent?: string;
  changelogCategories?: string[];
}

export interface UpdateChangelogData {
  id: string;
  title?: string;
  htmlContent?: string;
  markdownContent?: string;
  changelogCategories?: string[];
}

export interface PublishChangelogData {
  id: string;
  sendEmail: boolean;
  locales?: string[];
  scheduledDate?: string;
}

export interface UnpublishChangelogData {
  id: string;
  locales?: string[];
}

// ── Changelog Subscribers ──────────────────────────────────────────────────

export interface Subscriber {
  email: string;
  name: string;
  id: string;
}

export interface AddSubscriberData {
  email: string;
  name: string;
}

// ── Users ──────────────────────────────────────────────────────────────────

export interface IdentifiedUser {
  fbUserId: string;
  name: string;
  email: string;
  externalUserId?: string;
  customFields?: Record<string, unknown>;
  companies?: Company[];
  profilePicture?: string;
}

export interface Company {
  id?: string;
  name: string;
  monthlySpend?: number;
  createdAt?: string;
  customFields?: Record<string, unknown>;
}

export interface GetUserParams {
  email?: string;
  userId?: string;
}

export interface ListUsersParams extends PaginationParams {
  sortBy?: "topPosters" | "topCommenters" | "lastActivity";
  query?: string;
  segment?: string;
}

export interface UpsertUserData {
  email?: string;
  userId?: string;
  name?: string;
  profilePicture?: string;
  subscribedToChangelog?: boolean;
  companies?: Company[];
  customFields?: Record<string, unknown>;
  createdAt?: string;
  roles?: string[];
  locale?: string;
}

// ── Conversations ──────────────────────────────────────────────────────

export interface CursorPaginatedResponse<T> {
  object: "list";
  data: T[];
  nextCursor: string | null;
}

export interface ConversationAuthor {
  type: "lead" | "admin" | "bot" | "contact";
  id: string;
  name?: string;
  email?: string;
  profilePicture?: string | null;
}

export interface ConversationPart {
  object: "conversation_part";
  id: string;
  createdAt: string;
  updatedAt: string;
  author: ConversationAuthor;
  redacted?: boolean;
  partType: string;
  bodyHtml?: string;
  bodyMarkdown?: string;
  channel?: string;
  status?: string;
  snoozedUntil?: string | null;
}

export interface Conversation {
  object: "conversation";
  id: string;
  title: string;
  state: "open" | "closed" | "snoozed";
  isBlocked: boolean;
  priority: boolean;
  prioritySetAt: string | null;
  adminAssigneeId: string | null;
  teamAssigneeId: string | null;
  userPreferredLanguage: string;
  source: {
    channel: string;
    bodyHtml: string;
    bodyMarkdown: string;
    author: ConversationAuthor;
  };
  participants: ConversationAuthor[];
  botConversationState: string;
  disableCustomerReply: boolean;
  awaitingCustomerReply: boolean;
  lastActivityAt: string;
  waitingSince: string | null;
  snoozedUntil: string | null;
  createdAt: string;
  updatedAt: string;
  conversationParts?: ConversationPart[];
}

export interface ListConversationsParams {
  limit?: number;
  cursor?: string;
}

export interface CreateConversationData {
  from: {
    type: "contact" | "admin";
    id: string;
  };
  bodyMarkdown: string;
}

export interface UpdateConversationData {
  title?: string;
  state?: "open" | "closed" | "snoozed";
  adminAssigneeId?: string | null;
  teamAssigneeId?: string | null;
  snoozedUntil?: string | null;
  customAttributes?: Record<string, unknown>;
}

export interface ReplyToConversationData {
  type: "contact" | "admin";
  id: string;
  bodyMarkdown: string;
  messageType: "reply" | "note";
}

// ── Custom Fields ──────────────────────────────────────────────────────────

export interface CustomField {
  _id: string;
  label: string;
  type: "text" | "date" | "number" | "select" | "multi-select" | "checkbox";
  required: boolean;
  placeholder?: string;
  public: boolean;
}

// ── Help Center ───────────────────────────────────────────────────────────

export interface HelpCenter {
  id: string;
  name: string;
  identifier: string;
  websiteUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionIcon {
  type: string;
  value: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  icon?: CollectionIcon;
  parentId?: string | null;
  order?: number;
  helpCenterId: string;
  translations?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  description?: string;
  body: string;
  formatter?: "default" | "ai";
  icon?: CollectionIcon;
  parentId?: string | null;
  authorId?: string;
  state: "draft" | "live";
  helpCenterId: string;
  translations?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ListHelpCentersParams {
  cursor?: string;
  limit?: number;
}

export interface ListCollectionsParams {
  helpCenterId?: string;
  parentId?: string;
  cursor?: string;
  limit?: number;
}

export interface ListArticlesParams {
  helpCenterId?: string;
  collectionId?: string;
  state?: "draft" | "live";
  cursor?: string;
  limit?: number;
}

export interface GetArticleParams {
  state?: "draft" | "live";
}

export interface CreateCollectionData {
  name: string;
  description?: string;
  icon?: CollectionIcon;
  parentId?: string;
  translations?: Record<string, unknown>;
}

export interface UpdateCollectionData {
  name?: string;
  description?: string;
  icon?: CollectionIcon;
  parentId?: string;
  translations?: Record<string, unknown>;
}

export interface CreateArticleData {
  title: string;
  body: string;
  description?: string;
  formatter?: "default" | "ai";
  parentId?: string;
  icon?: CollectionIcon;
  state?: "draft" | "live";
  translations?: Record<string, unknown>;
}

export interface UpdateArticleData {
  title?: string;
  description?: string;
  body?: string;
  formatter?: "default" | "ai";
  icon?: CollectionIcon;
  parentId?: string;
  authorId?: string;
  state?: "draft" | "live";
  translations?: Record<string, unknown>;
}
