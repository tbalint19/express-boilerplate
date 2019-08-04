# API

Resources:
  - __plural form instead of singular__:
    - _/api/users_ (~~/api/user~~)
  - __simple paths with query params instead of nested paths__:
    - _/api/tasks?id=1_ (~~/api/users/user_id/tasks~~)
    - _/api/player?team-id=1&person-id=1_ (works for multiple ids, nested paths do not)
  - __http methods instead of verbs__:
    - __POST->__ _/api/users_ (~~/api/users/create~~)
  - __hyphens instead of underscores or camel case__:
    - _/api/user-profiles_ (~~/api/user_profiles~~ / ~~/api/userProfiles~~)
  - __field in paths when permission requied__:
    - __PATCH->__ _/api/blog/title_
