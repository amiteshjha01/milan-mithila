# Discover Matches and Advanced Search UI

## Route

- `/discover` — frontend-only discovery experience with fictional profile data.

## Mock data

- `lib/mock-discover.ts` contains `DiscoverProfile`, filter groups, tabs, and transparent sample profile records.
- Profile records include explicit IDs, location, education, profession, family context, optional cultural fields, verification labels, availability, and sample discovery flags.
- Cultural fields are user-entered/sample preferences only. No compatibility, exclusion, rejection, or eligibility logic exists.

## Functional interactions

- Search by profile ID, name, city, or native district.
- Recommended, recently joined, recently active, shortlisted, and new matches tabs.
- Sorting by relevance, newest profiles, and age.
- Desktop filter sidebar and responsive mobile filter drawer.
- Multi-select filter groups across basic, family, cultural, and lifestyle categories.
- Searchable/user-entered values for location and cultural filters.
- Active filter chips, per-chip removal, reset all, and dynamic result count.
- Save-search frontend confirmation.
- View-profile quick-view modal.
- Send-interest state toggle.
- Shortlist/remove-shortlist toggle.
- Loading skeletons and empty-result state.

## Limitations

- No backend APIs, authentication, database reads, or persisted saved searches.
- No actual matching algorithm; recommended tabs use transparent sample flags.
- No official cultural master lists or automated Gotra/Mool rules.
- Full profile details remain reserved for the next frontend task.
