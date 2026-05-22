export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface EndpointDef {
  name: string;
  method: HttpMethod;
  path: string;
  description: string;
}

export const ENDPOINTS: EndpointDef[] = [
  // ─── KWFinder ─────────────────────────────────────────────────────────────
  {
    name: "kwfinder_get_related_keywords",
    method: "GET",
    path: "/kwfinder/related-keywords",
    description:
      "KWFinder: Get related keyword suggestions for a seed keyword filtered by location and language. Returns volume, KD, CPC and related metrics. Typical query params: keyword, location_id, language_id.",
  },
  {
    name: "kwfinder_get_competitor_keywords",
    method: "GET",
    path: "/kwfinder/competitor-keywords",
    description:
      "KWFinder: Get keywords a domain/subdomain/URL ranks for in organic search, sorted by estimated organic visits.",
  },
  {
    name: "kwfinder_post_competitor_keywords",
    method: "POST",
    path: "/kwfinder/competitor-keywords",
    description:
      "KWFinder: POST variant of competitor-keywords; accepts a JSON body with filters when the GET querystring is insufficient.",
  },
  {
    name: "kwfinder_import_keywords",
    method: "POST",
    path: "/kwfinder/keyword-imports",
    description:
      "KWFinder: Import up to 700 keywords and return bulk metrics (KD, CPC, PPC, search volume history, average SV, organic SERP results, CTR).",
  },
  {
    name: "kwfinder_get_competitor_domains",
    method: "GET",
    path: "/kwfinder/competitor-domain",
    description:
      "KWFinder: List domains that compete with a URL/domain for organic keywords. Requires a recent (within 24h) competitor-keywords lookup for the same target.",
  },
  {
    name: "kwfinder_get_suggested_keywords",
    method: "GET",
    path: "/kwfinder/suggested-keywords",
    description:
      "KWFinder: Get keyword suggestions for a specific URL, focused on terms related to that page's content.",
  },
  {
    name: "kwfinder_export_keywords_csv",
    method: "POST",
    path: "/kwfinder/keywords",
    description:
      "KWFinder: Export keyword data as a CSV file (large-set export for external BI / reporting tools).",
  },
  {
    name: "kwfinder_get_trends",
    method: "GET",
    path: "/kwfinder/trends",
    description:
      "KWFinder: Get trend data (typically monthly search interest) for keywords — useful for seasonality and long-term interest.",
  },
  {
    name: "kwfinder_get_kd_url_metrics",
    method: "GET",
    path: "/kwfinder/kd/url-metrics",
    description:
      "KWFinder: Get keyword-difficulty URL metrics (authority signals used in KD calculations) for a specific URL.",
  },
  {
    name: "kwfinder_get_kd_requests",
    method: "GET",
    path: "/kwfinder/kd/requests",
    description:
      "KWFinder: Get KD lookup history for the account (audit how often KD is being requested).",
  },
  {
    name: "kwfinder_gap_analysis",
    method: "POST",
    path: "/kwfinder/gap-analysis",
    description:
      "KWFinder: Run a keyword gap analysis between multiple domains/URLs — returns keywords competitors rank for that yours does not.",
  },
  {
    name: "kwfinder_get_limits",
    method: "GET",
    path: "/kwfinder/limits",
    description:
      "KWFinder: Get current and free limits for KWFinder API usage (remaining keyword lookup credits).",
  },
  {
    name: "kwfinder_get_lists",
    method: "GET",
    path: "/kwfinder/lists",
    description:
      "KWFinder: List all custom keyword lists for the authenticated user.",
  },
  {
    name: "kwfinder_create_list",
    method: "POST",
    path: "/kwfinder/lists",
    description: "KWFinder: Create a new custom keyword list.",
  },
  {
    name: "kwfinder_get_list",
    method: "GET",
    path: "/kwfinder/lists/{list_id}",
    description:
      "KWFinder: Get all items (keywords) in a specific KWFinder list.",
  },
  {
    name: "kwfinder_update_list",
    method: "PATCH",
    path: "/kwfinder/lists/{list_id}",
    description:
      "KWFinder: Update metadata for a list (typically the list name).",
  },
  {
    name: "kwfinder_delete_list",
    method: "DELETE",
    path: "/kwfinder/lists/{list_id}",
    description:
      "KWFinder: Delete a custom list and all its stored keywords.",
  },
  {
    name: "kwfinder_add_keywords_to_list",
    method: "POST",
    path: "/kwfinder/lists/{list_id}/keyword",
    description: "KWFinder: Add new keywords to an existing list.",
  },
  {
    name: "kwfinder_remove_keywords_from_list",
    method: "DELETE",
    path: "/kwfinder/lists/{list_id}/keyword",
    description: "KWFinder: Remove specific keywords from a list.",
  },

  // ─── SERPWatcher ──────────────────────────────────────────────────────────
  {
    name: "serpwatcher_get_trackings",
    method: "GET",
    path: "/serpwatcher/trackings",
    description: "SERPWatcher: List all rank trackings in the account.",
  },
  {
    name: "serpwatcher_create_tracking",
    method: "POST",
    path: "/serpwatcher/trackings",
    description:
      "SERPWatcher: Create a new rank tracking for a domain (location, platform, initial keywords).",
  },
  {
    name: "serpwatcher_get_tracking",
    method: "GET",
    path: "/serpwatcher/trackings/{tracking_id}",
    description:
      "SERPWatcher (legacy): Get basic info for a single tracking. Prefer /detail or /stats for richer data.",
  },
  {
    name: "serpwatcher_delete_tracking",
    method: "DELETE",
    path: "/serpwatcher/trackings/{tracking_id}",
    description:
      "SERPWatcher: Delete a tracking and its keywords/reports (soft delete in-app).",
  },
  {
    name: "serpwatcher_update_tracking",
    method: "PUT",
    path: "/serpwatcher/trackings/{tracking_id}",
    description:
      "SERPWatcher: Update tracking-level settings (tracked domain, location, …).",
  },
  {
    name: "serpwatcher_get_tracking_detail",
    method: "GET",
    path: "/serpwatcher/trackings/{tracking_id}/detail",
    description:
      "SERPWatcher: Full details for a tracking including configuration and associated keywords.",
  },
  {
    name: "serpwatcher_get_tracking_stats",
    method: "POST",
    path: "/serpwatcher/trackings/{tracking_id}/stats",
    description:
      "SERPWatcher: Statistical data for a tracking — share-of-voice, average position, aggregated ranking metrics.",
  },
  {
    name: "serpwatcher_create_multiple_trackings",
    method: "POST",
    path: "/serpwatcher/multiple-trackings",
    description:
      "SERPWatcher: Bulk-create trackings for the same domain/keyword set across multiple location_ids × platform_ids pairs.",
  },
  {
    name: "serpwatcher_get_tracked_keywords",
    method: "GET",
    path: "/serpwatcher/trackings/{tracking_id}/tracked-keywords",
    description:
      "SERPWatcher: All tracked keywords in a tracking. Supports field filtering and optional inclusion of deleted keywords.",
  },
  {
    name: "serpwatcher_add_tracked_keyword",
    method: "POST",
    path: "/serpwatcher/trackings/{tracking_id}/tracked-keywords",
    description:
      "SERPWatcher: Add one or more keywords to a tracking.",
  },
  {
    name: "serpwatcher_remove_tracked_keyword",
    method: "DELETE",
    path: "/serpwatcher/trackings/{tracking_id}/tracked-keywords",
    description: "SERPWatcher: Remove a keyword from a tracking.",
  },
  {
    name: "serpwatcher_get_tracked_keyword",
    method: "GET",
    path: "/serpwatcher/trackings/{tracking_id}/tracked-keywords/{tracked_keyword_id}",
    description:
      "SERPWatcher: Details for a single tracked keyword (by internal tracked_keyword_id), including detailed history.",
  },
  {
    name: "serpwatcher_get_reports",
    method: "GET",
    path: "/serpwatcher/trackings/{tracking_id}/reports",
    description:
      "SERPWatcher: List configured email reports / alerts for a tracking.",
  },
  {
    name: "serpwatcher_create_report",
    method: "POST",
    path: "/serpwatcher/trackings/{tracking_id}/reports",
    description:
      "SERPWatcher: Create a scheduled report or rank-change alert (name, type weekly/monthly/rank-change, recipients, triggers).",
  },
  {
    name: "serpwatcher_delete_report",
    method: "DELETE",
    path: "/serpwatcher/trackings/{tracking_id}/reports/{report_id}",
    description: "SERPWatcher: Delete a specific report configuration.",
  },
  {
    name: "serpwatcher_update_report",
    method: "PUT",
    path: "/serpwatcher/trackings/{tracking_id}/reports/{report_id}",
    description:
      "SERPWatcher: Update settings of an existing report (recipients, frequency, …).",
  },
  {
    name: "serpwatcher_create_annotation",
    method: "POST",
    path: "/serpwatcher/trackings/{tracking_id}/annotations",
    description:
      "SERPWatcher: Create an annotation on a tracking (e.g. mark a site change or Google update for interpreting movements).",
  },
  {
    name: "serpwatcher_delete_annotation",
    method: "DELETE",
    path: "/serpwatcher/trackings/{tracking_id}/annotations/{annotation_id}",
    description: "SERPWatcher: Delete an existing annotation.",
  },
  {
    name: "serpwatcher_update_annotation",
    method: "PUT",
    path: "/serpwatcher/trackings/{tracking_id}/annotations/{annotation_id}",
    description:
      "SERPWatcher: Update the text/metadata of an existing annotation.",
  },
  {
    name: "serpwatcher_get_tags",
    method: "GET",
    path: "/serpwatcher/tags",
    description: "SERPWatcher: List all tags defined in the account.",
  },
  {
    name: "serpwatcher_get_tracking_tags",
    method: "GET",
    path: "/serpwatcher/trackings/{tracking_id}/tags",
    description: "SERPWatcher: List all tags assigned to a specific tracking.",
  },
  {
    name: "serpwatcher_create_tracking_tag",
    method: "POST",
    path: "/serpwatcher/trackings/{tracking_id}/tags",
    description:
      "SERPWatcher: Create and assign a new tag to a tracking.",
  },
  {
    name: "serpwatcher_delete_tracking_tag",
    method: "DELETE",
    path: "/serpwatcher/trackings/{tracking_id}/tags",
    description: "SERPWatcher: Remove a tag from a tracking.",
  },
  {
    name: "serpwatcher_update_tag",
    method: "PUT",
    path: "/serpwatcher/trackings/{tracking_id}/tags/{tag_id}",
    description: "SERPWatcher: Update tag details (name, color, …).",
  },
  {
    name: "serpwatcher_assign_tag",
    method: "POST",
    path: "/serpwatcher/trackings/{tracking_id}/tags/assign",
    description:
      "SERPWatcher: Assign one or more existing tags to a tracking.",
  },
  {
    name: "serpwatcher_unassign_tag",
    method: "POST",
    path: "/serpwatcher/trackings/{tracking_id}/tags/unassign",
    description:
      "SERPWatcher: Unassign one or more tags from a tracking.",
  },

  // ─── SERPChecker ──────────────────────────────────────────────────────────
  {
    name: "serpchecker_get_serps",
    method: "GET",
    path: "/serpchecker/serps",
    description:
      "SERPChecker: Detailed SERP for a keyword + location — organic and paid results, SERP features, ~50 SEO metrics per organic result, CTR estimates.",
  },
  {
    name: "serpchecker_reset_serps",
    method: "GET",
    path: "/serpchecker/serps/reset",
    description:
      "SERPChecker: Force a fresh SERP fetch and reparse for a keyword/location pair (bypass cache).",
  },
  {
    name: "serpchecker_get_snapshot",
    method: "GET",
    path: "/serpchecker/serps/{serp_id}/snapshot",
    description:
      "SERPChecker: URL to a stored HTML snapshot of the SERP (usually available ~60 days).",
  },

  // ─── LinkMiner ────────────────────────────────────────────────────────────
  {
    name: "linkminer_get_links",
    method: "GET",
    path: "/linkminer/links",
    description:
      "LinkMiner: Backlinks for a URL/domain/path. Up to 500 per page; paginate with `page`, control diversity with `links_per_domain`.",
  },
  {
    name: "linkminer_get_url_metrics",
    method: "GET",
    path: "/linkminer/url-metrics",
    description:
      "LinkMiner: Link metrics for a target URL — Citation Flow, Trust Flow, referring IPs, etc.",
  },
  {
    name: "linkminer_set_favorite",
    method: "PATCH",
    path: "/linkminer/favorite-links/{link_id}",
    description:
      "LinkMiner: Mark or unmark a link as favorite (for outreach / reporting prioritization).",
  },
  {
    name: "linkminer_get_favorites",
    method: "GET",
    path: "/linkminer/favorites",
    description: "LinkMiner: List all favorite links for the account.",
  },
  {
    name: "linkminer_get_favorite",
    method: "GET",
    path: "/linkminer/favorites/{link_id}",
    description: "LinkMiner: Details for a specific favorite link.",
  },
  {
    name: "linkminer_delete_favorite",
    method: "DELETE",
    path: "/linkminer/favorites/{list_id}",
    description: "LinkMiner: Remove a link from the favorites list.",
  },
  {
    name: "linkminer_get_exports",
    method: "GET",
    path: "/linkminer/exports",
    description:
      "LinkMiner: List all export tasks (sorted by creation time) available to download.",
  },
  {
    name: "linkminer_create_export",
    method: "POST",
    path: "/linkminer/exports",
    description:
      "LinkMiner: Create a new export task (e.g. large backlink dataset). Filters/scope go in the request body.",
  },
  {
    name: "linkminer_suggest_exports",
    method: "POST",
    path: "/linkminer/exports/suggest/",
    description:
      "LinkMiner: Helper that suggests suitable export configurations for a URL/domain.",
  },

  // ─── SiteProfiler ─────────────────────────────────────────────────────────
  {
    name: "siteprofiler_get_overview",
    method: "GET",
    path: "/siteprofiler/overview",
    description:
      "SiteProfiler: High-level overview for a domain/URL — MOZ + Majestic metrics (DA, PA, CF, TF), TopRank history, referring IPs, social signals.",
  },
  {
    name: "siteprofiler_get_audience",
    method: "GET",
    path: "/siteprofiler/audience",
    description:
      "SiteProfiler: Audience data for a domain (geo distribution and other available audience metrics).",
  },
  {
    name: "siteprofiler_get_backlink_profile",
    method: "GET",
    path: "/siteprofiler/backlink-profile",
    description:
      "SiteProfiler: Summary of a domain's backlink profile (totals, growth, distribution).",
  },
  {
    name: "siteprofiler_get_top_content",
    method: "GET",
    path: "/siteprofiler/top-content",
    description:
      "SiteProfiler: Top-performing content for a domain, typically sorted by backlinks or estimated traffic.",
  },
  {
    name: "siteprofiler_get_competitors",
    method: "GET",
    path: "/siteprofiler/competitors",
    description:
      "SiteProfiler: Competitor domains based on overlapping keywords and traffic.",
  },
  {
    name: "siteprofiler_get_requests",
    method: "GET",
    path: "/siteprofiler/requests",
    description:
      "SiteProfiler: History of recent SiteProfiler requests (also used for usage auditing across KWFinder/SERPChecker/LinkMiner).",
  },

  // ─── AI Search Watcher ────────────────────────────────────────────────────
  {
    name: "aiwatcher_get_models",
    method: "GET",
    path: "/aiwatcher/models",
    description:
      "AI Search Watcher: List available AI models / AI search engines supported (use when selecting models for a monitor).",
  },
  {
    name: "aiwatcher_get_monitors",
    method: "GET",
    path: "/aiwatcher/monitors",
    description:
      "AI Search Watcher: All AI monitors configured for the authenticated user.",
  },
  {
    name: "aiwatcher_create_monitor",
    method: "POST",
    path: "/aiwatcher/monitor",
    description:
      "AI Search Watcher: Create a new AI monitoring setup (brand, domain, location, platform, models[], prompts[], optional language_id). Returns the new monitor ID.",
  },
  {
    name: "aiwatcher_get_monitor",
    method: "GET",
    path: "/aiwatcher/monitor/{id}",
    description:
      "AI Search Watcher: Detailed analytics for a single monitor — mentions per model, citation sources, sentiment, visibility timeline. Filter via `models`, `from`, `to`.",
  },
  {
    name: "aiwatcher_delete_monitor",
    method: "DELETE",
    path: "/aiwatcher/monitor/{id}",
    description:
      "AI Search Watcher: Delete an AI monitor (stops new data collection; historical data may remain).",
  },
  {
    name: "aiwatcher_generate_prompts",
    method: "POST",
    path: "/aiwatcher/prompts/generate",
    description:
      "AI Search Watcher: Generate prompt suggestions for a brand (bootstrap relevant prompts before creating/expanding a monitor).",
  },
  {
    name: "aiwatcher_get_prompt",
    method: "GET",
    path: "/aiwatcher/prompt/{id}",
    description: "AI Search Watcher: Details of a single prompt by ID.",
  },
  {
    name: "aiwatcher_delete_prompts",
    method: "DELETE",
    path: "/aiwatcher/prompts",
    description:
      "AI Search Watcher: Delete one or more prompts (body structure determines which).",
  },
  {
    name: "aiwatcher_get_monitor_prompts",
    method: "GET",
    path: "/aiwatcher/monitor/{id}/prompts",
    description: "AI Search Watcher: All prompts associated with a monitor.",
  },
  {
    name: "aiwatcher_add_monitor_prompts",
    method: "POST",
    path: "/aiwatcher/monitor/{id}/prompts",
    description:
      "AI Search Watcher: Add new prompts to an existing monitor (expand what the monitor asks AI models).",
  },
  {
    name: "aiwatcher_get_monitor_settings",
    method: "GET",
    path: "/aiwatcher/monitor/{id}/settings",
    description:
      "AI Search Watcher: Current settings for a monitor (frequency, alerting, …).",
  },
  {
    name: "aiwatcher_update_monitor_settings",
    method: "PUT",
    path: "/aiwatcher/monitor/{id}/settings",
    description:
      "AI Search Watcher: Update settings for a monitor without recreating it.",
  },

  // ─── Shared ───────────────────────────────────────────────────────────────
  {
    name: "mangools_get_locations",
    method: "GET",
    path: "/mangools/locations",
    description:
      "Shared: All geotargeting locations supported by Mangools (used across KWFinder, SERPChecker, SERPWatcher, AI Search Watcher).",
  },
  {
    name: "mangools_get_location",
    method: "GET",
    path: "/mangools/locations/{location}",
    description:
      "Shared: Details for a single location ID (label, country code).",
  },
];

export function extractPathParams(path: string): string[] {
  const matches = path.match(/\{([^}]+)\}/g) ?? [];
  return matches.map((m) => m.slice(1, -1));
}
