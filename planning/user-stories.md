# User Stories

## Template

As a **\_\_\_\_\_\_**, I want to **\_\_\_\_\_\_**, because **\_\_\_\_\_\_**.

---

### High Priority Stories

1. As any user, I can see a list of available maps to pick which one I want to look at.
2. As any user, I can view a map because I want to see the points of interest.
3. As any user, I am able to see many points of interest on a map because I want them all regrouped on one map.
4. As any user, I can see a title, description and image for each point of interest because it helps me identify it.
5. As an authenticated user, I can create a map because I love maps.
6. As an authenticated user, I can modify my own existing map(s) (add, edit, remove points) because I decided to change it.
7. As an authenticated user, I can favorite a map because I like to reference it often.
8. As an authenticated user, I have a profile indicating my favorite maps and maps I’ve contributed to.

---

# User Scenarios

A user scenario is a syntactic alternative to user stories

Template: Given **\_\_\_\_\_\_**, when **\_\_\_\_\_\_**, then **\_\_\_\_\_\_**.

---

# Resources (ie: nouns)

- maps
- points of interest
- title
- description
- image
- favorite maps
- maps I’ve contributed to

---
# Routes

Users
- ~~B- GET users/~~  (Not needed for MVD)
- R- GET users/:id
- ~~E- POST users/:id~~ (Not needed for MVD)
- A- POST users/
- ~~D- POST users/:id/delete~~ (Not needed for MVD)

Maps
- B- GET maps/
- R- GET maps/:id
- E- POST maps/:id
- A- POST maps/
- D- POST maps/:id/delete

Map Points
- B- GET map_point/
- ~~R- GET map_point/:id~~ (Not needed for MVD)
- E- POST map_point/:id
- A- POST map_point/
- D- POST map_point/:id/delete

Favourite Maps
- B- GET favourite_maps/
- R- GET favourite_maps/:id
- ~~E- POST favourite_maps/:id~~ (Not needed for MVD)
- A- POST favourite_maps/
- D- POST favourite_maps/:id/delete
