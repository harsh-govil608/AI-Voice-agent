/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as DiscussionRoom from "../DiscussionRoom.js";
import type * as aiAgents from "../aiAgents.js";
import type * as analytics from "../analytics.js";
import type * as coachingOptions from "../coachingOptions.js";
import type * as discussionRooms from "../discussionRooms.js";
import type * as enterpriseAnalytics from "../enterpriseAnalytics.js";
import type * as experts from "../experts.js";
import type * as organizations from "../organizations.js";
import type * as platformStats from "../platformStats.js";
import type * as seedDatabase from "../seedDatabase.js";
import type * as testimonials from "../testimonials.js";
import type * as userStats from "../userStats.js";
import type * as users from "../users.js";
import type * as voiceSessions from "../voiceSessions.js";
import type * as voiceSettings from "../voiceSettings.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  DiscussionRoom: typeof DiscussionRoom;
  aiAgents: typeof aiAgents;
  analytics: typeof analytics;
  coachingOptions: typeof coachingOptions;
  discussionRooms: typeof discussionRooms;
  enterpriseAnalytics: typeof enterpriseAnalytics;
  experts: typeof experts;
  organizations: typeof organizations;
  platformStats: typeof platformStats;
  seedDatabase: typeof seedDatabase;
  testimonials: typeof testimonials;
  userStats: typeof userStats;
  users: typeof users;
  voiceSessions: typeof voiceSessions;
  voiceSettings: typeof voiceSettings;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
